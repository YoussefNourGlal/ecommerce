import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandModel } from 'src/DB/models/brand';
import { UserModel } from 'src/DB/models/user';
import { OtpModel } from 'src/DB/models/otp';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[BrandModel,UserModel,OtpModel],
  controllers: [BrandController],
  providers: [BrandService,JwtService],
})
export class BrandModule {}
