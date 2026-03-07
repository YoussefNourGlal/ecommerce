import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user';
import { ICoupon } from 'lib/coupon/coupon-interface';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Coupon implements ICoupon {
  @Prop({
    type: String,
   uppercase:true,
    required: true,
    unique: true,
  })
  code: string;

  @Prop({
    type: Boolean,
     required: true,
     default:true
  })
  isActive: boolean; 
  @Prop({
    type: Number,
    required: true,
  })
  discountPercentage: number; 
   @Prop({
    type: Date,
    required: true,
  })
 expiresAt:Date; 
}


export const couponSchema = SchemaFactory.createForClass(Coupon);
export type HCouponDocument = HydratedDocument<Coupon>;
export const coupontModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: couponSchema,
  },
]);