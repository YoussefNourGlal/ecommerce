import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export  enum ActionEnum{
    add="add",
    remove = "remove"
}


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsEnum(ActionEnum)
    @IsOptional()
    action?:ActionEnum
}
