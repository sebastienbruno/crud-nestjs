import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    
  constructor(private productsService: ProductsService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':barcode')
    getProduct(@Param('barcode') barcode: number) {
      return this.productsService.getProduct(barcode);
    }

}