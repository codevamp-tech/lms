import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';
import { sendMail } from '../../utils/mail';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private readonly enquiryModel: Model<EnquiryDocument>,
  ) { }

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {

    try {

      const created = new this.enquiryModel(createEnquiryDto);

      const createdEnquiry = await created.save();

      await this.sendEnquiryEmail(createEnquiryDto.email, createEnquiryDto.name);

      return createdEnquiry;

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

}
