import { ICreateCoupon } from './create-coupon-interface';

export interface ICoupon extends Omit<ICreateCoupon, 'isActive'> {
  isActive: boolean;
}
