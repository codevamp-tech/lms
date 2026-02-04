import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString()
    @Matches(/^(\+91|91)?[6-9]\d{9}$/, {
        message: 'Please enter a valid Indian phone number'
    })
    phone: string;

    @IsNotEmpty({ message: 'OTP is required' })
    @IsString()
    otp: string;
}
