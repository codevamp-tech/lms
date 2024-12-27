import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './schemas/lecture.schema';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecture.name, schema: LectureSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  providers: [LecturesService],
  controllers: [LecturesController],
})
export class LecturesModule {}
