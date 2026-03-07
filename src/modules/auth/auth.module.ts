import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/DB/models/user';
import { OtpModel } from 'src/DB/models/otp';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports :[UserModel,OtpModel],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
})
export class AuthModule {}
