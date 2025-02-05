import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  companyId: string;
}
