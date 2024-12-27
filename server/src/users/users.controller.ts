import { Body, Controller, Post, Get, Put, UseGuards, UploadedFile, Query, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
// import { AuthGuard } from '../auth/auth.guard';
// import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.signup(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.login(body.email, body.password);
    const token = await this.usersService.generateToken(user);
    return { user, token };
  }

  // @UseGuards(AuthGuard)
  @Get(':userId/profile')
  async getUserProfile(@Param('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  // @UseGuards(AuthGuard)
  @Patch(':userId/update')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateProfile(
    @Param('userId') userId: string,
    @Body('name') name: string,
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(userId, name, profilePhoto);
  }
}
