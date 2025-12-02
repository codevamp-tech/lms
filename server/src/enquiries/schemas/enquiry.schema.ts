// rating.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnquiryDocument = Enquiry & Document;

@Schema({ timestamps: true })
export class Enquiry {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  whatsapp: string;

  @Prop()
  type?: string;

  @Prop()
  status?: string;

  @Prop()
  price?: string;

  @Prop()
  razorpay_payment_id: string;

  @Prop()
  razorpay_order_id: string;

  @Prop()

  razorpay_signature: string;

  @Prop()
  amount: string;

  @Prop()
  currency: string;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
