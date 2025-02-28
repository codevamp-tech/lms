import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schemas/cart.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { CartController } from './cart.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Course.name, schema: CourseSchema }, // Ensure Course model is imported
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
