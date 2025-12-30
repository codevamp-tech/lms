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
  Headers,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }



  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    try {
      const response = await this.coursesService.createCourse(createCourseDto);
      console.log('cmid', response);
      return response;
    } catch (error) {
      return {
        message: 'Failed to create course',
      };
    }
  }

  @Post('get-creator-courses')
  async getCreatorCourses(
    @Body() body: { userId: string; page?: number; limit?: number },
  ) {
    const { userId, page = 1, limit = 7 } = body;
    try {
      const result = await this.coursesService.getCreatorCourses(
        userId,
        page,
        limit,
      );

      if (result.courses.length === 0) {
        return {
          courses: [],
          message: 'Course not found',
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          totalCourses: result.totalCourses,
        };
      }

      return result;
    } catch (error) {
      return { message: 'Failed to fetch courses' };
    }
  }

  @Get('alladmin')
  async findAll(
    @Query('userRole') userRole: string,
    @Query('userId') userId?: string | undefined,
    @Query('page') page = 1,
  ) {
    const courses =
      userRole === 'admin'
        ? await this.coursesService.findAll()
        : await this.coursesService.findByCreator(userId);

    return {
      courses,
      totalPages: 1, // or calculate later
    };
  }


  @Get('summary')
  async getCourseAnalytics() {
    try {
      return await this.coursesService.getCourseAnalytics();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch analytics');
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

  @Delete(':id')
  async deleteCourse(
    @Param('id') courseId: string,
  ): Promise<{ message: string }> {
    return this.coursesService.deleteCourse(courseId);
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

   @Get(':courseId/sales')
  async getCourseSales(@Param('courseId') courseId: string) {
    try {
      const salesData = await this.coursesService.getCourseSales(courseId);
      return {
        success: true,
        data: salesData,
      };
    } catch (error) {
      // Handle not found separately if needed
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
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

  @Put(':courseId/toggle-private')
  async togglePrivateCourse(
    @Param('courseId') courseId: string,
    @Query('privated') privated: string,
  ) {
    const isPrivate = privated === 'true';
    const statusMessage = await this.coursesService.togglePrivateStatus(
      courseId,
      isPrivate,
    );

    return {
      message: `Course is ${statusMessage}`,
    };
  }

  @Get('published/all')
  async getPublishedCourses(
    @Query('companyId') companyId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    try {
      const courses = await this.coursesService.getPublishedCourses(
        companyId,
        Number(page),
        Number(limit),
      );
      return courses;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }




  // You can add more routes here for updating or deleting courses
}
