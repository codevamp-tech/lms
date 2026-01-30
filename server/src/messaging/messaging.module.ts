import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Fast2SmsService } from './fast2sms.service';
import { WatiService } from './wati.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [Fast2SmsService, WatiService],
    exports: [Fast2SmsService, WatiService],
})
export class MessagingModule { }
