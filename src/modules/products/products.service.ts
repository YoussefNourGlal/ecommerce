import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, HCategoryDocument } from 'src/DB/models/category';
import { Brand, HBrandDocument } from 'src/DB/models/brand';
import { HProductDocument, Product } from 'src/DB/models/product';
import { Request } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<HBrandDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<HCategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    const category = await this.categoryModel.findById(
      createProductDto.category,
    );

    if (!category) throw new NotFoundException('Category Not Found');

    const brand = await this.brandModel.findById(createProductDto.brand);

    if (!brand) throw new NotFoundException('brand Not Found');

    try {
      const product = await this.productModel.create({
        ...createProductDto,
        createdBy: req.user?._id,
      });
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

 async findAll() {
   return await this.productModel.find();
  }

 async findOne(id: string) {
    let product=await this.productModel.findById(id);
    return product;
   
  }

async  update(id: string, updateProductDto: UpdateProductDto,req:Request) {
  if(!updateProductDto){
    throw new NotFoundException('data Not Found!');
  }
  if(updateProductDto.brand){
      const brand = await this.brandModel.findById(updateProductDto.brand);

    if (!brand) throw new NotFoundException('brand Not Found');
  }
  if(updateProductDto.category){
     const category = await this.categoryModel.findById(
     updateProductDto.category,
    );

    if (!category) throw new NotFoundException('Category Not Found');
  }
    try {
      const product = await this.productModel.findOneAndUpdate({_id:id,createdBy:req.user?._id},updateProductDto,{new:true});
      if(!product) throw new BadRequestException("the product not found");
      return product;
    } catch (error) {
      throw new BadRequestException(error,"sorry faild to update");
    }

  }

  async remove(id: string, req: Request) {
    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(id),
      createdBy: req.user?._id,
    });
    if (!product) return new NotFoundException('product Not Found');
    await this.productModel.deleteOne({ _id: id });
    return { message: 'the product deleted succssfully' };
  }
}
