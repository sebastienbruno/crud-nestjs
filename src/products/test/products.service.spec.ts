import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockHttpService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, HttpService],
    })
    .overrideProvider(HttpService).useValue(mockHttpService)
    .compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
