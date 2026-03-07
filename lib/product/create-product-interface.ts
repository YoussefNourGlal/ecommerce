import { Types } from 'mongoose';

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: Types.ObjectId;
  images?: string[];
  brand: Types.ObjectId;
}
