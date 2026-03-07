import { Types } from "mongoose";

export interface ICreateCart {
items: ICreateCartItem[];
}

export interface ICreateCartItem {
product: Types.ObjectId;
quantity: number;
}