import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  companyId: string;
}
