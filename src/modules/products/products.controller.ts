import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/common/utiles/multer/multer';
import { type Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5, multerImageConfig('product')))
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    if (files.length == 0) {
      throw new BadRequestException('the product must have image');
    }
    createProductDto.images = files.map(function (file) {
      return `product/${file.filename}`;
    });

    return this.productsService.create(createProductDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productsService.update(id, updateProductDto, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.productsService.remove(id, req);
  }
}
