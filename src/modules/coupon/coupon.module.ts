import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { BrandModel } from 'src/DB/models/brand';
import { OtpModel } from 'src/DB/models/otp';
import { CartModel } from 'src/DB/models/cart';
import { productModel } from 'src/DB/models/product';
import { JwtService } from '@nestjs/jwt';
import { coupontModel } from 'src/DB/models/coupon';
import { UserModel } from 'src/DB/models/user';

@Module({
  imports:[BrandModel,coupontModel,OtpModel,CartModel,productModel,UserModel],
  controllers: [CouponController],
  providers: [CouponService,JwtService],
})
export class CouponModule {}
