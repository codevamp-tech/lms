import { Controller, Post, Body, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './schemas/course.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() courseData: any): Promise<Course> {
    return this.coursesService.create(courseData);
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  // You can add more routes here for updating or deleting courses
}
