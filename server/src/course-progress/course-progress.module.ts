import { Module } from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';
import { CourseProgressController } from './course-progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseProgress, CourseProgressSchema, LectureProgress, LectureProgressSchema } from './schemas/course-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseProgress.name, schema: CourseProgressSchema },
      { name: LectureProgress.name, schema: LectureProgressSchema }, // Register LectureProgress as well
    ]),
  ],
  providers: [CourseProgressService],
  controllers: [CourseProgressController]
})
export class CourseProgressModule {}
