import { Module } from '@nestjs/common';
import { PullStreamController } from './pull-stream.controller';
import { ShopListItemSubscriber } from 'src/shoplist/shoplistitemsubscriber';

@Module({
  imports: [ShopListItemSubscriber],
  controllers: [PullStreamController],
})
export class PullStreamModule {}
