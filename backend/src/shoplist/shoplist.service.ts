import { Injectable } from '@nestjs/common';
import { ShopListItemEntity } from './shoplistitem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ShopListItem } from './shoplistitem.interface';
import { DocumentChangeRow } from 'src/replication';

@Injectable()
export default class ShoplistService {
  constructor(
    @InjectRepository(ShopListItemEntity)
    private _itemRepository: Repository<ShopListItemEntity>,
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

  async createOrUpdate(updateDocuments: DocumentChangeRow<ShopListItem>[]) {
    return updateDocuments;
  }
}
