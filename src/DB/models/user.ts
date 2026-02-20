import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum } from '../ennums/user.enum';
import { hashing } from 'src/common/utiles/hashing/hash';
import { HOtpDocument } from './otp';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: function () {
      return this.provider !== ProviderEnum.GOOGLE;
    },
  })
  password: string;
  @Prop({
    type: Date,
  })
  confirmEmail: Date;
  @Prop({
    type: String,
    enum: {
      values:Object.values(GenderEnum) ,
      message: 'MALE OR FEMALE ONLY',
      default: GenderEnum.MALE,
    },
  })
  gender: string;
  @Prop({
    type: String,
    enum: {
      values:Object.values(ProviderEnum) ,
      message: 'system OR google ONLY',
      default: ProviderEnum.SYSTEM,
    },
  })
  provider: string;
  @Virtual()
  otp:HOtpDocument[]

}
export const userSchema = SchemaFactory.createForClass(User);
userSchema.virtual("otp",{
  localField:"_id",
  foreignField:"createdBy",
  ref:"Otp"
});
export type HUserDocument = HydratedDocument<User& { username: string }>;
export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);

userSchema
  .virtual('username')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (value: string) {
    const [firstName, lastName] = value.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
  });






userSchema.pre(
  "save",
  async function (
    next,
  ) {
    if (this.isModified("password")) {
      this.password = await hashing(this.password);
    }


  },
); 