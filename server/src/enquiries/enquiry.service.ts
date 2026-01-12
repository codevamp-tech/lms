import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentFor, PaymentStatus } from 'src/payments/schemas/payment.schema';
import { sendMail } from '../../utils/mail';
import axios from 'axios';
import { NotificationsService } from 'src/notification/notifications.service';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private readonly enquiryModel: Model<EnquiryDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
  ) { }

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {

    try {
      // Validate reCAPTCHA only if type is "Contact"
      if (createEnquiryDto.type === "Contact") {
        const isHuman = await this.verifyRecaptcha(createEnquiryDto.recaptchaToken);
        console.log("isHuman = ", isHuman, "token =", createEnquiryDto.recaptchaToken);
        if (!isHuman) {
          throw new BadRequestException("Bot detected");
        }
      }

      // ✅ 1. SAVE ENQUIRY (CRITICAL)
      const created = new this.enquiryModel(createEnquiryDto);
      const savedEnquiry = await created.save();

      // ✅ 2. EMAIL (NON-BLOCKING)
      this.sendEnquiryEmail(createEnquiryDto.email, createEnquiryDto.name)
        .catch(err => {
          console.error("Email failed (ignored):", err.message);
        });


      // ✅ 3. NOTIFICATION (NON-BLOCKING)
      this.notificationsService.createNotification({
        name: createEnquiryDto.name,
        title: `New Enquiry from ${createEnquiryDto.name}`,
        body: `${createEnquiryDto.name} (${createEnquiryDto.email}) submitted an enquiry of type ${createEnquiryDto.type || 'General'}`,
        payload: { enquiryId: savedEnquiry._id, email: createEnquiryDto.email },
      }).catch(err => {
        console.error("Notification failed (ignored):", err.message);
      });

      console.log("Notification triggered");

      // ✅ 4. PAYMENT (ALREADY SAFE)
      if (savedEnquiry.razorpay_order_id || savedEnquiry.razorpay_payment_id) {
        try {
          await this.paymentsService.create({
            phone: savedEnquiry.whatsapp,
            paymentFor: PaymentFor.ENQUIRY,
            enquiryId: savedEnquiry._id as any,
            amount: parseFloat(savedEnquiry.amount as any)
              || parseFloat(savedEnquiry.price as any)
              || 0,
            currency: savedEnquiry.currency || 'INR',
            razorpayOrderId: savedEnquiry.razorpay_order_id,
            razorpayPaymentId: savedEnquiry.razorpay_payment_id,
            razorpaySignature: savedEnquiry.razorpay_signature,
            status: PaymentStatus.SUCCESS,
          });
        } catch (pErr) {
          console.error('Failed creating payment record for enquiry:', pErr);
        }
      }

      // ✅ ALWAYS RETURN SAVED ENQUIRY
      return savedEnquiry;

    } catch (error) {
      console.error("ERROR in create enquiry:", error);
      throw error;
    }
  }



  async findAll(): Promise<Enquiry[]> {
    return this.enquiryModel
      .find()
      .populate({
        path: 'chatBuddyId',
        select: 'name photo bio status', // optional: limit fields
      })
      .sort({ createdAt: -1 }) // 🔥 Latest first
      .exec();
  }

  async findOne(id: string): Promise<Enquiry> {
    const doc = await this.enquiryModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Enquiry with id ${id} not found`);
    }
    return doc.toObject() as Enquiry;
  }

  async updateStatus(id: string, status: string): Promise<Enquiry> {
    const enquiry = await this.enquiryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with id ${id} not found`);
    }
    return enquiry;
  }

  private async sendEnquiryEmail(
    email: string,
    name: string
  ) {
    const mailOptions = {
      to: `${email}`,
      name: name,
      subject: 'Welcome to Mr English Training Academy',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007BFF; text-align: center;">Welcome, ${name}</h2>
          <p>Dear ${name},</p>
          <p>We are excited to inform you that you have been successfully enquired to our platform.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>Best Regards,</p>
          <p>Mr English Training Academy</p>
        </div>
      </div> 
    `,
    };
    try {
      // await this.transporter.sendMail(mailOptions);

      await sendMail(mailOptions);

      console.log(`Enquiry email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send enquiry email to ${email}`, error);
      throw new Error('Could not send enquiry email');
    }
  }

  private async verifyRecaptcha(token: string | undefined): Promise<boolean> {
    if (!token) {
      console.log("⚠️ No reCAPTCHA token received");
      return false;
    }

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      console.error("⚠️ RECAPTCHA_SECRET not set");
      return false;
    }

    try {
      const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret,
            response: token,
          },
        }
      );

      console.log("reCAPTCHA verify response:", response.data);

      const data = response.data;

      // If it's v3, there will be a score
      if (typeof data.score === "number") {
        return data.success === true && data.score >= 0.5;
      }

      // If it's v2, just check success
      return data.success === true;
    } catch (error) {
      console.error("reCAPTCHA verification failed:", error);
      return false;
    }
  }


}
