import { IsMongoId, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";

export class CreateBrandDto{
@IsString()
@Length(3, 25)
name: string;
@IsString()
@IsOptional()
image?: string;
@IsMongoId()
@IsOptional()
createdBy?: Types.ObjectId;
}