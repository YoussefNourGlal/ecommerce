import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, idOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { type Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ) {
    return this.orderService.create(createOrderDto, req);
  }

  @Get('cancel')
  @UseGuards(AuthGuard)
  cancelOrder(@Req() req: Request) {
    return this.orderService.cancelOrder(req);
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateAdress(
    @Req() req: Request,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateAdress(req, updateOrderDto);
  }

  @Post('checkout')
  @UseGuards(AuthGuard)
  payWithStripe(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    idOrderDto: idOrderDto,
  ) {
    return this.orderService.payWithStripe(idOrderDto.id);
  }

@Post('refund')
  @UseGuards(AuthGuard)
  refund(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    idOrderDto: idOrderDto,
  ) {
    return this.orderService.refund(idOrderDto.id);
  }



}
