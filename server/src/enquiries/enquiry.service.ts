import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';
import { sendMail } from '../../utils/mail';
import axios from 'axios';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private readonly enquiryModel: Model<EnquiryDocument>,
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


      const created = new this.enquiryModel(createEnquiryDto);
      const savedEnquiry = await created.save();

      await this.sendEnquiryEmail(createEnquiryDto.email, createEnquiryDto.name);

      return savedEnquiry;

    } catch (error) {
      console.error("ERROR in create enquiry:", error);
      throw error;
    }
  }



  async findAll(): Promise<Enquiry[]> {
    return this.enquiryModel.find().exec();
  }

  async findOne(id: string): Promise<Enquiry> {
    const doc = await this.enquiryModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Enquiry with id ${id} not found`);
    }
    return doc.toObject() as Enquiry;
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
