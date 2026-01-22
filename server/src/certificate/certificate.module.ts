import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { CertificateSchema } from './schemas/certificate.schema';
import { CourseProgressSchema } from '../course-progress/schemas/course-progress.schema';
import { CoursePurchaseSchema } from '../course-purchase/schemas/course-purchase.schema';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Certificate', schema: CertificateSchema },
      { name: 'CourseProgress', schema: CourseProgressSchema },
      { name: 'CoursePurchase', schema: CoursePurchaseSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule { }
