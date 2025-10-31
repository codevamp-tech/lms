import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  whatsappNo: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  price?: string;
}
