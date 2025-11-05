
import { Controller, Post, Body } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  async createOrder(@Body() body: { amount: number; currency: string; receipt: string }) {
    const { amount, currency, receipt } = body;
    return this.razorpayService.createOrder(amount, currency, receipt);
  }
}
