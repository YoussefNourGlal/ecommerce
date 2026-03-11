import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Product } from './product';
import { User } from './user';
import { ICart } from 'lib/cart/cart-interface';
import {
  ICreateOrderItem,
  OrderStatus,
  PaymentMethod,
} from 'lib/order/order.create.interface';
import { Iorder } from 'lib/order/order.interface';
import { Cart } from './cart';

@Schema({ _id: false })
export class OrderItem implements ICreateOrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: String,
    required: true,
  })
  title: string;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order implements Iorder {
  @Prop({
    type: String,
    enum: OrderStatus,
    required: true,
    default:function(){
      return this.paymentMethod==PaymentMethod.COD? OrderStatus.READY:OrderStatus.PENDING;
    }
  })
  orderStatus: OrderStatus;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Cart.name,
    required: true,
    unique: true,
  })
  cart: Types.ObjectId;
  @Prop({
    type: String,
    required: true,
  })
  address: string;
  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
  })
  paymentMethod: PaymentMethod;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Number,
  })
  subTotal: number;

  @Prop({
    type: Number,
  })
  totalPrice: number;

  @Prop({
    type: [
      {
        type: OrderItemSchema,
      },
    ],
    required: true,
  })
  items: OrderItem[];

@Prop({
  type:String
})
paymentIntentId : string;



}

export const orderSchema = SchemaFactory.createForClass(Order);
export type HOrderDocument = HydratedDocument<Order>;
export const orderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: orderSchema,
  },
]);
