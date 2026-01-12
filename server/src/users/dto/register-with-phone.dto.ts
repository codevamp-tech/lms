// dto/register-with-phone.dto.ts
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class RegisterWithPhoneDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  phone: string;

  @IsString()
  name?: string;
}
