import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart.dto';
import { IsInt, Min } from 'class-validator';


export class UpdateCartDto extends PartialType(CreateCartItemDto) {}



export class UpdateQuantityDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
