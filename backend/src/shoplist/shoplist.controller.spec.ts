import { Test, TestingModule } from '@nestjs/testing';
import { ShoplistController } from './shoplist.controller';

import ShoplistService from './shoplist.service';
import { DocumentChangeRow } from 'src/replication';
import { ShopListItem } from './shoplistitem.interface';

describe('ShoplistController', () => {
  let controller: ShoplistController;
  const mockedService = {
    findAllAfter: vi.fn(),
    createOrUpdate: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ShoplistService, useValue: mockedService }],
      controllers: [ShoplistController],
    }).compile();

    controller = module.get<ShoplistController>(ShoplistController);
  });

  it('Should return items found by service with new checkpoint', async () => {
    const fakeSearchResult = [
      { name: 'A', rank: 100, _deleted: false, active: false, lastUpdate: 10 },
      { name: 'B', rank: 90, _deleted: false, active: false, lastUpdate: 11 },
      { name: 'C', rank: 80, _deleted: true, active: true, lastUpdate: 12 },
      { name: 'D', rank: 70, _deleted: false, active: false, lastUpdate: 13 },
      { name: 'E', rank: 60, _deleted: true, active: true, lastUpdate: 14 },
    ];
    mockedService.findAllAfter.mockResolvedValueOnce(fakeSearchResult);

    const result = await controller.pull(10, 'A', 5);

    expect(mockedService.findAllAfter).toHaveBeenCalledTimes(1);
    expect(mockedService.findAllAfter).toHaveBeenCalledWith(10, 'A', 5);
    expect(result.documents).toEqual(fakeSearchResult);
    expect(result.checkpoint).toEqual({ updatedAt: 14, id: 'E' });
  });

  it('Should return conflicitng items found by service when pushing items', async () => {
    const fakeConflicts = [
      { name: 'A', rank: 100, _deleted: false, active: false, lastUpdate: 10 },
      { name: 'B', rank: 90, _deleted: false, active: false, lastUpdate: 11 },
    ];
    mockedService.createOrUpdate.mockResolvedValueOnce(fakeConflicts);

    const fakePushDocuments: DocumentChangeRow<ShopListItem>[] = [
      {
        newDocumentState: {
          name: 'A',
          rank: 100,
          _deleted: false,
          active: true,
          lastUpdate: 10,
        },
        assumedMasterState: {
          name: 'A',
          rank: 100,
          _deleted: false,
          active: false,
          lastUpdate: 10,
        },
      },
      {
        newDocumentState: {
          name: 'B',
          rank: 80,
          _deleted: false,
          active: true,
          lastUpdate: 11,
        },
        assumedMasterState: {
          name: 'B',
          rank: 90,
          _deleted: false,
          active: false,
          lastUpdate: 11,
        },
      },
      {
        newDocumentState: {
          name: 'C',
          rank: 80,
          _deleted: true,
          active: false,
          lastUpdate: 12,
        },
        assumedMasterState: {
          name: 'C',
          rank: 80,
          _deleted: true,
          active: true,
          lastUpdate: 12,
        },
      },
    ];

    const result = await controller.push(fakePushDocuments);

    expect(mockedService.createOrUpdate).toHaveBeenCalledTimes(1);
    expect(mockedService.createOrUpdate).toHaveBeenCalledWith(
      expect.arrayContaining(fakePushDocuments),
    );
    expect(result).toEqual(fakeConflicts);
  });
});
