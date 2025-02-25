// ratings.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingsService } from './rating.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':courseId/rating')
  async submitRating(
    @Param('courseId') courseId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    // Set the courseId from the URL
    createRatingDto.courseId = courseId;
    // Here we trust the frontend to include the userId in the request body.
    return await this.ratingsService.createRating(createRatingDto);
  }

  @Get(':courseId')
  async getCourseRating(@Param('courseId') courseId: string) {
    return await this.ratingsService.getAverageRating(courseId);
  }
}
