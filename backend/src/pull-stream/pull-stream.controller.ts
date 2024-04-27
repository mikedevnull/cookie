import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ShopListItemSubscriber } from '../shoplist/shoplistitemsubscriber.js';

@Controller('pull-stream')
export class PullStreamController {
  private _shopListsUpdates: Observable<MessageEvent>;

  constructor(shopListEvents: ShopListItemSubscriber) {
    this._shopListsUpdates = shopListEvents.events.pipe(
      map((updateEvent) => ({ data: updateEvent, event: 'shoplistitem' })),
    );
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this._shopListsUpdates;
  }
}
