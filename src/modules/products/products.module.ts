import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { BrandModel } from 'src/DB/models/brand';
import { UserModel } from 'src/DB/models/user';
import { CategoryModel } from 'src/DB/models/category';
import { productModel } from 'src/DB/models/product';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[BrandModel,UserModel,productModel,CategoryModel],
  controllers: [ProductsController],
  providers: [ProductsService,JwtService],
})
export class ProductsModule {}
