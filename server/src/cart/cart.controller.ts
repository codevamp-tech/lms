import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':courseId/add-to-cart')
  async addToCart(
    @Param('courseId') courseId: string,
    @Body() body: { userId: string },
  ) {
    return this.cartService.addToCart(body.userId, courseId);
  }

  @Delete(':courseId/remove-from-cart')
  async removeFromCart(
    @Param('courseId') courseId: string,
    @Body() body: { userId: string },
  ) {
    return this.cartService.removeFromCart(body.userId, courseId);
  }

  @Get(':userId/getUserCart')
  async getUserCart(@Param('userId') userId: string) {
    return this.cartService.getUserCart(userId);
  }

  @Post(':userId/check')
  async checkCart(@Body() body: { userId: string; courseId: string }) {
    const { userId, courseId } = body;
    return this.cartService.checkCart(userId, courseId);
  }
}
