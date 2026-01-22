import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnquiryService } from './enquiry.service';
import { EnquiryController } from './enquiry.controller';

import { Enquiry, EnquirySchema } from './schemas/enquiry.schema';
import { ChatBuddy, ChatBuddySchema } from 'src/chat-buddy/schemas/chatbuddy.schema';

import { NotificationsModule } from 'src/notification/notifications.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    // ✅ Register BOTH schemas here
    MongooseModule.forFeature([
      { name: Enquiry.name, schema: EnquirySchema },
      { name: ChatBuddy.name, schema: ChatBuddySchema },
    ]),

    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule { }
