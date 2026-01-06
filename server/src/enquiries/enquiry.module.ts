import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnquiryService } from './enquiry.service';
import { EnquiryController } from './enquiry.controller';
import { Enquiry, EnquirySchema } from './schemas/enquiry.schema';
import { NotificationsModule } from 'src/notification/notifications.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enquiry.name, schema: EnquirySchema }]),
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule {}
