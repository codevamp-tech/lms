import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, Req } from '@nestjs/common';
import { CoursePurchaseService } from './course-purchase.service';

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

  @Post(':userId/:courseId/create-checkout-session')
  async createCheckoutSession(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursePurchaseService.createCheckoutSession(userId, courseId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: Request,
  ) {

    const rawBody = request.body instanceof Buffer 
      ? request.body 
      : Buffer.from(JSON.stringify(request.body));
    // Now request.body will be the raw buffer
    return this.coursePurchaseService.handleStripeWebhook(rawBody, signature);
  }
}
