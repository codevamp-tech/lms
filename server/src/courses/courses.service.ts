import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';
import { Lecture } from 'src/lectures/schemas/lecture.schema';
import { deleteMediaFromCloudinary, uploadMedia } from 'utils/cloudinary';
import { Enquiry } from 'src/enquiries/schemas/enquiry.schema';
import { LiveSession } from 'src/live-session/schemas/live-session.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
    @InjectModel(Enquiry.name) private enquiryModel: Model<Enquiry>,
    @InjectModel(LiveSession.name) private liveSessionModel: Model<LiveSession>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async createCourse(createCourseDto: CreateCourseDto) {
    try {
      const { courseTitle, creatorId, companyId } = createCourseDto;

      if (!courseTitle) {
        throw new Error('Course title is required.');
      }

      const course = await this.courseModel.create({
        courseTitle,
        creator: creatorId,
        companyId,
      });

      return {
        course,
        message: 'Course created.',
      };
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
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
    return this.courseModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByCreator(userId: any): Promise<Course[]> {
    return this.courseModel
      .find({ creatorId: userId })
      .populate('creator enrolledStudents lectures')
      .sort({ createdAt: -1 })
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

  async getLiveSessionsRevenue() {
    const liveSessions = await this.liveSessionModel.find({}, '_id price enrolledUsers');

    let totalRevenue = 0;
    let totalSales = 0;

    liveSessions.forEach((session) => {
      const enrolledCount = session.enrolledUsers?.length || 0;
      totalSales += enrolledCount; // count number of enrolled users

      const price = Number(session.price) || 0;
      totalRevenue += enrolledCount * price;
    });

    return { totalRevenue, totalSales };
  }

  async getenquiryRevenue() {
    try {
      // Fetch all enquiries
      const enquiries = await this.enquiryModel.find({}, 'amount type');

      let totalRevenue = 0;
      let totalSales = 0;

      enquiries.forEach((enquiry) => {
        // Skip enquiries of type "Contact"
        if (enquiry.type?.toLowerCase() === "contact") return;
        const amount = Number(enquiry.amount) || 0;
        totalRevenue += amount;
        totalSales += 1; // count each enquiry as 1 sale
      });

      return { totalRevenue, totalSales };
    } catch (err) {
      console.error("Error calculating enquiry revenue:", err);
      return { totalRevenue: 0, totalSales: 0 };
    }
  }


  async getCourseAnalytics() {
    try {
      // Fetch all courses with only needed fields
      const courses = await this.courseModel.find({}, 'coursePrice enrolledStudents');

      const totalCourses = courses.length;

      let totalSales = 0;
      let totalCourseRevenue = 0;

      courses.forEach((course) => {
        const enrolledCount = course.enrolledStudents?.length || 0;
        totalSales += enrolledCount;

        const price = Number(course.coursePrice) || 0;
        totalCourseRevenue += price * enrolledCount;
      });

      const { totalRevenue: enquiryRevenue, totalSales: enquirySales } = await this.getenquiryRevenue();
      const { totalRevenue: liveRevenue, totalSales: liveSales } = await this.getLiveSessionsRevenue();

      const totalRevenue = totalCourseRevenue + enquiryRevenue + liveRevenue;
      console.log('totalAllSales', totalSales, enquirySales, liveSales);
      const totalAllSales = totalSales + enquirySales + liveSales;

      return {
        totalCourses,
        totalAllSales,
        totalRevenue,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error generating course analytics');
    }
  }

  async getCourseSales(courseId: string) {
    try {
      // Find the course and populate enrolled students
      const course = await this.courseModel
        .findById(courseId)
        .populate({
          path: 'enrolledStudents',
          select: 'name email photoUrl', // select only the fields you need
        });

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }

      const enrolledUsers = course.enrolledStudents || [];

      return {
        courseId: course._id,
        courseTitle: course.courseTitle,
        totalEnrolled: enrolledUsers.length,
        enrolledUsers, // populated user details
      };
    } catch (error) {
      console.error('Error fetching course sales:', error);
      throw new InternalServerErrorException(
        'Failed to fetch enrolled users for the course',
      );
    }
  }

  async enrollUserInCourse(courseId: string, userId: string) {
    const courseObjectId = new Types.ObjectId(courseId);
    const userObjectId = new Types.ObjectId(userId);

    const course = await this.courseModel.findById(courseObjectId);
    if (!course) throw new NotFoundException('Course not found');

    const user = await this.userModel.findById(userObjectId);
    if (!user) throw new NotFoundException('User not found');

    // Add student to course
    await this.courseModel.findByIdAndUpdate(courseObjectId, {
      $addToSet: { enrolledStudents: userObjectId },
    });

    // Add course to user
    await this.userModel.findByIdAndUpdate(userObjectId, {
      $addToSet: { enrolledCourses: courseObjectId },
    });

    return {
      success: true,
      message: 'User enrolled successfully',
    };
  }
}



// Add methods for updating, deleting, or finding a single course
