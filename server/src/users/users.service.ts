import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { deleteMediaFromCloudinary, uploadMedia } from 'utils/cloudinary';
import * as nodemailer from 'nodemailer';
import { CreateInstructorDto } from './dto/create-instructor';
import { CreateAdminDto } from './dto/create-admin';
import { sendMail } from '../../utils/mail';

// import { uploadMedia, deleteMediaFromCloudinary } from './media.service';

@Injectable()
export class UsersService {
  instructorModel: any;
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async signup(data: {
    name: string; email: string; password: string; number?: string; role?: string
  }) {
    // 1. Check if user already exists
    const existingUser = await this.userModel.findOne({ email: data.email }).exec();
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    // 1.1 Check if phone number is provided and unique
    if (!data.number) {
      throw new Error('Phone number is required');
    }

    const existingPhone = await this.userModel.findOne({ number: data.number }).exec();
    if (existingPhone) {
      throw new Error('Phone number is already registered');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Create new user explicitly including all fields
    const newUser = new this.userModel({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      number: data.number, // ✅ make sure number is included
      role: data.role || 'student',
    });

    // 4. Send welcome email
    const mailOptions = {
      to: data.email,
      name: data.name,
      subject: 'Welcome to Mr English Training Academy',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007BFF; text-align: center;">Welcome, ${data.name}</h2>
          <p>Dear ${data.name},</p>
          <p>You have successfully signed up to our platform.</p>
          <p>Email: ${data.email}</p>
          <p>Password: ${data.password}</p>
          <p>Mobile: ${data.number || 'N/A'}</p>
          <p>Best Regards,</p>
          <p>Mr English Training Academy</p>
        </div>
      </div>
    `,
    };

    try {
      await sendMail(mailOptions);
      console.log(`Welcome email sent to ${data.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${data.email}`, error);
      // Do not block signup if email fails
    }

    // 5. Save user in DB
    return newUser.save();
  }

  // users.service.ts
  async registerWithPhone(phone: string, name?: string) {
    // Normalize phone number (same as findOrCreateByPhone)
    const normalizedPhone = phone.replace(/[\s+\-]/g, '');
    const phoneWithoutCountry = normalizedPhone.startsWith('91')
      ? normalizedPhone.slice(2)
      : normalizedPhone;

    // Check if user exists with various phone formats
    let user = await this.userModel.findOne({
      $or: [
        { number: phone },
        { number: normalizedPhone },
        { number: phoneWithoutCountry },
        { number: `91${phoneWithoutCountry}` },
        { number: `+91${phoneWithoutCountry}` },
      ]
    });

    // If not exists → create user
    if (!user) {
      user = new this.userModel({
        name: name || `User ${phoneWithoutCountry.slice(-4)}`,
        number: phoneWithoutCountry, // Store normalized format
        role: 'student',
      });

      await user.save();
    }

    // Generate token for auto-login
    const token = await this.generateToken(user);

    return {
      success: true,
      message: 'User authenticated successfully',
      userId: user._id,
      token, // Include token for auto-login
      user: {
        _id: user._id,
        name: user.name,
        phone: user.number,
        role: user.role,
      },
    };
  }

  /**
   * Find or create a user by phone number (for OTP flow)
   */
  async findOrCreateByPhone(phone: string, name?: string) {
    // Normalize phone number
    const normalizedPhone = phone.replace(/[\s+\-]/g, '');
    const phoneWithoutCountry = normalizedPhone.startsWith('91')
      ? normalizedPhone.slice(2)
      : normalizedPhone;

    // Check if user exists with this phone
    let user = await this.userModel.findOne({
      $or: [
        { number: phone },
        { number: normalizedPhone },
        { number: phoneWithoutCountry },
        { number: `91${phoneWithoutCountry}` },
        { number: `+91${phoneWithoutCountry}` },
      ]
    });

    // If not exists, create new user
    if (!user) {
      user = new this.userModel({
        name: name || `User ${phoneWithoutCountry.slice(-4)}`,
        number: phoneWithoutCountry,
        role: 'student',
        isPhoneVerified: false,
      });
      await user.save();
    }

    return user;
  }

  /**
   * Login user with phone (after OTP verification)
   */
  async loginWithPhone(phone: string) {
    // Normalize phone number
    const normalizedPhone = phone.replace(/[\s+\-]/g, '');
    const phoneWithoutCountry = normalizedPhone.startsWith('91')
      ? normalizedPhone.slice(2)
      : normalizedPhone;

    // Find user by phone
    const user = await this.userModel.findOne({
      $or: [
        { number: phone },
        { number: normalizedPhone },
        { number: phoneWithoutCountry },
        { number: `91${phoneWithoutCountry}` },
        { number: `+91${phoneWithoutCountry}` },
      ]
    });

    if (!user) {
      throw new NotFoundException('User not found with this phone number');
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    await user.save();

    // Generate token
    const token = await this.generateToken(user);

    return {
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.number,
        role: user.role,
        companyId: user.companyId,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    console.log("login user lookup:", user);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    bcrypt.compare("test@123#", "$2a$10$IYVst4upWOhH2HhYbM4y7.BVnLQhUGXpSuu1BpuOqlHGGgb9/wBUq")
      .then(res => console.log("test bcrypt compare result:", res));
    console.log("ispassword", isPasswordValid, password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
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
        .populate({
          path: 'enrolledCourses',
          populate: {
            path: 'creator',
          },
        });

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

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.userModel.findOne({
      email: createAdminDto.email,
    });

    if (existingAdmin) {
      throw new HttpException(
        'Email is already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const newAdmin = new this.userModel({
      ...createAdminDto,
      password: hashedPassword,
    });

    if (createAdminDto.companyId) {
      newAdmin.companyId = new Types.ObjectId(createAdminDto.companyId);
    }

    const savedAdmin = await newAdmin.save();

    // Send welcome email to the instructor
    await this.sendAdminEmail(
      createAdminDto.email,
      savedAdmin.name,
      createAdminDto.password,
      createAdminDto.companyId,
      savedAdmin._id as string,
    );

    return newAdmin.save();
  }

  async getAdmins(page = 1, limit = 7) {
    try {
      const skip = (page - 1) * limit;
      const admins = await this.userModel
        .find({ role: 'admin' })
        .select('-password')
        .populate('companyId')
        .skip(skip)
        .limit(limit);

      const totalAdmins = await this.userModel.countDocuments({
        role: 'admin',
      });

      return {
        success: true,
        admins,
        totalPages: Math.ceil(totalAdmins / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to load admins');
    }
  }

  async addInstructor(createInstructorDto: CreateInstructorDto) {
    try {
      const existingInstructor = await this.userModel.findOne({
        email: createInstructorDto.email,
      });

      if (existingInstructor) {
        throw new Error('Email already in use');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(
        createInstructorDto.password,
        10,
      );

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
    } catch (error) {
      console.error('Error in addInstructor:', error); // Log the error
      throw new Error('Internal server error');
    }
  }

  async getInstructors(companyId: string, page: number = 1, limit: number = 7) {
    try {
      if (!companyId) throw new Error("companyId is required");

      // prepare skip/limit
      const skip = Math.max(0, (page - 1) * limit);

      // Build a filter that matches both ObjectId and string forms
      const filters: any[] = [
        { role: "instructor" }
      ];

      // If field name might differ, add alternative paths (uncomment if needed)
      // const companyField = "companyId";
      const companyField = "companyId"; // adjust if your schema uses different name

      // Try to include ObjectId match if valid
      const orClauses: any[] = [];
      if (Types.ObjectId.isValid(companyId)) {
        orClauses.push({ [companyField]: new Types.ObjectId(companyId) });
      }

      // Also match raw string (in case stored as string)
      orClauses.push({ [companyField]: companyId });

      // Final filter: role + (companyId matches either)
      const filter = {
        ...filters.reduce((acc, f) => ({ ...acc, ...f }), {}),
        $or: orClauses,
      };

      console.log("getInstructors filter:", JSON.stringify(filter), "page:", page, "limit:", limit);

      // Fetch (with deterministic ordering)
      const instructors = await this.userModel
        .find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalInstructors = await this.userModel.countDocuments(filter);

      console.log({
        returnedCount: instructors.length,
        totalInstructors,
        page,
        limit,
        skip,
      });

      return {
        success: true,
        instructors,
        totalPages: Math.ceil(totalInstructors / limit) || 1,
        currentPage: page,
        totalInstructors,
      };
    } catch (error) {
      console.error("getInstructors error:", error);
      throw new Error("Failed to load instructors");
    }
  }
  async toggleInstructorStatus(
    id: string,
    isStatus: boolean,
  ): Promise<{ status: boolean; message: string }> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isStatus: isStatus }, { new: true })
      .exec();

    if (!user) throw new NotFoundException('User not found');

    return {
      status: user.isStatus,
      message: user.isStatus ? 'Active' : 'Inactive',
    };
  }

  async updateProfile(
    userId: string,
    name: string,
    email: string,
    profilePhoto?: Express.Multer.File,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ✅ Email uniqueness check
    if (email && email !== user.email) {
      const emailExists = await this.userModel.findOne({ email });
      if (emailExists) {
        throw new BadRequestException('Email already registered');
      }
    }

    let updatedData: {
      name: string;
      email: string;
      photoUrl?: string;
    } = { name, email };

    if (profilePhoto) {
      if (user.photoUrl) {
        const publicId = user.photoUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await deleteMediaFromCloudinary(publicId);
        }
      }

      const cloudResponse = await uploadMedia(profilePhoto.buffer);
      updatedData.photoUrl = cloudResponse.secure_url;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updatedData, { new: true })
      .select('-password');

    return {
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully.',
    };
  }

  async deleteAdmin(Id: string) {
    try {
      const admin = await this.userModel.findById(Id);
      if (!admin || admin.role !== 'admin') {
        throw new NotFoundException('Admin not found');
      }

      await this.userModel.findByIdAndDelete(Id);
      return { success: true, message: 'Admin deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete admin');
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

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new HttpException(
          'Current password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error in changePassword:', error);
      throw new HttpException('Failed to change password', HttpStatus.INTERNAL_SERVER_ERROR);
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
    const resetLink = `${process.env.SITE_URL}/reset-password?token=${token}`;
    const mailOptions = {
      to: `${email}`,
      name: name,
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
          <p>Mr English Academy</p>
        </div>
      </div>
    `,
    };
    try {
      await sendMail(mailOptions);
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

    const resetLink = `${process.env.SITE_URL}/reset-password?token=${token}`;
    const mailOptions = {
      to: email,
      name: user.name,
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
            <p>Mr English Academy</p>
          </div>
        </div>
      `,
    };

    try {
      // Send email
      await sendMail(mailOptions);
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

  private async sendAdminEmail(
    email: string,
    name: string,
    password: string,
    userId: string,
    companyname: string,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const resetLink = `${process.env.SITE_URL}/reset-password?token=${token}`;
    const mailOptions = {
      to: `${email}`,
      name: name,
      subject: 'Welcome to Our Platform and Reset Your Password',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007BFF; text-align: center;">Welcome, ${name}</h2>
          <p>Dear ${name},</p>
          <p>We are excited to inform you that you have been successfully added as an Admin to our platform.</p>
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
          <p>Mr English Academy</p>
        </div>
      </div>
    `,
    };
    try {
      await sendMail(mailOptions);
      console.log(`Welcome and reset email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send welcome email to ${email}`, error);
      throw new Error('Could not send welcome email');
    }
  }

  async getUsersByCompany(companyId: string): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // ================= STUDENTS =================

  async getStudents(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const students = await this.userModel
      .find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .lean();

    const totalStudents = await this.userModel.countDocuments({
      role: 'student',
    });

    return {
      success: true,
      students,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit) || 1,
      currentPage: page,
    };
  }

  async getStudentById(id: string) {
    const student = await this.userModel
      .findOne({ _id: id, role: 'student' })
      .select('-password');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      success: true,
      student,
    };
  }

  async updateStudent(id: string, updateStudentDto: any) {
    const student = await this.userModel.findOneAndUpdate(
      { _id: id, role: 'student' },
      updateStudentDto,
      { new: true },
    ).select('-password');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      success: true,
      message: 'Student updated successfully',
      student,
    };
  }

}
