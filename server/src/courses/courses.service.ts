import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  // Add your methods to interact with the course data
  async create(courseData: any): Promise<Course> {
    const newCourse = new this.courseModel(courseData);
    return newCourse.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('creator enrolledStudents lectures').exec();
  }

  // Add methods for updating, deleting, or finding a single course
}
