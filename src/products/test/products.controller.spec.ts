import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/jwt-auth.guards';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';

describe('ProductsController', () => {
  let productController: ProductsController;
  let mockProductService: {};
  let mockAuthGuard = {};
  let mockHttpService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, HttpService],
    })
      .overrideProvider(ProductsService).useValue(mockProductService)
      .overrideProvider(JwtAuthGuard).useValue(mockAuthGuard)
      .overrideProvider(HttpService).useValue(mockHttpService)
      .compile();

    productController = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });
});
