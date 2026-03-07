import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Product } from './product';
import { User } from './user';
import { ICreateCartItem } from 'lib/cart/create-cart-interface';
import { ICart } from 'lib/cart/cart-interface';

@Schema({ _id: false })
export class CartItem implements ICreateCartItem {
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
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cart implements ICart {
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
        type:CartItemSchema,
      },
    ],
    required: true,
  })
  items: CartItem[];
}


export const cartSchema = SchemaFactory.createForClass(Cart);
export type HCartDocument = HydratedDocument<Cart>;
export const CartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: cartSchema,
  },
]);