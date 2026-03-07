import { ArrayNotEmpty, ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";


export class CreateCategoryDto {
@IsString()
@IsNotEmpty()
@MinLength(3)
@MaxLength(25)
name: string;

@IsString()
@IsOptional()
@MinLength(3)
@MaxLength(5000)
description ?: string;

@IsMongoId()
@IsOptional()
createdBy?: Types.ObjectId;

@IsOptional()
@IsArray()
@ArrayNotEmpty()
@ArrayUnique()
@IsMongoId({ each: true })
brands ?: Types.ObjectId[];
@IsString()
@IsOptional()
image?: string;
}
