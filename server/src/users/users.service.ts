import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { deleteMediaFromCloudinary, uploadMedia } from 'utils/cloudinary';
// import { uploadMedia, deleteMediaFromCloudinary } from './media.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    if (!user) throw new Error('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');
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
}
