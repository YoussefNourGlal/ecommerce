import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, HBrandDocument } from 'src/DB/models/brand';
import { Model, Types } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<HBrandDocument>,
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandModel.findOne({ name: createBrandDto.name });
    if (brand) throw new ConflictException('Brand Already Exists');

    const newbrand = await this.brandModel.create(createBrandDto);
    return { message: 'done', data: newbrand };
  }

  async findAll() {
    let brands = await this.brandModel.find();
    return { brands };
  }

  async findOne(id: string) {
    let brand = await this.brandModel.findById(id);
    return { brand };
  }

  async update(id: string, body: UpdateBrandDto) {
    const brand = await this.brandModel.findOne({
      _id: new Types.ObjectId(id),
      createdBy: body.createdBy,
    });
    if (!brand) return new NotFoundException('Brand Not Found');

    if (body.name) brand.name = body.name;
    if (body.image) brand.image = body.image;

    await brand.save();
    return brand;
  }

  async remove(id: string, req: any) {
    const brand = await this.brandModel.findOne({
      _id: new Types.ObjectId(id),
      createdBy: req.user._id,
    });
    if (!brand) return new NotFoundException('Brand Not Found');
    await this.brandModel.deleteOne({ _id: id });
    return { message: 'the brand deleted succssfuly' };
  }
}
