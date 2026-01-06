import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  async createOrder(
    @Body() body: { amount: number; currency: string; receipt: string },
  ) {
    const { amount, currency, receipt } = body;
    return this.razorpayService.createOrder(amount, currency, receipt);
  }

  // ✅ GET PAYMENTS
  @Get('payments')
  async getPayments(
    @Query('count') count?: string,
    @Query('skip') skip?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('fetchAll') fetchAll?: string,
  ) {
    // If client provides page & limit, compute skip server-side.
    if (fetchAll === 'true' || fetchAll === '1') {
      return this.razorpayService.getAllPayments(100, 0, true);
    }

    if (typeof page !== 'undefined') {
      const lim = Number(limit) || 10;
      const pg = Math.max(Number(page) || 1, 1);
      const sk = (pg - 1) * lim;
      return this.razorpayService.getAllPayments(lim, sk);
    }

    // Fallback to count/skip (backwards-compatible)
    const c = Number(count) || Number(limit) || 10;
    const s = Number(skip) || 0;
    return this.razorpayService.getAllPayments(c, s);
  }

  // ✅ GET CAPTURED PAYMENTS ONLY
  @Get('captured-payments')
  async getCapturedPayments(
    @Query('count') count?: string,
    @Query('skip') skip?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('fetchAll') fetchAll?: string,
  ) {
    if (fetchAll === 'true' || fetchAll === '1') {
      return this.razorpayService.getCapturedPayments(100, 0, true);
    }

    if (typeof page !== 'undefined') {
      const lim = Number(limit) || 10;
      const pg = Math.max(Number(page) || 1, 1);
      const sk = (pg - 1) * lim;
      return this.razorpayService.getCapturedPayments(lim, sk);
    }

    const c = Number(count) || Number(limit) || 10;
    const s = Number(skip) || 0;
    return this.razorpayService.getCapturedPayments(c, s);
  }
}
