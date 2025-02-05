// create-company.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  alternateNumber?: string;

  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @IsString()
  @IsNotEmpty()
  gst: string;

  @IsEnum(['Monthly', 'Quarterly', 'Half-Yearly', 'Annually', 'Trial'])
  @IsNotEmpty()
  subscriptionType: string;

  @IsString()
  @IsOptional()
  trialDuration?: string;

  @IsNotEmpty()
  date: Date;

  @IsEnum(['Active', 'Inactive', 'On-Hold'])
  @IsNotEmpty()
  status: string;
}
