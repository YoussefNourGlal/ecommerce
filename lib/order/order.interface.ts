import { Types } from 'mongoose';
import { ICreateOrder, ICreateOrderItem, OrderStatus } from './order.create.interface';

export interface Iorder extends ICreateOrder {
  subTotal: number;
  totalPrice: number;
  user: Types.ObjectId;
  cart: Types.ObjectId;
  items:ICreateOrderItem[];
  orderStatus: OrderStatus;
}
export const tax=0.14;
