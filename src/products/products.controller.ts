import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Controller('products')
export class ProductsController {
    
    @UseGuards(JwtAuthGuard)
    @Get(':barcode')
    getProduct(@Param('barcode') barcode: number) {
      return barcode
    }

}


