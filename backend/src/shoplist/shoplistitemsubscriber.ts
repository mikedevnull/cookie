import {
  EventSubscriber,
  EntitySubscriberInterface,
  DataSource,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { ShopListItemEntity } from './shoplistitem.entity';
import { Subject, bufferTime, filter, map } from 'rxjs';
import { ShopListItem } from './shoplistitem.interface';

@EventSubscriber()
export class ShopListItemSubscriber
  implements EntitySubscriberInterface<ShopListItemEntity>
{
  private _input = new Subject<ShopListItem>();

  get events() {
    return this._input.pipe(
      bufferTime(250),
      filter((c) => c.length > 0),
      map((c) => ({
        documents: c,
        checkpoint: {
          id: c.at(-1).name,
          updatedAt: c.at(-1).lastUpdate,
        },
      })),
    );
  }

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ShopListItemEntity;
  }

  afterInsert(event: InsertEvent<ShopListItemEntity>) {
    this._input.next(event.entity);
  }
  afterUpdate(event: UpdateEvent<ShopListItemEntity>) {
    this._input.next(event.entity as ShopListItemEntity);
  }
}
