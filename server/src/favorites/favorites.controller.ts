// favorites.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':courseId/add-favorites')
  async addToFavorites(@Body() body: { userId: string; courseId: string }) {
    const { userId, courseId } = body;
    return this.favoritesService.addFavorite(userId, courseId);
  }

  @Delete(':courseId/remove-favorites')
  async removeFromFavorites(
    @Param('courseId') courseId: string, // Use @Param() for courseId
    @Body() body: { userId: string }, // Keep only userId in @Body()
  ) {
    const { userId } = body;
    return this.favoritesService.removeFavorite(userId, courseId);
  }

  @Get('user/:userId')
  async getUserFavorites(@Param('userId') userId: string) {
    return this.favoritesService.getUserFavorites(userId);
  }

  @Post('check')
  async checkFavorite(@Body() body: { userId: string; courseId: string }) {
    const { userId, courseId } = body;
    return this.favoritesService.checkFavorite(userId, courseId);
  }
}
