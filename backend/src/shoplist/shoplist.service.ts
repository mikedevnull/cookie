import { Injectable } from '@nestjs/common';
import { ShopListItem } from './shoplistitem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export default class ShoplistService {
  constructor(
    @InjectRepository(ShopListItem)
    private _itemRepository: Repository<ShopListItem>,
  ) {}

  async findAllAfter(
    updatedAt: number,
    id: string,
    limit?: number,
  ): Promise<ShopListItem[]> {
    return this._itemRepository.find({
      where: [
        { lastUpdate: MoreThan(updatedAt) },
        { lastUpdate: updatedAt, name: MoreThan(id) },
      ],
      take: limit,
      order: { lastUpdate: 'ASC', name: 'ASC' },
    });
  }
}
