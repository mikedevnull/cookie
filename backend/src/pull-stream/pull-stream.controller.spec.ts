import { Test, TestingModule } from '@nestjs/testing';
import { PullStreamController } from './pull-stream.controller.js';
import { DocumentUpdates } from 'src/replication.js';
import { ShopListItem } from '../shoplist/shoplistitem.interface.js';
import { Subject, firstValueFrom } from 'rxjs';
import { ShopListItemSubscriber } from '../shoplist/shoplistitemsubscriber.js';

describe('PullStreamController', () => {
  let controller: PullStreamController;
  let mockSubscriber: { events: Subject<DocumentUpdates<ShopListItem>> };

  beforeEach(async () => {
    mockSubscriber = {
      events: new Subject<DocumentUpdates<ShopListItem>>(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullStreamController],
      providers: [
        {
          provide: ShopListItemSubscriber,
          useValue: mockSubscriber,
        },
      ],
    }).compile();

    controller = module.get<PullStreamController>(PullStreamController);
  });

  it('sends shoplistitem update events', async () => {
    const updateEvent = firstValueFrom(controller.sse());
    const updatePayload = {
      documents: [
        {
          name: 'Item A',
          rank: 1,
          _deleted: false,
          active: true,
          lastUpdate: 2,
        },
      ],
      checkpoint: {
        id: 'Item A',
        updatedAt: 2,
      },
    };

    mockSubscriber.events.next(updatePayload);

    await expect(updateEvent).resolves.toEqual({
      data: updatePayload,
      event: 'shoplistitem',
    });
  });
});
