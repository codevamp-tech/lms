import { IsNotEmpty, IsString, IsOptional, IsIn, Matches } from 'class-validator';

export class SendOtpDto {
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString()
    @Matches(/^(\+91|91)?[6-9]\d{9}$/, {
        message: 'Please enter a valid Indian phone number'
    })
    phone: string;

    @IsOptional()
    @IsIn(['sms'], { message: 'Channel must be sms' })
    channel?: 'sms'; // WhatsApp channel removed - using SMSBits only

    @IsOptional()
    @IsString()
    name?: string;
}
