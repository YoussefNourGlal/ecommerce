import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PreAuthMiddleware } from './middleWare/preAuth';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/dev.env'),
      isGlobal: true,
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
    MongooseModule.forRoot("mongodb://localhost:27017/ECommerce",{
      serverSelectionTimeoutMS:3000,
       onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log('connected'));}
    }),
    BrandModule,
    CategoryModule,
    CartModule,
    CouponModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuthMiddleware)
      .forRoutes('auth');
  }


}
