import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentFor, PaymentStatus } from "../schemas/payment.schema";
import { Types } from "mongoose";

export class CreatePaymentDto {
  @IsOptional()
  userId?: Types.ObjectId;

  @IsOptional()
  phone?: string;

  @IsEnum(PaymentFor)
  paymentFor: PaymentFor;

  @IsOptional()
  courseId?: Types.ObjectId;

  @IsOptional()
  liveSessionId?: Types.ObjectId;

  @IsOptional()
  enquiryId?: Types.ObjectId;

  @IsNumber()
  amount: number;

  @IsOptional()
  currency?: string;

  @IsOptional()
  razorpayOrderId?: string;

  @IsOptional()
  razorpayPaymentId?: string;

  @IsOptional()
  razorpaySignature?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
