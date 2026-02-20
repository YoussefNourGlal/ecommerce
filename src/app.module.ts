import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PreAuthMiddleware } from './middleWare/preAuth';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';

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
    CategoryModule
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
