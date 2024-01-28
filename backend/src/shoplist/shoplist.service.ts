import { Injectable } from '@nestjs/common';
import { ShopListItemEntity } from './shoplistitem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
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

  async createOrUpdate(
    changedRows: DocumentChangeRow<ShopListItem>[],
  ): Promise<ShopListItem[]> {
    // neither optimal nor pretty, but should get the job done in a first attempt
    const conflicts = await this._itemRepository.manager.transaction(
      async () => {
        const ids = changedRows.map((r) => r.newDocumentState.name);
        const existingDocuments = await this._itemRepository.find({
          select: { name: true, lastUpdate: true },
          where: { name: In(ids) },
        });
        const conflicts: ShopListItemEntity[] = [];
        for (const row of changedRows) {
          const itemInDb = existingDocuments.find(
            (d) => d.name === row.newDocumentState.name,
          );
          if (itemInDb) {
            // check for conflict
            if (
              !row.assumedMasterState ||
              (row.assumedMasterState &&
                itemInDb.lastUpdate !== row.assumedMasterState.lastUpdate)
            ) {
              conflicts.push(itemInDb);
            } else {
              this._itemRepository.update(
                row.newDocumentState.name,
                row.newDocumentState,
              );
            }
          } else {
            // must be a new item
            this._itemRepository.insert(row.newDocumentState);
          }
          return conflicts;
        }
      },
    );

    if (conflicts.length > 0) {
      return this._itemRepository.find({
        where: { name: In(conflicts.map((c) => c.name)) },
      });
    }
    return [];
  }
}
