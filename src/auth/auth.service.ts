import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IConfirmEmailDto,
  ILoginDto,
  IRsendOtpDto,
  ISsignupDto,
} from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User, UserModel } from 'src/DB/models/user';
import { Model, Types } from 'mongoose';
import { Emailevent } from 'src/common/utiles/events/email';
import { customAlphabet, nanoid } from 'nanoid';
import { HOtpDocument, Otp } from 'src/DB/models/otp';
import { otpEnum } from 'src/DB/ennums/user.enum';
import { compare } from 'src/common/utiles/hashing/hash';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usermodel: Model<HUserDocument>,
    @InjectModel(Otp.name) private readonly otpmodel: Model<HOtpDocument>,
    private jwtService: JwtService,
  ) {}

  // function create otp
  async createotp(userId: Types.ObjectId, otp: string) {
    await this.otpmodel.create({
      createdBy: userId,
      code: otp,
      expiredAt: new Date(Date.now() + 2 * 60 * 1000), // 2 Min
      type: otpEnum.EMAIL_VERFICATION,
    });
  }

  //rest api

  async signup(body: ISsignupDto) {
    let { firstName, lastName, email, password, confirmPassword } = body;
    let checkUser = await this.usermodel.findOne({ email });
    if (checkUser) throw new BadRequestException('the user is Already exist');
    let otp = customAlphabet('123456789', 6)();
    let user = await this.usermodel.create({
      firstName,
      lastName,
      email,
      password,
    });
    if (!user) {
      throw new BadRequestException('user cant created  sorry');
    }
    await this.createotp(user._id, otp);
    return { message: 'user created successfuly', user };
  }

  async resendOtp(body: IRsendOtpDto) {
    let { email } = body;
    let checkUser = await this.usermodel
      .findOne({ email, confirmEmail: { $exists: false } })
      .populate({ path: 'otp', match: { type: otpEnum.EMAIL_VERFICATION } });
    if (!checkUser) throw new BadRequestException('the user is NOT exist');
    if (checkUser.otp.length) throw new BadRequestException('the otp is exist');

    let otp = customAlphabet('123456789', 6)();

    await this.createotp(checkUser._id, otp);
    return { message: 'check your email' };
  }

  async confirmEmail(body: IConfirmEmailDto) {
    let { email, otp } = body;
    let checkUser = await this.usermodel
      .findOne({ email, confirmEmail: { $exists: false } })
      .populate({ path: 'otp', match: { type: otpEnum.EMAIL_VERFICATION } });
    if (!checkUser) throw new BadRequestException('the user is NOT exist');
    if (!checkUser.otp.length)
      throw new BadRequestException('the otp not exist');
    if (!(await compare(otp, checkUser.otp[0].code)))
      throw new BadRequestException('the otp not correct');

    await this.usermodel.updateOne(
      { email, _id: checkUser._id },
      { $set: { confirmEmail: new Date() }, $inc: { __v: 1 } },
    );

    return { message: 'User Confirmed Successfully' };
  }

  async login(body: ILoginDto) {
    let { email, password } = body;
    let checkUser = await this.usermodel.findOne({
      email,
      confirmEmail: { $exists: true },
    });
    if (!checkUser) throw new BadRequestException('the user Not exist');
    if (!(await compare(password, checkUser.password)))
      throw new BadRequestException('the password not correct');
    let accessToken = this.jwtService.sign(
      { id: checkUser._id, email: checkUser.email },
      { secret: process.env.KEYTOKEN_ACCESS, expiresIn: '1h', jwtid: uuid() },
    );
    let refreshToken = this.jwtService.sign(
      { id: checkUser._id, email: checkUser.email },
      { secret: process.env.KEYTOKEN_REFRESH, expiresIn: '9h', jwtid: uuid() },
    );

    return {
      tokens: { accessToken, refreshToken },
      message: 'user is  logged successfuly',
    };
  }


  async getProfile(req:any) {
   
    return {
     data: req.user,
      message: 'done',
    };
  }


  async uploadfile(files:Array< Express.Multer.File>) {
  return { message: "File Uplaoded Successfully", data: files };
  }

}
