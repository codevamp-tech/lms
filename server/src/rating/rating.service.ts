// ratings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating, RatingDocument } from './schemas/course.schema';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  // Create a new rating for a course
  async createRating(createRatingDto: CreateRatingDto): Promise<Rating> {
    const newRating = new this.ratingModel({ ...createRatingDto });
    return await newRating.save();
  }

  // Get the average rating and count for a specific course
  async getAverageRating(
    courseId: string,
  ): Promise<{ average: number; count: number }> {
    const ratings = await this.ratingModel.find({ courseId });
    const count = ratings.length;
    const average =
      count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { average, count };
  }
}
