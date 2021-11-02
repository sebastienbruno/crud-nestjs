import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { ProductsService } from './products.service';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
    
  constructor(private productsService: ProductsService) {}

    @ApiOperation({ summary: 'Get informations about a product thanks to its barcode (examples : 3274080005003, 3017620425035, 3046920022651)' })
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Success. Informations about the product are delivered' })
    @ApiResponse({ status: 401, description: 'Authentication is required and has failed or has not yet been provided' })
    @ApiBearerAuth()
    @Get(':barcode')
    getProduct(@Param('barcode') barcode: number) {
      return this.productsService.getProduct(barcode);
    }

}