import { Types } from 'mongoose';
import { ICreateProduct } from './create-product-interface';

export interface IProduct extends ICreateProduct {
  slug: string;
  createdBy: Types.ObjectId;
}
