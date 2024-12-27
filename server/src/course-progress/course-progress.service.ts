import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { CourseProgress } from './schemas/course-progress.schema';

@Injectable()
export class CourseProgressService {
  constructor(
    @InjectModel('CourseProgress')
    private readonly courseProgressModel: Model<CourseProgress>,
    @InjectModel('Course')
    private readonly courseModel: Model<Course>,
  ) {}

  async getCourseProgress(courseId: string, userId: string) {
    // Step-1: Fetch the user's course progress
    const courseProgress = await this.courseProgressModel
      .findOne({ courseId, userId })
      .populate('courseId');

    // Step-2: Fetch course details
    const courseDetails = await this.courseModel
      .findById(courseId)
      .populate('lectures');

    if (!courseDetails) {
      throw new NotFoundException('Course not found');
    }

    // Step-3: If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return {
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      };
    }

    // Step-4: Return the user's course progress along with course details
    return {
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    };
  }

  async updateLectureProgress(
    courseId: string,
    userId: string,
    lectureId: string,
  ) {
    try {
      // fetch or create course progress
      let courseProgress = await this.courseProgressModel.findOne({
        courseId,
        userId,
      });

      if (!courseProgress) {
        // If no progress exist, create a new record
        courseProgress = new this.courseProgressModel({
          userId,
          courseId,
          completed: false,
          lectureProgress: [],
        });
      }

      // find the lecture progress in the course progress
      const lectureIndex = courseProgress?.lectureProgress.findIndex(
        (lecture) => lecture.lectureId === lectureId,
      );

      if (lectureIndex !== -1) {
        // if lecture already exist, update its status
        courseProgress.lectureProgress[lectureIndex].viewed = true;
      } else {
        // Add new lecture progress
        courseProgress.lectureProgress.push({
          lectureId,
          viewed: true,
        });
      }

      // if all lecture is complete
      const lectureProgressLength = courseProgress.lectureProgress.filter(
        (lectureProg) => lectureProg.viewed,
      ).length;

      const course = await this.courseModel.findById(courseId);

      if (course?.lectures.length === lectureProgressLength)
        courseProgress.completed = true;

      return await courseProgress.save();
    } catch (error) {
      console.log(error);
    }
  }

  async markAsComplete(courseId: string, userId: string) {
    try {
      const courseProgress = await this.courseProgressModel.findOne({
        courseId,
        userId,
      });
      if (!courseProgress) {
        throw new NotFoundException('Course not found');
      }

      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = true),
      );
      courseProgress.completed = true;
      return await courseProgress.save();
    } catch (error) {
      console.log(error);
    }
  }

  async markAsInComplete(courseId: string, userId: string) {
    try {
      const courseProgress = await this.courseProgressModel.findOne({
        courseId,
        userId,
      });
      if (!courseProgress) {
        throw new NotFoundException('Course not found');
      }

      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = false),
      );
      courseProgress.completed = false;
      return await courseProgress.save();
    } catch (error) {
      console.log(error);
    }
  }
}
