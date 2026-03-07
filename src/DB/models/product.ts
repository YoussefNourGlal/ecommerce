import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user';
import slugify from 'slugify';
import { Brand } from './brand';
import { Category } from './category';
import { IProduct } from 'lib/product/product-interface';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    unique: true,
  })
  name: string;
  //

  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  slug: string;
  //
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: Types.ObjectId;
  //

 @Prop({
  type: [String],
})
images: string[];

  @Prop({
    type: String,
    minlength: 2,
    maxlength: 2000,
    required: true,
  })
  description: string;

  @Prop({
  type: mongoose.Schema.Types.ObjectId,
  ref: Brand.name,
  required: true,
})
brand: Types.ObjectId;
 @Prop({
  type: mongoose.Schema.Types.ObjectId,
  ref: Category.name,
  required: true,
})
category: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;
}
export const productSchema = SchemaFactory.createForClass(Product);
export type HProductDocument = HydratedDocument<Product>;
export const productModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: productSchema,
  },
]);

productSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
});
