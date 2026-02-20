import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadGatewayException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { HUserDocument, User } from 'src/DB/models/user';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly usermodel: Model<HUserDocument>,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new BadGatewayException('the token is Missing');
    }
    let token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadGatewayException('the token is Missing');
    }
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.KEYTOKEN_ACCESS,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    let user = await this.usermodel.findById(decoded.id);
    if (!user) {
      throw new BadGatewayException('the user not found');
    }
    request.user = user;
    return true;
  }
}
