import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './schemas/lecture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
  ],
  providers: [LecturesService],
  controllers: [LecturesController]
})
export class LecturesModule {}
