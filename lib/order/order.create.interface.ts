import { Types } from 'mongoose';

export interface ICreateOrder {
  address: string;
  paymentMethod: PaymentMethod;
 
}
export interface ICreateOrderItem {
  title: string;
  quantity: number;
  price: number;
  product: Types.ObjectId;
}

export enum OrderStatus {
  PENDING = 'pending',
  READY='READY',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  REFUND_PENDING='refunded_pending',
  REFUNDED='refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  COD = 'CASH ON DELIVERY',
  ONLINE = 'VISA',
}
