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
  Req,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/common/utiles/multer/multer';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerImageConfig('category')))
  create(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      createCategoryDto.image = `category/${file.filename}`;
    }
    createCategoryDto.createdBy = req.user._id;
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerImageConfig('brands')))
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      updateCategoryDto.image = `brands/${file.filename}`;
    }
    updateCategoryDto.createdBy = req.user._id;

    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.categoryService.remove(id, req);
  }
}
