import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtService } from '@nestjs/jwt';
import { CartModel } from 'src/DB/models/cart';
import { productModel } from 'src/DB/models/product';
import { CategoryModel } from 'src/DB/models/category';
import { OtpModel } from 'src/DB/models/otp';
import { UserModel } from 'src/DB/models/user';
import { BrandModel } from 'src/DB/models/brand';

@Module({
 imports:[BrandModel,UserModel,OtpModel,CategoryModel,CartModel,productModel],
  controllers: [CartController],
  providers: [CartService,JwtService],
})
export class CartModule {}
