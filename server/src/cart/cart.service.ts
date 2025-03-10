import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addToCart(userId: string, courseId: string) {
    try {
      const cartItem = new this.cartModel({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
      });
      return await cartItem.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Course is already in cart');
      }
      throw error;
    }
  }

  async removeFromCart(userId: string, courseId: string) {
    const result = await this.cartModel.deleteOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Cart item not found');
    }

    return { success: true };
  }

  async getUserCart(userId: string) {
    return this.cartModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('courseId')
      .exec();
  }

  async checkCart(userId: string, courseId: string) {
    const cart = await this.cartModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    return { isCart: !!cart };
  }
}
