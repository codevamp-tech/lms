import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEmail,
} from 'class-validator';

export class CreateConfigurationDto {
  @IsNotEmpty()
  @IsString()
  company_id: string; // required now

  @IsNotEmpty()
  @IsString()
  billingAddress: string; // required now

  @IsNotEmpty()
  @IsString()
  phone: string; // required now

  @IsNotEmpty()
  @IsString()
  name: string; // required now

  // If you still want the optional fields from before, you can include them as well:
  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
