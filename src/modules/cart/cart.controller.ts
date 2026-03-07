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
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { type Request } from 'express';
import { UpdateQuantityDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  addItemToCart(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createCartDto: CreateCartItemDto,
    @Req() req: Request,
  ) {
    return this.cartService.create(createCartDto, req);
  }

  @Patch('updateQuentity/:id')
  @UseGuards(AuthGuard)
  updateQuentity(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))body: UpdateQuantityDto,
    @Req() req: Request,
  ) {
    return this.cartService.updateQuentity(id, req, body);
  }

  @Get('cart')
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request) {
    return this.cartService.findOne(req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removeCart(@Param('id') id: string, @Req() req: Request) {
    return this.cartService.removeCart(id, req);
  }

  @Patch('remove-item/:id')
  @UseGuards(AuthGuard)
  removeItem(@Param('id') id: string, @Req() req: Request) {
    return this.cartService.removeItem(id, req);
  }
}
