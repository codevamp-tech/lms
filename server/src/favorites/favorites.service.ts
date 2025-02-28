// favorites.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './schemas/favorites.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  async addFavorite(userId: string, courseId: string) {
    try {
      const favorite = new this.favoriteModel({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
      });

      return await favorite.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Course is already in favorites');
      }
      throw error;
    }
  }

  async removeFavorite(userId: string, courseId: string) {
    const query: any = { userId, courseId };

    // Convert only if they are ObjectId in the database
    if (Types.ObjectId.isValid(userId)) {
      query.userId = new Types.ObjectId(userId);
    }
    if (Types.ObjectId.isValid(courseId)) {
      query.courseId = new Types.ObjectId(courseId);
    }

    const result = await this.favoriteModel.deleteOne(query);

    if (result.deletedCount === 0) {
      throw new NotFoundException('Favorite not found');
    }

    return { success: true };
  }

  async getUserFavorites(userId: string) {
    return this.favoriteModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('courseId')
      .exec();
  }

  async checkFavorite(userId: string, courseId: string) {
    const favorite = await this.favoriteModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    return { isFavorite: !!favorite };
  }
}
