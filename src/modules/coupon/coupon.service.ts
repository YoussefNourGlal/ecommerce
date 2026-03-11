import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApllyCoupon, CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, HCartDocument } from 'src/DB/models/cart';
import { Coupon, HCouponDocument } from 'src/DB/models/coupon';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<HCouponDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<HCartDocument>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.couponModel.findOne({
      code: createCouponDto.code,
    });

    if (coupon) throw new ConflictException('Coupon Already Exists');

    const newCoupon = await this.couponModel.create(createCouponDto);
    return newCoupon;
  }

  async apllyCoupon(ApllyCoupon: ApllyCoupon, req: Request) {
    let cart = await this.cartModel.findOne({ user: req.user?._id });
    if (!cart || !cart.items.length)
      throw new NotFoundException('cart Not Found');
    const coupon = await this.couponModel.findOne({
      code: ApllyCoupon.code,
      isActive: true,
    });
    if (!coupon) throw new ConflictException('Coupon not Exists');

    const currentDate = new Date();

    if (coupon.expiresAt < currentDate)
      throw new BadRequestException('Coupon Expired');

    let discount = cart.subTotal * (coupon.discountPercentage / 100);
    cart.totalPrice = cart.subTotal - discount;
    return await cart.save();
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new ConflictException('Coupon not Exists');
    return coupon;
  }

  async remove(id: number) {
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) throw new ConflictException('Coupon not Exists');
    return { coupon, message: 'deleted successfully' };
  }
}
