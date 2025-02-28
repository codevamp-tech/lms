import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsController } from './rating.controller';
import { RatingsService } from './rating.service';
import { Rating, RatingSchema } from './schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
