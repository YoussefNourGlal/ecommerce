import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderService } from '../modules/order/order.service';
import { OrderModule } from '../modules/order/order.module';
import { orderModel } from 'src/DB/models/order';

@Module({
  imports:[orderModel],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
