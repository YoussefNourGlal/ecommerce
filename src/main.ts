import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logger';
import { ResponseInterceptor } from './common/interceptors/response';
import path from 'node:path';
import * as express from "express";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use("/uploads",express.static(path.resolve("./src/uploads")));
  await app.listen(process.env.PORT||456);
}
bootstrap();
