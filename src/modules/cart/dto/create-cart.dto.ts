import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { ICreateCartItem } from "lib/cart/create-cart-interface";
import { Types } from "mongoose";

export class CreateCartItemDto implements ICreateCartItem{
@IsNotEmpty()
@IsMongoId()
@Type(()=>Types.ObjectId)
product: Types.ObjectId;

@IsNotEmpty()
@IsNumber()
@Type(()=> Number)
quantity: number;
}