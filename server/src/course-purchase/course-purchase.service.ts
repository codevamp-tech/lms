import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { CoursePurchase } from './schemas/course-purchase.schema';
import { User } from 'src/users/schemas/user.schema';
import { Lecture } from 'src/lectures/schemas/lecture.schema';
import {
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
} from 'src/razorpay/razorpay.constants';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import * as crypto from 'crypto';

@Injectable()
export class CoursePurchaseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
    @InjectModel(CoursePurchase.name)
    private coursePurchaseModel: Model<CoursePurchase>,
    private readonly razorpayService: RazorpayService,
  ) {}

  async getCourseDetailWithPurchaseStatus(
    courseId: string,
    userId?: string,
  ) {
    const course = await this.courseModel
      .findById(courseId)
      .populate({ path: 'creator' })
      .populate({ path: 'lectures' });

    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    let purchased = null;
    if (userId) {
      purchased = await this.coursePurchaseModel.findOne({
        userId,
        courseId,
      });
    }

    return {
      course,
      purchased: !!purchased,
    };
  }

  async createRazorpayOrder(userId: string, courseId: string) {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException('Course not found!');
      }

      const coursePrice = parseInt(course.coursePrice, 10);

      if (isNaN(coursePrice) || coursePrice <= 0) {
        throw new HttpException(
          'This course cannot be purchased as it is free or has an invalid price.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const order = await this.razorpayService.createOrder(
        coursePrice,
        'INR',
        `course_${courseId}`,
      );

      await this.coursePurchaseModel.create({
        courseId,
        userId,
        amount: course.coursePrice,
        status: 'pending',
        paymentId: order.id,
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Payment session creation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
  ) {
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    if (!RAZORPAY_KEY_SECRET) {
      throw new HttpException(
        'Razorpay key secret not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const purchase = await this.coursePurchaseModel.findOne({
        paymentId: razorpay_order_id,
      });

      if (!purchase) {
        throw new NotFoundException('Purchase not found!');
      }

      purchase.status = 'completed';
      await purchase.save();

      await this.userModel.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId } },
        { new: true },
      );

      await this.courseModel.findByIdAndUpdate(
        purchase.courseId,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true },
      );

      return {
        success: true,
      };
    } else {
      throw new HttpException(
        'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleWebhook(signature: string, body: any) {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      throw new HttpException(
        'Razorpay webhook secret not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
    }

    const { event, payload } = body;

    if (event === 'payment.captured') {
      const { order_id } = payload.payment.entity;
      const purchase = await this.coursePurchaseModel.findOne({
        paymentId: order_id,
      });

      if (purchase && purchase.status !== 'completed') {
        purchase.status = 'completed';
        await purchase.save();

        await this.userModel.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId } },
          { new: true },
        );

        await this.courseModel.findByIdAndUpdate(
          purchase.courseId,
          { $addToSet: { enrolledStudents: purchase.userId } },
          { new: true },
        );
      }
    }

    return {
      success: true,
    };
  }

  async getPurchasedCourses(userId: string) {
    try {
      const purchasedCourses = await this.coursePurchaseModel
        .find({ userId })
        .populate({
          path: 'courseId',
          populate: {
            path: 'creator',
            model: 'User',
          },
        });

      return {
        success: true,
        courses: purchasedCourses.map((pc) => pc.courseId),
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch purchased courses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
