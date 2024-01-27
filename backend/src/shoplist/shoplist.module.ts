import { Module } from '@nestjs/common';
import { ShoplistController } from './shoplist.controller';
import ShoplistService from './shoplist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopListItemEntity } from './shoplistitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopListItemEntity])],
  controllers: [ShoplistController],
  providers: [ShoplistService],
})
export class ShoplistModule {}
