import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';

@Controller('course-progress')
export class CourseProgressController {
  constructor(private readonly courseProgressService: CourseProgressService) {}

  @Get(':courseId/:userId')
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const course = await this.courseProgressService.getCourseProgress(
        courseId,
        userId,
      );
      return course;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':courseId/:userId/complete')
  async markAsComplete(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const progress = await this.courseProgressService.markAsComplete(courseId, userId)
      return progress;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':courseId/:userId/incomplete')
  async markAsInComplete(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const progress = await this.courseProgressService.markAsInComplete(courseId, userId)
      return progress;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':courseId/:userId/:lectureId/view')
  async updateLectureProgress(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Param('lectureId') lectureId: string,
  ) {
    try {
      const progress = await this.courseProgressService.updateLectureProgress(courseId, userId, lectureId)
      return progress;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
