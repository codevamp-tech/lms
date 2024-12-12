import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { CoursePurchaseModule } from './course-purchase/course-purchase.module';
import { CourseProgressModule } from './course-progress/course-progress.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/lms'),
    UsersModule,
    CoursesModule,
    LecturesModule,
    CoursePurchaseModule,
    CourseProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
