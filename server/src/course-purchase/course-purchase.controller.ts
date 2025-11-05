import { Body, Controller, Get, NotFoundException, Param, Post, Query, Req, Res } from '@nestjs/common';
import { CoursePurchaseService } from './course-purchase.service';
import { Request, Response } from 'express';

@Controller('course-purchase')
export class CoursePurchaseController {
  constructor(private readonly coursePurchaseService: CoursePurchaseService) {}

  @Get(':courseId')
  async getCoursedetailWithPurchaseStatus(
    @Param('courseId') courseId: string,
    @Query('userId') userId?: string,
  ) {
    try {
      const course =
        await this.coursePurchaseService.getCourseDetailWithPurchaseStatus(
          courseId, userId
        );
      return course;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':userId/:courseId/create-razorpay-order')
  async createRazorpayOrder(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursePurchaseService.createRazorpayOrder(userId, courseId);
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) {
    return this.coursePurchaseService.verifyPayment(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const signature = req.headers['x-razorpay-signature'] as string;
    await this.coursePurchaseService.handleWebhook(signature, req.body);
    res.status(200).send();
  }

  @Get('purchased-courses/:userId')
  async getPurchasedCourses(@Param('userId') userId: string) {
    return this.coursePurchaseService.getPurchasedCourses(userId);
  }
}
