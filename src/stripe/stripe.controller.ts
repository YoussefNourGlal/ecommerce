import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import {  type Request } from 'express';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

@Post('webhook')
//@UseGuards(AuthGuard)
 handleWebhook(@Req() req:Request) {
  return this.stripeService.handleWebhook(req)
}




}
