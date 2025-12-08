import { Body, Controller, Get, NotFoundException, Param, Post, Query, Req, Res } from '@nestjs/common';
import { CoursePurchaseService } from './course-purchase.service';
import { Request, Response } from 'express';

@Controller('course-purchase')
export class CoursePurchaseController {
  constructor(private readonly coursePurchaseService: CoursePurchaseService) { }

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

  @Post(':courseId/create-razorpay-order')
  createOrder(@Param('courseId') courseId: string) {
    return this.coursePurchaseService.createRazorpayOrder(courseId);
  }

  @Post(':userId/:courseId/cancel')
  async cancelPurchase(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Body() body?: { orderId?: string },
  ) {
    return this.coursePurchaseService.cancelPurchase(userId, courseId, body?.orderId);
  }

  @Post('verify-payment')
  verify(@Body() body: any) {
    return this.coursePurchaseService.verifyPayment(body);
  }

  @Post('mark-failed')
  async markFailed(@Body() body: { razorpay_order_id?: string; razorpay_payment_id?: string; userId?: string; courseId?: string; }) {
    return this.coursePurchaseService.markFailed(body);
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
