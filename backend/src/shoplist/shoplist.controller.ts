import { Controller, Get, Query } from '@nestjs/common';
import ShoplistService from './shoplist.service';

@Controller('shoplist')
export class ShoplistController {
  constructor(private _service: ShoplistService) {}

  @Get('/pull')
  async pull(
    @Query('updatedAt') updatedAt: number,
    @Query('id') id?: string,
    @Query('limit') limit?: number,
  ) {
    const results = await this._service.findAllAfter(updatedAt, id, limit);
    const newCheckpoint =
      results.length === 0
        ? { id, updatedAt }
        : {
            id: results.at(-1).name,
            updatedAt: results.at(-1).lastUpdate,
          };
    return { documents: results, checkpoint: newCheckpoint };
  }
}
