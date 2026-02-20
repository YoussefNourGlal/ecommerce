import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand {
 
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

}
export const brandSchema = SchemaFactory.createForClass(Brand);
export type HBrandDocument = HydratedDocument<Brand>;
export const BrandModel = MongooseModule.forFeature([
  {
    name:Brand.name,
    schema: brandSchema,
  },
]);

brandSchema.pre("save",function(){
    if(this.isModified("name")){
        this.slug=slugify(this.name,{lower:true})
    }
})


