import { Module } from '@nestjs/common';
import { PullStreamController } from './pull-stream.controller.js';
import { ShopListItemSubscriber } from 'src/shoplist/shoplistitemsubscriber.js';

@Module({
  imports: [ShopListItemSubscriber],
  controllers: [PullStreamController],
})
export class PullStreamModule {}
