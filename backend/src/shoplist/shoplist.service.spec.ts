import { Test, TestingModule } from '@nestjs/testing';
import ShoplistService from './shoplist.service';
import { ShopListItem } from './shoplistitem.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ShoplistService', () => {
  let service: ShoplistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoplistService,
        { provide: getRepositoryToken(ShopListItem), useValue: 'FIXME' },
      ],
    }).compile();

    service = module.get<ShoplistService>(ShoplistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
