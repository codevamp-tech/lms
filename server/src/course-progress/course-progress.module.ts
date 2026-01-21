import { Module } from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';
import { CourseProgressController } from './course-progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseProgress, CourseProgressSchema, LectureProgress, LectureProgressSchema } from './schemas/course-progress.schema';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';
import { CoursePurchase, CoursePurchaseSchema } from 'src/course-purchase/schemas/course-purchase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseProgress.name, schema: CourseProgressSchema },
      { name: LectureProgress.name, schema: LectureProgressSchema },
      { name: Course.name, schema: CourseSchema },
      { name: CoursePurchase.name, schema: CoursePurchaseSchema },
    ]),
  ],
  providers: [CourseProgressService],
  controllers: [CourseProgressController]
})
export class CourseProgressModule { }
