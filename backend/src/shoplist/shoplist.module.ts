import { Module } from '@nestjs/common';
import { ShoplistController } from './shoplist.controller.js';
import ShoplistService from './shoplist.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopListItemEntity } from './shoplistitem.entity.js';
import { ShopListItemSubscriber } from './shoplistitemsubscriber.js';

@Module({
  imports: [TypeOrmModule.forFeature([ShopListItemEntity])],
  controllers: [ShoplistController],
  providers: [ShoplistService, ShopListItemSubscriber],
})
export class ShoplistModule {}
