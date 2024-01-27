import { Test, TestingModule } from '@nestjs/testing';
import { ShoplistController } from './shoplist.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShopListItem } from './shoplistitem.entity';
import ShoplistService from './shoplist.service';

describe('ShoplistController', () => {
  let controller: ShoplistController;
  const mockedService = {
    findAllAfter: vi.fn(),
    createOrUpdate: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoplistService,
        { provide: getRepositoryToken(ShopListItem), useValue: 'FIXME' },
      ],
      controllers: [ShoplistController],
    }).compile();

    controller = module.get<ShoplistController>(ShoplistController);
  });

  it('Should return items found by service with new checkpoint', async () => {
    const fakeSearchResult = [
      { name: 'A', rank: 100, _deleted: false, active: false, lastUpdate: 10 },
      { name: 'B', rank: 90, _deleted: false, active: false, lastUpdate: 11 },
      { name: 'C', rank: 80, _deleted: true, active: true, lastUpdate: 12 },
      { name: 'D', rank: 70, _deleted: false, active: false, lastUpdate: 13 },
      { name: 'E', rank: 60, _deleted: true, active: true, lastUpdate: 14 },
    ];
    mockedService.findAllAfter.mockResolvedValueOnce(fakeSearchResult);

    const result = await controller.pull(10, 'A', 5);

    expect(mockedService.findAllAfter).toHaveBeenCalledTimes(1);
    expect(mockedService.findAllAfter).toHaveBeenCalledWith(10, 'A', 5);
    expect(result.documents).toEqual(fakeSearchResult);
    expect(result.checkpoint).toEqual({ updatedAt: 14, id: 'E' });
  });
});
