import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Patch,
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Delete(':id')
  async deleteCourse(
    @Param('id') courseId: string,
  ): Promise<{ message: string }> {
    return this.coursesService.deleteCourse(courseId);
  }

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    try {
      const response = await this.coursesService.createCourse(createCourseDto);
      return response;
    } catch (error) {
      return {
        message: 'Failed to create course',
      };
    }
  }

  @Post('get-creator-courses')
  async getCreatorCourses(@Body() body: { userId: string }) {
    const { userId } = body;
    try {
      const courses = await this.coursesService.getCreatorCourses(userId);
      if (courses.length === 0) {
        return {
          courses: [],
          message: 'Course not found',
        };
      }
      return { courses };
    } catch (error) {
      return { message: 'Failed to fetch courses' };
    }
  }

  @Patch(':courseId')
  @UseInterceptors(FileInterceptor('thumbnail')) // Intercept the 'thumbnail' file
  async editCourse(
    @Param('courseId') courseId: string,
    @Body() editCourseDto: EditCourseDto,
    @UploadedFile() thumbnail: Express.Multer.File, // Handle the uploaded file
  ) {
    const course = await this.coursesService.editCourse(
      courseId,
      editCourseDto,
      thumbnail,
    );

    return {
      course,
      message: 'Course updated successfully.',
    };
  }

  @Get(':courseId')
  async getCourseById(@Param('courseId') courseId: string): Promise<Course> {
    try {
      const course = await this.coursesService.getCourseById(courseId);
      return course;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':courseId/lectures')
  async getCourseLectures(@Param('courseId') courseId: string) {
    try {
      const lectures = await this.coursesService.getCourseLecture(courseId);
      return { lectures };
    } catch (error) {
      if (error.message === 'Course not found') {
        throw new NotFoundException('Course not found');
      }
      throw new InternalServerErrorException('Failed to get lectures');
    }
  }

  @Put(':courseId/toggle-publish')
  async togglePublishCourse(
    @Param('courseId') courseId: string,
    @Query('publish') publish: string,
  ) {
    const isPublished = publish === 'true';
    const statusMessage = await this.coursesService.togglePublishStatus(
      courseId,
      isPublished,
    );

    return {
      message: `Course is ${statusMessage}`,
    };
  }

  @Get('published/all')
  async getPublishedCourses() {
    try {
      const courses = await this.coursesService.getPublishedCourses();
      return courses;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  // You can add more routes here for updating or deleting courses
}
