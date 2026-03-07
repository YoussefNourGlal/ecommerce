import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ICreateOrder, ICreateOrderItem, OrderStatus, PaymentMethod } from "lib/order/order.create.interface";
import { Types } from "mongoose";



export class CreateOrderDto implements ICreateOrder {
    @IsNotEmpty()
    @IsString()
    address: string;
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}
