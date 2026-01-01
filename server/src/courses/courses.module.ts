import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Lecture, LectureSchema } from 'src/lectures/schemas/lecture.schema';
import { Enquiry, EnquirySchema } from 'src/enquiries/schemas/enquiry.schema';
import { LiveSession, LiveSessionSchema } from 'src/live-session/schemas/live-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Lecture.name, schema: LectureSchema },
      { name: Enquiry.name, schema: EnquirySchema },
      { name: LiveSession.name, schema: LiveSessionSchema },
    ]),
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
