import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ActionEnum, UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, HBrandDocument } from 'src/DB/models/brand';
import { Model } from 'mongoose';
import {
  Category,
  CategoryModel,
  HCategoryDocument,
} from 'src/DB/models/category';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<HBrandDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<HCategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (category) throw new ConflictException('Category Already Exists');
    const foundBrands = await this.brandModel.find({
      _id: { $in: createCategoryDto.brands },
    });
    if (foundBrands.length !== createCategoryDto.brands?.length)
      throw new BadRequestException('Missing Brands Ids');
    const newcategory = await this.categoryModel.create(createCategoryDto);
    return { message: 'done', data: newcategory };
  }

  async findAll() {
    let categorys = await this.categoryModel.find().populate('brands');
    return { categorys };
  }

  async findOne(id: string) {
    let category = await this.categoryModel.findById(id).populate('brands');
    return { category };
  }

  async update(id: string, body: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({
      _id: new Types.ObjectId(id),
      createdBy: body.createdBy,
    });
    if (!category) return new NotFoundException('category Not Found sorry!');

    if (body.name) category.name = body.name;
    if (body.image) category.image = body.image;
    if (body.description) category.description = body.description;
    if (body.brands) {
      const brands = Array.isArray(body.brands) ? body.brands : [body.brands];
      if (body.action == ActionEnum.add) {
        await this.categoryModel.updateOne(
          { _id: id },
          { $addToSet: { brands: { $each: brands } } },
        );
      } else {
        await this.categoryModel.updateOne(
          { _id: id },
          { $pull: { brands: { $in: brands } } },
        );
      }
    }

    await category.save();
    return { message: 'updated successfuly' };
  }

  async remove(id: string, req: any) {
    const category = await this.categoryModel.findOne({
      _id: new Types.ObjectId(id),
      createdBy: req.user._id,
    });
    if (!category) return new NotFoundException('category Not Found');
    await this.categoryModel.deleteOne({ _id: id });
    return { message: 'the category deleted succssfuly' };
  }
}
