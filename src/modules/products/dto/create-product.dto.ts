import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    ArrayUnique,
    IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ICreateProduct } from 'lib/product/create-product-interface';
import { Types } from 'mongoose';

export class CreateProductDto implements ICreateProduct {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
  @IsNotEmpty()
  @IsMongoId()
  category: Types.ObjectId;
  @IsString({each:true})
  @IsArray()
  @ArrayUnique()
  @IsOptional()
  images?: string[];
  @IsNotEmpty()
  @IsMongoId()
  brand: Types.ObjectId;
}
