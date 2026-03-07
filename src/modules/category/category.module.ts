import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { OtpModel } from 'src/DB/models/otp';
import { UserModel } from 'src/DB/models/user';
import { BrandModel } from 'src/DB/models/brand';
import { CategoryModel } from 'src/DB/models/category';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[BrandModel,UserModel,OtpModel,CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService,JwtService],
})
export class CategoryModule {}
