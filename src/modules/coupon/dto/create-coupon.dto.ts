import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUppercase,
  MinLength,
} from 'class-validator';
import { ICreateCoupon } from 'lib/coupon/create-coupon-interface';

export class CreateCouponDto implements ICreateCoupon {
  @IsNotEmpty()
  @MinLength(3)
  @IsUppercase()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  discountPercentage: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expiresAt: Date;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class ApllyCoupon {
  @IsNotEmpty()
  @MinLength(3)
  @IsUppercase()
  code: string;
}
