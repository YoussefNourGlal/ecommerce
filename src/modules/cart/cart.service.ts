import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto, UpdateQuantityDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HProductDocument, Product } from 'src/DB/models/product';
import { Model, Types } from 'mongoose';
import { Cart, HCartDocument } from 'src/DB/models/cart';
import { Request } from 'express';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<HCartDocument>,
  ) {}
//method to calc total and sub price in cart
async  calcCartPrices(cart: any) {
  let subTotal = 0;
  await cart.populate("items.product"); 
  for (const item of cart.items) {
    const price = item.product.price 
    subTotal += price * item.quantity;
  }

  cart.subTotal = subTotal;
  cart.totalPrice = subTotal;
}
//rest Api
  async create(createCartItemDto: CreateCartItemDto, req: Request) {
    const product = await this.productModel.findById(createCartItemDto.product);

    if (!product) throw new NotFoundException('Product Not Found');

    if (createCartItemDto.quantity > product.quantity)
      throw new BadRequestException('Product Stock.Not.Enough');

    let cart = await this.cartModel.findOne({ user: req.user?._id }).populate("items.product");

    if (!cart) {
      cart = await this.cartModel.create({
        user: req.user?._id,
        items: [createCartItemDto],
      });
     await cart.populate("items.product");
     await this.calcCartPrices(cart);
      return await cart.save();
    }

    let check = cart.items.find(function (item) {
      return item.product.toString() == createCartItemDto.product.toString();
    });
    if (check) {
      check.quantity = check.quantity + createCartItemDto.quantity;
      await this.calcCartPrices(cart);
      return await cart.save();
    }
    cart.items.push(createCartItemDto);
    await this.calcCartPrices(cart);
    return await cart.save();
  }

  async updateQuentity(id: string, req: Request, body: UpdateQuantityDto) {
    const cart = await this.cartModel.findOne({
      user: req.user?._id,
    }).populate("items.product");
    if (!cart) return new NotFoundException('cart Not Found');

    let check = cart.items.find(function (item) {
      return item.product._id.toString() == id;
    });
    
    if (!check) {
      throw new BadRequestException('item not found in cart');
    }
    const product = check.product as unknown as Product;
    if(body.quantity>product.quantity ) {
      throw new BadRequestException("Product Stock.Not.Enough")
    }
    check.quantity = body.quantity;
    await this.calcCartPrices(cart);

    return await cart.save();
  }

  async findOne(req: Request) {
    let cart = await this.cartModel
      .findOne({ user: req.user?._id })
      .populate('items.product');
    if (!cart) throw new NotFoundException('cart Not Found');
    return { cart };
  }

  async removeCart(id: string, req: Request) {
    const cart = await this.cartModel.findOne({
      _id: new Types.ObjectId(id),
      user: req.user?._id,
    });
    if (!cart) return new NotFoundException('cart Not Found');
    await this.cartModel.deleteOne({ _id: id });
    return { message: 'the cart deleted succssfuly' };
  }

  async removeItem(id: string, req: Request) {
    const cart = await this.cartModel.findOne({
      user: req.user?._id,
    }).populate("items.product");
    if (!cart) return new NotFoundException('cart Not Found');

    let check = cart.items.find(function (item) {
      return item.product.toString() == id;
    });
    if (!check) {
      throw new BadRequestException('item not found in cart');
    }
    cart.items = cart.items.filter(function (item) {
      return item.product.toString() !== id;
    });
    await this.calcCartPrices(cart);
    return await cart.save();
  }
}
