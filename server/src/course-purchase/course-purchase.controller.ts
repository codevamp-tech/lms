import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, RawBodyRequest, Req } from '@nestjs/common';
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
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!request.rawBody) {
      throw new BadRequestException('Missing raw body');
    }
    return this.coursePurchaseService.handleStripeWebhook(
      request.rawBody,
      signature,
    );
  }

  @Get('purchased-courses/:userId')
  async getPurchasedCourses(@Param('userId') userId: string) {
    return this.coursePurchaseService.getPurchasedCourses(userId);
  }
}
