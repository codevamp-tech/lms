import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { Lecture } from './schemas/lecture.schema';
import { deleteVideoFromCloudinary } from 'utils/cloudinary';
import { EditLectureDto } from './dto/edit-lecture.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';

@Injectable()
export class LecturesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
  ) {}

  async getLectureById(lectureId: string): Promise<Lecture> {
    const lecture = await this.lectureModel.findById(lectureId).exec();
    if (!lecture) {
      throw new NotFoundException('Lecture not found!');
    }
    return lecture;
  }

  async removeLecture(lectureId: string): Promise<{ message: string }> {
    const lecture = await this.lectureModel.findByIdAndDelete(lectureId);
    if (!lecture) {
      throw new NotFoundException('Lecture not found!');
    }

    // Delete the lecture from Cloudinary if publicId exists
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await this.courseModel.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } },
    );

    return { message: 'Lecture removed successfully.' };
  }

  async createLecture(courseId: string, createLectureDto: CreateLectureDto) {
    const { lectureTitle, videoInfo, isPreviewFree } = createLectureDto;

    const lecture = new this.lectureModel({
      courseId, // Ensure you're passing courseId here
    });

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    await lecture.save(); // Save the lecture to the database

    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new Error('Course not found');
    }

    course.lectures.push(lecture._id as any);
    await course.save();

    return lecture;
  }

  async editLecture(
    courseId: string,
    lectureId: string,
    editLectureDto: EditLectureDto,
  ) {
    const { lectureTitle, videoInfo, isPreviewFree } = editLectureDto;

    // Find the lecture, assert its type as a Lecture document
    const lecture = await this.lectureModel.findById(lectureId).exec();
    if (!lecture) {
      throw new NotFoundException('Lecture not found!');
    }

    // Update lecture fields
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not already added
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    if (course && !course.lectures.includes(lecture._id as any)) {
      course.lectures.push(lecture._id as any);
      await course.save();
    }

    return lecture;
  }
}
