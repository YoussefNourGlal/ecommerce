import { Types } from "mongoose";
import { ICreateCart } from "./create-cart-interface";


export interface ICart extends ICreateCart {
user: Types. ObjectId;
subTotal: number;
totalPrice: number;
}