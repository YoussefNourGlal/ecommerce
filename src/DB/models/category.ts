import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user';
import slugify from 'slugify';
import { Brand } from './brand';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
 
   @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    unique:true
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
    ref:User.name
  })
  createdBy: Types.ObjectId;
  //
 

  @Prop({
    type: String,
    required:true
  })
 image: string;

 @Prop({
    type: String,
    minlength: 2,
    maxlength: 2000,
  })
 description: string;

 @Prop({
    type: [{type:mongoose.Types.ObjectId,ref:Brand.name}]
  })
brands:Types.ObjectId[]

}
export const categorySchema = SchemaFactory.createForClass(Category);
export type HCategoryDocument = HydratedDocument<Category>;
export const CategoryModel = MongooseModule.forFeature([
  {
    name:Category.name,
    schema: categorySchema,
  },
]);

categorySchema.pre("save",function(){
    if(this.isModified("name")){
        this.slug=slugify(this.name,{lower:true})
    }
})


