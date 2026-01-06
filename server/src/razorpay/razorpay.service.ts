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
      amount: amount * 100,
      currency,
      receipt,
    };
    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new HttpException(
        error.error?.description || 'Failed to create Razorpay order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ GET ALL PAYMENTS
  // If `fetchAll` is true or requested `count` > 100, this will page through
  // Razorpay results (100 per request) and return a combined result.
  async getAllPayments(count = 100, skip = 0, fetchAll = false) {
    try {
      // fast path: single request within Razorpay limit
      if (!fetchAll && count <= 100) {
        return this.razorpay.payments.all({ count, skip });
      }

      const perPage = 100;
      let allItems: any[] = [];
      let currentSkip = skip;

      // if not fetchAll, we want up to `count` items; otherwise fetch until exhausted
      const wantAll = fetchAll;
      const target = wantAll ? Number.POSITIVE_INFINITY : count;

      while (allItems.length < target) {
        const fetchCount = Math.min(perPage, target - allItems.length);
        const res = await this.razorpay.payments.all({ count: fetchCount, skip: currentSkip });

        if (!res || !Array.isArray(res.items) || res.items.length === 0) break;

        allItems.push(...res.items);
        currentSkip += res.items.length;

        // if fewer items returned than requested, we've reached the end
        if (res.items.length < fetchCount) break;
      }

      return {
        items: allItems,
        count: allItems.length,
      };
    } catch (error) {
      throw new HttpException(
        error.error?.description || 'Failed to fetch payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ GET CAPTURED PAYMENTS ONLY
  async getCapturedPayments(count = 100, skip = 0, fetchAll = false) {
    try {
      // If simple case, fetch and filter
      if (!fetchAll && count <= 100) {
        // Prefer server-side filtering if Razorpay supports it
        let payments = await this.razorpay.payments.all({ count, skip, captured: true }).catch(async () => {
          // Fallback: fetch and filter client-side
          return this.razorpay.payments.all({ count, skip });
        });

        const capturedPayments = (payments.items || []).filter((p: any) => p.status === 'captured');
        return { ...payments, items: capturedPayments, count: capturedPayments.length };
      }

      // Otherwise page through results and collect captured items
      const perPage = 100;
      let captured: any[] = [];
      let currentSkip = skip;
      const wantAll = fetchAll;
      const target = wantAll ? Number.POSITIVE_INFINITY : count;

      while (captured.length < target) {
        const fetchCount = Math.min(perPage, target - captured.length);
        // Request captured payments from Razorpay if supported, otherwise fallback
        const res = await this.razorpay.payments.all({ count: fetchCount, skip: currentSkip, captured: true }).catch(async () => {
          return this.razorpay.payments.all({ count: fetchCount, skip: currentSkip });
        });

        if (!res || !Array.isArray(res.items) || res.items.length === 0) break;

        const capturedInPage = res.items.filter((p: any) => p.status === 'captured');
        captured.push(...capturedInPage);

        currentSkip += res.items.length;

        // if fewer items returned than requested, end reached
        if (res.items.length < fetchCount) break;
      }

      return { items: captured, count: captured.length };
    } catch (error) {
      throw new HttpException(
        error.error?.description || 'Failed to fetch captured payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
