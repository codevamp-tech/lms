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
      const { courseTitle, category, creatorId, companyId } = createCourseDto;

      if (!courseTitle || !category) {
        throw new Error('Course title and category are required.');
      }

      const course = await this.courseModel.create({
        courseTitle,
        category,
        creator: creatorId,
        companyId,
      });

      return {
        course,
        message: 'Course created.',
      };
    } catch (error) {
      throw new Error('Failed to create course');
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
          const publicId = course.courseThumbnail
            .split('/')
            .pop()
            ?.split('.')[0];
          if (publicId) {
            await deleteMediaFromCloudinary(publicId);
          }
        }

        // Upload buffer to Cloudinary
        const uploaded = await uploadMedia(thumbnail.buffer, {
          folder: 'course_thumbnails',
          resource_type: 'image',
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

  async getPublishedCourses(
    companyId: string,
    page: number = 1,
    limit: number = 12,
  ) {
    try {
      const skip = (page - 1) * limit;

      const query = companyId
        ? {
            isPublished: true,
            $or: [{ companyId }, { isPrivate: false }],
          }
        : { isPublished: true, isPrivate: false };

      const courses = await this.courseModel
        .find(query)
        .populate({ path: 'creator', select: 'name photoUrl' })
        .skip(skip)
        .limit(limit);

      const totalCourses = await this.courseModel.countDocuments(query);

      return {
        courses,
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: page,
        totalCourses,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to fetch published courses',
      );
    }
  }

  async getCreatorCourses(
    userId: string,
    page: number = 1,
    limit: number = 7,
  ): Promise<{
    courses: Course[];
    totalPages: number;
    currentPage: number;
    totalCourses: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const query = { creator: userId };

      const courses = await this.courseModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
      const totalCourses = await this.courseModel.countDocuments(query);

      return {
        courses,
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: page,
        totalCourses,
      };
    } catch (error) {
      throw new Error('Failed to fetch courses');
    }
  }

  async togglePublishStatus(
    courseId: string,
    isPublished: boolean,
  ): Promise<string> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    // Update the publication status
    course.isPublished = isPublished;
    await course.save();

    return isPublished ? 'Published' : 'Unpublished';
  }

  async togglePrivateStatus(
    courseId: string,
    isPrivate: boolean,
  ): Promise<string> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found!');
    }

    // Update the publication status
    course.isPrivate = isPrivate;
    await course.save();

    return isPrivate ? 'Private' : 'Public';
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find()
      .populate('creator enrolledStudents lectures')
      .exec();
  }

  async deleteCourse(courseId: string): Promise<{ message: string }> {
    try {
      // Check if the course exists
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }

      // Delete all associated lectures
      await this.lectureModel.deleteMany({ courseId });

      // Delete the course itself
      await this.courseModel.findByIdAndDelete(courseId);

      return {
        message: 'Course and all associated data deleted successfully.',
      };
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new InternalServerErrorException('Failed to delete course.');
    }
  }
}

// Add methods for updating, deleting, or finding a single course
