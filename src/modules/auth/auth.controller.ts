import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { PasswordMatchPipe } from 'src/common/pipes/password-match.pipe';
import {
  confirmEmail,
  type IConfirmEmailDto,
  type ILoginDto,
  type IRsendOtpDto,
  type ISsignupDto,
  login,
  resendOtpSchema,
  signupSchema,
} from './dto/create-auth.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/common/utiles/multer/multer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(new ZodPipe(signupSchema))
  signup(@Body() body: ISsignupDto) {
    return this.authService.signup(body);
  }

  @Post('/resendOtp')
  @UsePipes(new ZodPipe(resendOtpSchema))
  async resendotp(@Body() body: IRsendOtpDto) {
    return await this.authService.resendOtp(body);
  }

  @Post('/confirmEmail')
  @UsePipes(new ZodPipe(confirmEmail))
  async confirmEmail(@Body() body: IConfirmEmailDto) {
    return await this.authService.confirmEmail(body);
  }

  @Post('/login')
  @UsePipes(new ZodPipe(login))
  async login(@Body() body: ILoginDto) {
    return await this.authService.login(body);
  }


  @Get('/get-profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req:any) {
    return await this.authService.getProfile(req);
  }

  @Post('/upload-file')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor("files",5,multerImageConfig("general")))
  async uploadfile(@UploadedFiles() files:Array< Express.Multer.File>) {
    return await this.authService.uploadfile(files);
  }



}
