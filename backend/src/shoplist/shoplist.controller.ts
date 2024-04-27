import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import ShoplistService from './shoplist.service.js';
import { ShopListItem } from './shoplistitem.interface.js';
import {
  Checkpoint,
  DocumentChangeRow,
  DocumentUpdates,
} from 'src/replication.js';

@Controller('shoplist')
export class ShoplistController {
  constructor(private _service: ShoplistService) {}

  @Get('/pull')
  async pull(
    @Query('updatedAt') updatedAt: number,
    @Query('id') id?: string,
    @Query('limit') limit?: number,
  ): Promise<DocumentUpdates<ShopListItem>> {
    const results = await this._service.findAllAfter(updatedAt, id, limit);
    const newCheckpoint: Checkpoint =
      results.length === 0
        ? { id, updatedAt }
        : {
            id: results.at(-1).name,
            updatedAt: results.at(-1).lastUpdate,
          };
    return { documents: results, checkpoint: newCheckpoint };
  }

  @Post('/push')
  async push(@Body() updatedDocuments: DocumentChangeRow<ShopListItem>[]) {
    return this._service.createOrUpdate(updatedDocuments);
  }
}
