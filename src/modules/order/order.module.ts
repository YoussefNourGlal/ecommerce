import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { BrandModel } from 'src/DB/models/brand';
import { coupontModel } from 'src/DB/models/coupon';
import { OtpModel } from 'src/DB/models/otp';
import { CartModel } from 'src/DB/models/cart';
import { productModel } from 'src/DB/models/product';
import { UserModel } from 'src/DB/models/user';
import { orderModel } from 'src/DB/models/order';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[BrandModel,coupontModel,OtpModel,CartModel,productModel,UserModel,orderModel],
  controllers: [OrderController],
  providers: [OrderService,JwtService],
})
export class OrderModule {}
