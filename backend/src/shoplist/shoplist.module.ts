import { Module } from '@nestjs/common';
import { ShoplistController } from './shoplist.controller';
import ShoplistService from './shoplist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopListItem } from './shoplistitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopListItem])],
  controllers: [ShoplistController],
  providers: [ShoplistService],
})
export class ShoplistModule {}
