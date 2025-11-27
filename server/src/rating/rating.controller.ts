// ratings.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingsService } from './rating.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

@Post('rating')
async submitRating(@Body() createRatingDto: CreateRatingDto) {
  return await this.ratingsService.createRating(createRatingDto);
}


  @Get(':courseId')
  async getCourseRating(@Param('courseId') courseId: string) {
    return await this.ratingsService.getAverageRating(courseId);
  }
}
