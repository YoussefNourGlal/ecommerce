import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/common/utiles/multer/multer';
import { ValidationTypes } from 'class-validator';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerImageConfig('brands')))
  create(
    @Body(new ValidationPipe()) createBrandDto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      createBrandDto.image = `brands/${file.filename}`;
    }
    createBrandDto.createdBy = req.user._id;
    return this.brandService.create(createBrandDto);
  }

  @Get('all-brands')
  @UseGuards(AuthGuard)
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerImageConfig('brands')))
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateBrandDto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      updateBrandDto.image = `brands/${file.filename}`;
    }
    updateBrandDto.createdBy = req.user._id;
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.brandService.remove(id, req);
  }
}
