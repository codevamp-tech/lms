import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';
import { Lecture } from 'src/lectures/schemas/lecture.schema';
import { deleteMediaFromCloudinary, uploadMedia } from 'utils/cloudinary';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    try {
      const { courseTitle, category, creatorId } = createCourseDto;

      if (!courseTitle || !category) {
        throw new Error('Course title and category are required.');
      }

      const course = await this.courseModel.create({
        courseTitle,
        category,
        creator: creatorId, // You can pass the creator ID
      });

      return {
        course,
        message: 'Course created.',
      };
    } catch (error) {
      throw new Error('Failed to create course');
    }
  }

  async getCreatorCourses(userId: string): Promise<Course[]> {
    try {
      const courses = await this.courseModel.find({ creator: userId }).exec();
      return courses;
    } catch (error) {
      throw new Error('Failed to fetch courses');
    }
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {  
      throw new NotFoundException('Course not found!');
    }
    return course;
  }

  async editCourse(
    courseId: string,
    editCourseDto: EditCourseDto,
    thumbnail?: Express.Multer.File,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found!');
    }
  
    let courseThumbnail = course.courseThumbnail;
  
    // Handle thumbnail upload
    if (thumbnail) {
      try {
        // Delete existing thumbnail if any
        if (course.courseThumbnail) {
          const publicId = course.courseThumbnail.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteMediaFromCloudinary(publicId);
          }
        }
  
        // Upload buffer to Cloudinary
        const uploaded = await uploadMedia(thumbnail.buffer, {
          folder: 'course_thumbnails',
          resource_type: 'image'
        });
  
        if (uploaded && uploaded.secure_url) {
          courseThumbnail = uploaded.secure_url;
        } else {
          throw new Error('Failed to upload thumbnail.');
        }
      } catch (error) {
        console.error('Thumbnail upload error:', error);
        throw new Error(`Thumbnail upload failed: ${error.message}`);
      }
    }
    // Update the course with new data
    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      courseId,
      {
        ...editCourseDto,
        courseThumbnail, // Update thumbnail
      },
      { new: true },
    );

    if (!updatedCourse) {
      throw new NotFoundException('Failed to update course.');
    }

    return updatedCourse;
  }

  async getCourseLecture(courseId: string): Promise<Lecture[]> {
    const course = await this.courseModel
      .findById(courseId)
      .populate('lectures');
    if (!course) {
      throw new NotFoundException('Course not found!');
    }
    return course.lectures;
  }

  async getPublishedCourses() {
    try {
      const courses = await this.courseModel
        .find({ isPublished: true })
        .populate({ path: 'creator', select: 'name photoUrl' });

      if (!courses || courses.length === 0) {
        throw new NotFoundException('No published courses found');
      }

      return courses;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch published courses');
    }
  }

  async togglePublishStatus(courseId: string, isPublished: boolean): Promise<string> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    // Update the publication status
    course.isPublished = isPublished;
    await course.save();

    return isPublished ? 'Published' : 'Unpublished';
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find()
      .populate('creator enrolledStudents lectures')
      .exec();
  }

  // Add methods for updating, deleting, or finding a single course
}
