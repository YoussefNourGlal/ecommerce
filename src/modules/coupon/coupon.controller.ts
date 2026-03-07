import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApllyCoupon, CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { type Request } from 'express';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createCouponDto: CreateCouponDto,
  ) {
    return this.couponService.create(createCouponDto);
  }

  @Post('aplly')
  @UseGuards(AuthGuard)
  apllyCoupon(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    code: ApllyCoupon,
    @Req() req: Request,
  ) {
    return this.couponService.apllyCoupon(code, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number) {
    return this.couponService.remove(id);
  }
}
