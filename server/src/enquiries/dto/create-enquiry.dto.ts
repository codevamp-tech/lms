import { IsNotEmpty, IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateEnquiryDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  whatsapp: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()

  razorpay_payment_id: string;

  @IsOptional()
  @IsString()
  razorpay_order_id: string;

  @IsOptional()
  @IsString()
  razorpay_signature: string;

  @IsOptional()
  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  currency: string;

  @IsOptional()
  @IsIn(['morning', 'afternoon', 'evening', 'night', 'anytime'])
  preferredTimeToCall?: string;

  // ✅ NEW
  @IsOptional()
  @IsString()
  chatBuddyId?: string;


  @IsOptional()
  @IsString()
  recaptchaToken?: string;
}