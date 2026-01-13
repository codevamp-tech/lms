import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { EnquiryModule } from './enquiries/enquiry.module';
import { LecturesModule } from './lectures/lectures.module';
import { CoursePurchaseModule } from './course-purchase/course-purchase.module';
import { CourseProgressModule } from './course-progress/course-progress.module';
import { VideoUploadModule } from './video-upload/video-upload.module';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { CompanyModule } from './company/company.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ImageUploadController } from './image-upload/image-upload.controller';
import { ImageUploadService } from './image-upload/image-upload.service';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { RatingsModule } from './rating/rating.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { LiveSessionModule } from './live-session/live-session.module';
import { ConfigModule } from '@nestjs/config';
import { RazorpayModule } from './razorpay/razorpay.module';
import { SessionsModule } from './session/session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ChatBuddyModule } from './chat-buddy/chat-buddy.module';
import { NotificationsModule } from './notification/notifications.module';
import { PaymentsModule } from './payments/payments.module';



// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://root:GXkg9RvCMEYOw7nY@arogyaa.l0qed.mongodb.net/lms'),
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/lms'),
    // MongooseModule.forRoot('mongodb+srv://mohsinansari4843:48RMOzYezlJA5Lh7@cluster0.dyphqra.mongodb.net/lms_tesing'),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
            '-' +
            uniqueSuffix +
            path.extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        // Validate file types
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        } else {
          cb(new Error('Error: Only image files are allowed!'), false);
        }
      },
      limits: {
        // Limit file size to 5MB
        fileSize: 5 * 1024 * 1024,
      },
    }),
    SessionsModule,
    UsersModule,
    CoursesModule,
    LecturesModule,
    CoursePurchaseModule,
    CourseProgressModule,
    VideoUploadModule,
    CompanyModule,
    ConfigurationModule,
    ImageUploadModule,
    RatingsModule,
    FavoritesModule,
    CartModule,
    LiveSessionModule,
    RazorpayModule,
    EnquiryModule,
    ChatBuddyModule,
    NotificationsModule,
    PaymentsModule,
    ThrottlerModule.forRoot([{
      ttl: 60, // time window in seconds
      limit: 5, // max requests per IP within ttl
    }])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // global rate limiting
    },
  ],
})
export class AppModule { }
