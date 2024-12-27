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
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoursePurchaseService {
  private readonly stripe: Stripe;

  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
    @InjectModel(CoursePurchase.name)
    private coursePurchaseModel: Model<CoursePurchase>,
  ) {
    const secret_key =
      'sk_test_51QaasEKyN5smze6Wl5NSUn46m8X7d3u5ucnlWwKEuJqWQ0tGrwIunRYa5Q7Ef6XNnvIsdeP1ykoESbIifTI0zhvi004OmnPFan';
    this.stripe = new Stripe(secret_key);
  }

  async getCourseDetailWithPurchaseStatus(courseId: string, userId: string) {
    const course = await this.courseModel
      .findById(courseId)
      .populate({ path: 'creator' })
      .populate({ path: 'lectures' });

    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    const purchased = await this.coursePurchaseModel.findOne({
      userId,
      courseId,
    });

    return {
      course,
      purchased: !!purchased,
    };
  }

  async createCheckoutSession(userId: string, courseId: string) {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException('Course not found!');
      }

      // Create a new course purchase record
      const newPurchase = await this.coursePurchaseModel.create({
        courseId,
        userId,
        amount: course.coursePrice,
        status: 'pending',
      });

      // Create Stripe checkout session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: course.courseTitle,
                images: [course.courseThumbnail],
              },
              unit_amount: course.coursePrice * 100, // Amount in paise
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/course/course-progress/${courseId}`,
        cancel_url: `http://localhost:3000/course/course-detail/${courseId}`,
        metadata: {
          courseId: courseId,
          userId: userId,
        },
        shipping_address_collection: {
          allowed_countries: ['IN'],
        },
      });

      if (!session.url) {
        throw new HttpException(
          'Error while creating session',
          HttpStatus.BAD_REQUEST,
        );
      }

      newPurchase.paymentId = session.id;

      // Save the purchase record
      await newPurchase.save();

      return {
        success: true,
        url: session.url,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Payment session creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    try {
      const webhookSecret = 'whsec_4RN8UMxqVh03yR2CCWvjR2eHCmCnwzqb';

      // Verify the webhook came from Stripe
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );

      // Handle the event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Find the purchase
        const purchase = await this.coursePurchaseModel
          .findOne({ paymentId: session.id })
          .populate('courseId');

        if (!purchase) {
          throw new Error('Purchase not found');
        }

        // Update purchase status
        purchase.status = 'completed';
        await purchase.save();

        // Update purchase details
        purchase.amount = session.amount_total
          ? session.amount_total / 100
          : purchase.amount;
        purchase.status = 'completed';
        await purchase.save();

        // Update lecture visibility
        if (
          purchase.courseId &&
          (purchase.courseId as any).lectures?.length > 0
        ) {
          await this.lectureModel.updateMany(
            { _id: { $in: (purchase.courseId as any).lectures } },
            { $set: { isPreviewFree: true } },
          );
        }

        // Update user's enrolled courses
        await this.userModel.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId } },
          { new: true },
        );

        // Update course's enrolled students
        await this.courseModel.findByIdAndUpdate(
          purchase.courseId,
          { $addToSet: { enrolledStudents: purchase.userId } },
          { new: true },
        );
      }

      return { success: true };
    } catch (error) {
      throw new HttpException(
        error.message || 'Webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
