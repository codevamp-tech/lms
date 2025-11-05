
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from './razorpay.constants';

@Injectable()
export class RazorpayService {
  private readonly razorpay: any;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string, receipt: string) {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
    };
    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay Error:', error);
      throw new HttpException(
        error.error?.description || 'Failed to create Razorpay order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
