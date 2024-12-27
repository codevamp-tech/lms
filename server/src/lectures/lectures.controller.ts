import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { EditLectureDto } from './dto/edit-lecture.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Get(':lectureId')
  async getLectureById(@Param('lectureId') lectureId: string) {
    try {
      const lecture = await this.lecturesService.getLectureById(lectureId);
      return lecture;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('create/:courseId')
  async createLecture(
    @Param('courseId') courseId: string,
    @Body('lectureTitle') lectureTitle: string,
  ) {
    try {
      if (!lectureTitle || !courseId) {
        throw new BadRequestException(
          'Lecture title and course ID are required',
        );
      }
      const lecture = await this.lecturesService.createLecture(
        courseId,
        lectureTitle,
      );

      return {
        lecture,
        message: 'Lecture created successfully',
      };
    } catch (error) {
      if (error.message === 'Course not found') {
        throw new NotFoundException('Course not found');
      }
      throw new InternalServerErrorException('Failed to create lecture');
    }
  }

  @Delete(':lectureId')
  async removeLecture(@Param('lectureId') lectureId: string) {
    try {
      return await this.lecturesService.removeLecture(lectureId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('edit/:courseId/:lectureId')
  async editLecture(
    @Param('courseId') courseId: string,
    @Param('lectureId') lectureId: string,
    @Body() editLectureDto: EditLectureDto,
  ) {
    try {
      const updatedLecture = await this.lecturesService.editLecture(courseId, lectureId, editLectureDto);
      return {
        message: 'Lecture updated successfully.',
        lecture: updatedLecture,
      };
    } catch (error) {
      throw new BadRequestException('Failed to edit lecture');
    }
  }
}
