import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { CoursePurchaseModule } from './course-purchase/course-purchase.module';
import { CourseProgressModule } from './course-progress/course-progress.module';
import { VideoUploadModule } from './video-upload/video-upload.module';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { StripeWebhookMiddleware } from './middlewares/stripe-webhook.middleware';
import { CompanyModule } from './company/company.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ImageUploadController } from './image-upload/image-upload.controller';
import { ImageUploadService } from './image-upload/image-upload.service';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { RatingsModule } from './rating/rating.module';

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/lms'),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StripeWebhookMiddleware)
      .forRoutes('course-purchase/webhook');
  }
}
