import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  website?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  alternateNumber?: string;

  @Prop({ required: true })
  billingAddress: string;

  @Prop({ required: true })
  gst: string;

  @Prop({
    required: true,
    enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Annually', 'Trial'],
  })
  subscriptionType: string;

  @Prop()
  trialDuration?: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, enum: ['Active', 'Inactive', 'On-Hold'] })
  status: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
