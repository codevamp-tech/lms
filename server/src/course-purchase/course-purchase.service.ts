import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { CoursePurchase } from './schemas/course-purchase.schema';
import { User } from 'src/users/schemas/user.schema';
import { sendMail } from '../../utils/mail';
import { NotificationsService } from 'src/notification/notifications.service';

import { Lecture } from 'src/lectures/schemas/lecture.schema';

import { RazorpayService } from 'src/razorpay/razorpay.service';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentFor, PaymentStatus } from 'src/payments/schemas/payment.schema';
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
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
  ) { }

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

    let purchaseRecord = null;
    if (userId) {
      purchaseRecord = await this.coursePurchaseModel.findOne({
        userId,
        courseId,
      });
    }

    // Only consider the course 'purchased' when the purchase record
    // explicitly indicates a completed payment, is not revoked, and not expired.
    let purchased = false;
    let isExpired = false;
    let isRevoked = false;

    if (purchaseRecord && purchaseRecord.status === 'completed') {
      isRevoked = purchaseRecord.isRevoked === true;
      if (purchaseRecord.expiryDate) {
        isExpired = new Date() > new Date(purchaseRecord.expiryDate);
      }
      purchased = !isRevoked && !isExpired;
    }

    return {
      course,
      purchased,
      isExpired,
      isRevoked,
      // expose the raw purchase record so clients can show pending/failed state
      coursePurchase: purchaseRecord || null,
    };
  }

  async createRazorpayOrder(courseId: string) {
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
        amount: course.coursePrice,
        status: 'pending',
        orderId: order.id,
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

  async verifyPaymentSignature(paymentDetails: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }): Promise<boolean> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new HttpException(
        'Razorpay key secret not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }

  async verifyPayment(dto: {
    razorpay_order_id: any;
    razorpay_payment_id: any;
    razorpay_signature: any;
    userId?: any;
    courseId?: any;
  }) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      courseId,
    } = dto;

    const valid = await this.verifyPaymentSignature(dto);
    if (!valid) throw new BadRequestException("Invalid payment");

    // Calculate expiry date (3 months from now)
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);

    const updatedPurchase = await this.coursePurchaseModel.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        userId,
        courseId,
        paymentId: razorpay_payment_id,
        status: "completed",
        purchaseDate,
        expiryDate,
        isRevoked: false,
      },
      { new: true }
    );

    if (!updatedPurchase) {
      throw new BadRequestException("Order not found or already processed");
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: updatedPurchase.courseId },
    });

    await this.courseModel.findByIdAndUpdate(updatedPurchase.courseId, {
      $addToSet: { enrolledStudents: userId },
    });

    // 🔥 GET USER DETAILS
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException("User not found");

    // 🔥 GET COURSE DETAILS
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new BadRequestException("Course not found");

    // create a Payment record for this successful course purchase
    try {
      await this.paymentsService.create({
        userId: new Types.ObjectId(userId),
        paymentFor: PaymentFor.COURSE,
        courseId: new Types.ObjectId(courseId),
        amount: parseInt(course.coursePrice as any, 10) || 0,
        currency: 'INR',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: PaymentStatus.SUCCESS,
      });
    } catch (pErr) {
      console.error('Failed creating payment record:', pErr);
    }
    try {
      // ================================

      // ================================
      await sendMail({
        to: user.email,
        name: user.name,
        subject: `Course Purchased: ${course.subTitle}`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #28a745; text-align: center;">Payment Successful 🎉</h2>

            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Thank you for purchasing the course <strong>${course.subTitle}</strong>.</p>

            <p>Your payment ID is <strong>${razorpay_payment_id}</strong>.</p>

            <p>You now have full access to the course in your dashboard.</p>

            <br />
            <p>Best Regards,<br>Mr English Training Academy</p>
          </div>
        </div>
      `,
      });

      console.log("📩 Purchase email sent to:", user.email);
      try {
        await this.notificationsService.createNotification({
          userId: new Types.ObjectId(userId),
          title: `Course Purchased: ${course.subTitle}`,
          body: `You have successfully purchased ${course.subTitle}. Payment ID: ${razorpay_payment_id}`,
          payload: { courseId: updatedPurchase.courseId, purchaseId: updatedPurchase._id },
        });
      } catch (nErr) {
        console.error('❌ Notification creation failed:', nErr);
      }
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // BUT we don't stop the success response — course purchase is still valid
    }

    return { success: true };
  }



  async cancelPurchase(userId: string, courseId: string, orderId?: string) {
    // Mark a pending purchase as failed/cancelled when user dismisses checkout
    const query: any = { userId, courseId };
    if (orderId) query.paymentId = orderId;

    const purchase = await this.coursePurchaseModel.findOne(query);
    if (!purchase) {
      return { success: false, message: 'No pending purchase found' };
    }

    if (purchase.status === 'completed') {
      return { success: false, message: 'Purchase already completed' };
    }

    purchase.status = 'failed';
    await purchase.save();

    return { success: true };
  }

  async markFailed(body: { razorpay_order_id?: string; razorpay_payment_id?: string; userId?: string; courseId?: string; }) {
    const { razorpay_order_id } = body;
    if (!razorpay_order_id) {
      throw new HttpException('Order id required', HttpStatus.BAD_REQUEST);
    }

    const purchase = await this.coursePurchaseModel.findOne({ paymentId: razorpay_order_id });
    if (!purchase) {
      return { success: false, message: 'Purchase not found' };
    }

    if (purchase.status === 'completed') {
      return { success: false, message: 'Purchase already completed' };
    }

    purchase.status = 'failed';
    await purchase.save();

    return { success: true };
  }

  async handleWebhook(signature: string, body: any) {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      throw new HttpException(
        'Razorpay webhook secret not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
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

        // ensure a Payment record exists for webhook-captured payments
        try {
          await this.paymentsService.create({
            userId: purchase.userId ? new Types.ObjectId(purchase.userId) : undefined,
            paymentFor: PaymentFor.COURSE,
            courseId: purchase.courseId ? new Types.ObjectId(purchase.courseId) : undefined,
            amount: parseInt((purchase as any).amount as any, 10) || 0,
            currency: 'INR',
            razorpayOrderId: order_id,
            razorpayPaymentId: payload.payment.entity.id,
            razorpaySignature: payload.payment.entity.signature,
            status: PaymentStatus.SUCCESS,
          });
        } catch (pErr) {
          console.error('Failed creating payment record from webhook:', pErr);
        }
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

  // Admin: Get all course purchases with user and course details
  async getAllPurchasesForAdmin() {
    try {
      const purchases = await this.coursePurchaseModel
        .find({ status: 'completed' })
        .populate({ path: 'userId', select: 'name email' })
        .populate({ path: 'courseId', select: 'courseTitle subTitle' })
        .sort({ createdAt: -1 });

      return {
        success: true,
        purchases: purchases.map((p) => {
          const now = new Date();
          const isExpired = p.expiryDate ? now > new Date(p.expiryDate) : false;
          return {
            _id: p._id,
            user: p.userId,
            course: p.courseId,
            amount: p.amount,
            purchaseDate: p.purchaseDate,
            expiryDate: p.expiryDate,
            isRevoked: p.isRevoked,
            isExpired,
            isActive: !p.isRevoked && !isExpired,
          };
        }),
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch purchases',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Admin: Revoke access to a course for a specific purchase
  async revokeAccess(purchaseId: string) {
    const purchase = await this.coursePurchaseModel.findById(purchaseId);
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    if (purchase.status !== 'completed') {
      throw new BadRequestException('Cannot revoke a non-completed purchase');
    }

    purchase.isRevoked = true;
    await purchase.save();

    // Optionally remove from enrolledCourses/enrolledStudents arrays
    await this.userModel.findByIdAndUpdate(purchase.userId, {
      $pull: { enrolledCourses: purchase.courseId },
    });

    await this.courseModel.findByIdAndUpdate(purchase.courseId, {
      $pull: { enrolledStudents: purchase.userId },
    });

    return {
      success: true,
      message: 'Access revoked successfully',
    };
  }

  // Admin: Restore access (un-revoke)
  async restoreAccess(purchaseId: string) {
    const purchase = await this.coursePurchaseModel.findById(purchaseId);
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    purchase.isRevoked = false;
    await purchase.save();

    // Re-add to enrolledCourses/enrolledStudents arrays
    await this.userModel.findByIdAndUpdate(purchase.userId, {
      $addToSet: { enrolledCourses: purchase.courseId },
    });

    await this.courseModel.findByIdAndUpdate(purchase.courseId, {
      $addToSet: { enrolledStudents: purchase.userId },
    });

    return {
      success: true,
      message: 'Access restored successfully',
    };
  }
}

