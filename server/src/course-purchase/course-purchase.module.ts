import { Module } from '@nestjs/common';
import { CoursePurchaseService } from './course-purchase.service';
import { CoursePurchaseController } from './course-purchase.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CoursePurchase,
  CoursePurchaseSchema,
} from './schemas/course-purchase.schema';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Lecture, LectureSchema } from 'src/lectures/schemas/lecture.schema';
import { RazorpayModule } from 'src/razorpay/razorpay.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoursePurchase.name, schema: CoursePurchaseSchema },
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Lecture.name,
        schema: LectureSchema,
      },
    ]),
    RazorpayModule,
  ],
  providers: [CoursePurchaseService],
  controllers: [CoursePurchaseController],
})
export class CoursePurchaseModule {}
