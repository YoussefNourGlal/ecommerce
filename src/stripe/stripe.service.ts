import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { OrderStatus } from 'lib/order/order.create.interface';
import { InjectModel } from '@nestjs/mongoose';
import { HOrderDocument, Order } from 'src/DB/models/order';
import { Model } from 'mongoose';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<HOrderDocument>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_PASS as string);
  }

  async checkOut(
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderid: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      cancel_url: 'http://www.google.com',
      success_url: 'http://www.facebook.com',
      customer_email: 'yousifnour2004@gmail.com',
      line_items,
      metadata: {
        orderid,
      },
    });

    return session;
  }

  async handleWebhook(req: Request) {
    const sig = req.headers['stripe-signature'] as string;
    console.log(process.env.STRIPE_WEBHOOK_SECRET);
    const event = this.stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata!.orderid;

      const order = await this.orderModel.findById(orderId);

      if (!order) return;

      order.orderStatus = OrderStatus.PAID;

      order.paymentIntentId = session.payment_intent as string;

      await order.save();
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;

      const orderRefund = await this.orderModel.findOne({
        paymentIntentId: charge.payment_intent as string,
      });

      if (!orderRefund) return;

      orderRefund.orderStatus = OrderStatus.REFUNDED;

      await orderRefund.save();
    }

    return { received: true };
  }

  async createRefund(paymentIntentId: string) {
    if (!paymentIntentId)
      throw new BadRequestException('Invalid Payment Intent ID');

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    const order = await this.orderModel.findOne({ paymentIntentId });
    if (order) {
      order.orderStatus = OrderStatus.REFUND_PENDING;
      await order.save();
    }

    return refund;
  }
}
