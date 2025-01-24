import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { deleteMediaFromCloudinary, uploadMedia } from 'utils/cloudinary';
import * as nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { CreateInstructorDto } from './dto/create-user';
// import { uploadMedia, deleteMediaFromCloudinary } from './media.service';

@Injectable()
export class UsersService {
  instructorModel: any;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohsinansari4843@gmail.com',
      pass: 'zgyc pkar kyjc vfmm',
    },
  });

  async signup(data: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      ...data,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateToken(user: User) {
    const payload = { id: user._id, email: user.email, role: user.role };
    return jwt.sign(payload, 'secretKey', { expiresIn: '7d' });
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password')
        .populate('enrolledCourses');

      if (!user) {
        throw new Error('Profile not found');
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to load user profile');
    }
  }

  async addInstructor(createInstructorDto: CreateInstructorDto) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(createInstructorDto.password, 10);

    // Create new instructor
    const newInstructor = new this.userModel({
      ...createInstructorDto,
      password: hashedPassword,
    });

    // Save the instructor to the database
    const savedInstructor = await newInstructor.save();

    // Send welcome email to the instructor
    await this.sendWelcomeEmail(
      createInstructorDto.email,
      savedInstructor.name,
      createInstructorDto.password,
      savedInstructor._id as string,
    );

    return savedInstructor;
  }

  async getInstructors() {
    try {
      const instructors = await this.userModel
        .find({ role: 'instructor' })
        .select('-password');

      if (!instructors.length) {
        throw new Error('No instructors found');
      }

      return {
        success: true,
        instructors,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to load instructors');
    }
  }

  async updateProfile(
    userId: string,
    name: string,
    profilePhoto?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let updatedData: { name: string; photoUrl?: string } = { name };

      // If a new profile photo is provided
      if (profilePhoto) {
        // Delete old photo if it exists
        if (user.photoUrl) {
          const publicId = user.photoUrl.split('/').pop()?.split('.')[0]; // Extract public ID
          if (publicId) {
            await deleteMediaFromCloudinary(publicId);
          }
        }

        // Upload new photo
        const cloudResponse = await uploadMedia(profilePhoto?.buffer);
        updatedData.photoUrl = cloudResponse.secure_url; // Update with new photo URL
      }

      // Update user in the database
      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, updatedData, { new: true })
        .select('-password');

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully.',
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update profile');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };
      // Find user by ID from the decoded token
      const user = await this.userModel.findById(decoded.id);

      if (!user) {
        throw new HttpException(
          'Invalid or expired token.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Save the updated password
      await user.save();

      return true; // Return success
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new HttpException(
        'Invalid or expired token.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendWelcomeEmail(
    email: string,
    name: string,
    password: string,
    userId: string,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: 'mohsinansari4843@gmail.com',
      to: `${email}`,
      subject: 'Welcome to Our Platform and Reset Your Password',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007BFF; text-align: center;">Welcome, ${name}</h2>
          <p>Dear ${name},</p>
          <p>We are excited to inform you that you have been successfully added as an instructor to our platform.</p>
          <p><strong>Your Temporary Password:</strong></p>
          <div style="background-color: #f8f9fa; padding: 10px; border: 1px solid #ccc; border-radius: 5px; text-align: center; font-size: 16px;">
            <strong>${password}</strong>
          </div>
          <p>For security reasons, we recommend resetting your password as soon as possible.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${resetLink}" 
               style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">
               Reset Password
            </a>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p style="margin-top: 20px;">This link will expire in 1 hour.</p>
          <p>Best Regards,</p>
          <p>The LMS Team</p>
        </div>
      </div>
    `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome and reset email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send welcome email to ${email}`, error);
      throw new Error('Could not send welcome email');
    }
  }

  async forgotPassword(email: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: 'mohsinansari4843@gmail.com',
      to: email,
      subject: 'Reset Password Request',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007BFF; text-align: center;">Reset Your Password</h2>
            <p>Dear User,</p>
            <p>You requested to reset your password. Please click the button below to proceed:</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${resetLink}" 
                 style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">
                 Reset Password
              </a>
            </div>
            <p style="margin-top: 20px;">This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
            <p>Best Regards,</p>
            <p>The LMS Team</p>
          </div>
        </div>
      `,
    };

    try {
      // Send email
      await this.transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to ${email}`);
      return {
        success: true,
        message: 'Reset password email sent successfully.',
      };
    } catch (error) {
      console.error(`Failed to send reset password email to ${email}`, error);
      throw new Error('Could not send reset password email');
    }
  }
}
