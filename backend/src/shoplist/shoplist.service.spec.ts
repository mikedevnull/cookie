import { Test, TestingModule } from '@nestjs/testing';
import ShoplistService from './shoplist.service';
import { ShopListItemEntity } from './shoplistitem.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopListItem } from './shoplistitem.interface';
import { ShopListItemSubscriber } from './shoplistitemsubscriber';
import { firstValueFrom, throwError, timeout } from 'rxjs';

const itemA400 = {
  name: 'Item A',
  rank: 90,
  active: true,
  _deleted: false,
  lastUpdate: 400,
} as const;
const itemB200 = {
  name: 'Item B',
  rank: 90,
  active: true,
  _deleted: false,
  lastUpdate: 200,
} as const;
const itemC500 = {
  name: 'Item C',
  rank: 90,
  active: true,
  _deleted: false,
  lastUpdate: 500,
} as const;
const itemD900 = {
  name: 'Item D',
  rank: 90,
  active: true,
  _deleted: false,
  lastUpdate: 900,
} as const;
const itemE300 = {
  name: 'Item E',
  rank: 90,
  active: true,
  _deleted: false,
  lastUpdate: 300,
} as const;
const itemF300 = {
  name: 'Item F',
  rank: 90,
  active: true,
  _deleted: false,
  lastUpdate: 300,
} as const;

const testData: ShopListItem[] = [
  itemC500,
  itemA400,
  itemF300,
  itemB200,
  itemE300,
  itemD900,
] as const;

describe('ShoplistService', () => {
  let service: ShoplistService;
  let eventProvider: ShopListItemSubscriber;
  let repository: Repository<ShopListItemEntity>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ShopListItemEntity],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([ShopListItemEntity]),
      ],
      providers: [ShoplistService, ShopListItemSubscriber],
    }).compile();

    service = module.get<ShoplistService>(ShoplistService);
    repository = module.get(getRepositoryToken(ShopListItemEntity));
    await repository
      .createQueryBuilder()
      .insert()
      .into(ShopListItemEntity)
      .values(testData)
      .execute();
    eventProvider = module.get(ShopListItemSubscriber);
  });

  afterEach(async () => {
    await module.close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return items after last checkpoint in order', async () => {
    const result = await service.findAllAfter(200, 'Item B', 5);

    expect(result).toEqual([itemE300, itemF300, itemA400, itemC500, itemD900]);
  });

  it('should take into account name ordering when change times are equal', async () => {
    const result = await service.findAllAfter(300, 'Item E', 5);

    expect(result).toEqual([itemF300, itemA400, itemC500, itemD900]);
  });

  it('should adhere to requested item limit', async () => {
    const result = await service.findAllAfter(0, '', 3);

    expect(result).toEqual([itemB200, itemE300, itemF300]);
  });

  it('should insert new items into the database', async () => {
    const insertEvent = firstValueFrom(
      eventProvider.events.pipe(
        timeout({
          each: 500,
          with: () => throwError(() => new Error('No event')),
        }),
      ),
    );
    const conflicts = await service.createOrUpdate([
      {
        newDocumentState: {
          name: 'Foo',
          rank: 42,
          active: true,
          _deleted: false,
          lastUpdate: 1000,
        },
      },
    ]);

    expect(conflicts.length).toBe(0);
    const itemInDb = await repository.findOneBy({ name: 'Foo' });
    expect(itemInDb).toEqual({
      name: 'Foo',
      rank: 42,
      active: true,
      _deleted: false,
      lastUpdate: 1000,
    });
    await expect(insertEvent).resolves.toEqual({
      documents: [
        {
          name: 'Foo',
          rank: 42,
          active: true,
          _deleted: false,
          lastUpdate: 1000,
        },
      ],
      checkpoint: {
        id: 'Foo',
        updatedAt: 1000,
      },
    });
  });

  it('should update existing items in the database', async () => {
    const updateEvent = firstValueFrom(
      eventProvider.events.pipe(
        timeout({
          each: 500,
          with: () => throwError(() => new Error('No event')),
        }),
      ),
    );
    const newItem = {
      ...itemA400,
      active: !itemA400.active,
      lastUpdate: 1000,
    } as const;
    const conflicts = await service.createOrUpdate([
      { newDocumentState: newItem, assumedMasterState: itemA400 },
    ]);

    expect(conflicts.length).toBe(0);

    const itemInDb = await repository.findOneBy({ name: 'Item A' });
    expect(itemInDb).toEqual(newItem);
    await expect(updateEvent).resolves.toEqual({
      documents: [newItem],
      checkpoint: {
        id: newItem.name,
        updatedAt: newItem.lastUpdate,
      },
    });
  });

  it('should detect and report conflicts if assumed state mismatches', async () => {
    const updateEvent = firstValueFrom(
      eventProvider.events.pipe(
        timeout({
          each: 500,
          with: () => throwError(() => new Error('No event')),
        }),
      ),
    );
    const newItem = {
      ...itemA400,
      active: !itemA400.active,
      lastUpdate: 1000,
    } as const;
    const conflicts = await service.createOrUpdate([
      {
        newDocumentState: newItem,
        assumedMasterState: { ...itemA400, lastUpdate: 300 },
      },
    ]);

    expect(conflicts).toEqual([itemA400]);

    const itemInDb = await repository.findOneBy({ name: 'Item A' });
    expect(itemInDb).toEqual(itemA400);
    await expect(updateEvent).rejects.toEqual(Error('No event'));
  });

  it('should detect and report conflicts if no assumed state but item exists', async () => {
    const updateEvent = firstValueFrom(
      eventProvider.events.pipe(
        timeout({
          each: 500,
          with: () => throwError(() => new Error('No event')),
        }),
      ),
    );
    const newItem = {
      ...itemA400,
      active: !itemA400.active,
      lastUpdate: 1000,
    } as const;
    const conflicts = await service.createOrUpdate([
      {
        newDocumentState: newItem,
      },
    ]);

    expect(conflicts).toEqual([itemA400]);

    const itemInDb = await repository.findOneBy({ name: 'Item A' });
    expect(itemInDb).toEqual(itemA400);
    await expect(updateEvent).rejects.toEqual(Error('No event'));
  });
});
