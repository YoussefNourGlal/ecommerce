import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { HOrderDocument, Order } from 'src/DB/models/order';
import { Model, Types } from 'mongoose';
import { Cart, HCartDocument } from 'src/DB/models/cart';
import { ICreateOrderItem, OrderStatus } from 'lib/order/order.create.interface';
import { HProductDocument, Product } from 'src/DB/models/product';
import { tax } from 'lib/order/order.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<HOrderDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<HCartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto, req: Request) {
    const cart = await this.cartModel
      .findOne({ user: req.user?._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0)
      throw new BadRequestException('Cart is empty');

    let items: ICreateOrderItem[] = cart.items.map(function (item) {
      let product = item.product as unknown as Product & {
        _id: Types.ObjectId;
      };
      return {
        title: product.name,
        product: product._id,
        price: product.price,
        quantity: item.quantity,
      };
    });
    let subTotal = cart.totalPrice;
    let totalPrice = subTotal + subTotal * tax;
    let order = await this.orderModel.create({
      address: createOrderDto.address,
      paymentMethod: createOrderDto.paymentMethod,
      totalPrice,
      subTotal,
      cart: cart._id,
      user: req.user?._id,
      items: items,
    });
    for (const item of items) {
      await this.productModel.updateOne(
        { _id: item.product },
        { $inc: { quantity: -item.quantity } },
      );
    }
    await this.cartModel.deleteOne({user:req.user?._id});

    return order;
  }

 async cancelOrder(req:Request) {
 let order= await this.orderModel.findOne({user:req.user?._id});
if(!order){
  throw new BadRequestException("sorry the order not found");
}
 if(order?.orderStatus==OrderStatus.CANCELLED||order?.orderStatus==OrderStatus.DELIVERED||order?.orderStatus==OrderStatus.SHIPPED)
throw new BadRequestException("sorry cant cancel the order");
 order.orderStatus=OrderStatus.CANCELLED;
await order.save();
return{message:"canceled succcesssfully"};

  }

  
 async updateAdress(req:Request,UpdateCartDto:UpdateOrderDto) {
 let order= await this.orderModel.findOne({user:req.user?._id});
if(!order){
  throw new BadRequestException("sorry the order not found");
}
 if(order?.orderStatus==OrderStatus.CANCELLED||order?.orderStatus==OrderStatus.DELIVERED||order?.orderStatus==OrderStatus.SHIPPED)
throw new BadRequestException("sorry cant update the adress of order");
 if(!UpdateCartDto.address) throw new BadRequestException("sorry cant update the adress of order");
 order.address=UpdateCartDto.address;
await order.save();
return{message:"updated succcesssfully"};

  }

}
