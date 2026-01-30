import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum PaymentFor {
  COURSE = "course",
  LIVE_SESSION = "live_session",
  ENQUIRY = "enquiry", // counselling / chat / course enquiry
}

export enum PaymentStatus {
  CREATED = "created",
  SUCCESS = "success",
  FAILED = "failed",
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  userId?: Types.ObjectId;

  @Prop({ type: String, required: false })
  phone?: string;

  // what this payment is for
  @Prop({ enum: PaymentFor, required: true })
  paymentFor: PaymentFor;

  // related ids
  @Prop({ type: Types.ObjectId, ref: "Course", required: false })
  courseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "LiveSession", required: false })
  liveSessionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Enquiry", required: false })
  enquiryId?: Types.ObjectId;

  // amount details
  @Prop({ required: true })
  amount: number;

  @Prop({ default: "INR" })
  currency: string;

  // razorpay fields
  @Prop()
  razorpayOrderId: string;

  @Prop()
  razorpayPaymentId: string;

  @Prop()
  razorpaySignature: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.CREATED })
  status: PaymentStatus;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
