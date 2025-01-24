import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  UploadedFile,
  Query,
  Param,
  Patch,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { AuthGuard } from '../auth/auth.guard';
// import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-user';
import { ResetPasswordDto } from './dto/reset-password';
import { ForgotPasswordDto } from './dto/forgot-password';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.usersService.signup(body);
  }

  @Post('addinstructor')
  async addInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.usersService.addInstructor(createInstructorDto);
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const user = await this.usersService.login(
        loginDto.email,
        loginDto.password,
      );
      const token = await this.usersService.generateToken(user);
      return {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @UseGuards(AuthGuard)
  @Get(':userId/profile')
  async getUserProfile(@Param('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Get('instructors')
  async getInstructors() {
    return this.usersService.getInstructors();
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    return this.usersService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    const { newPassword, confirmPassword } = resetPasswordDto;
    if (newPassword !== confirmPassword) {
      throw new HttpException(
        { message: 'Passwords do not match.' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      await this.usersService.resetPassword(token, newPassword);
      return 'Password reset successful.';
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Password reset failed.' },
        HttpStatus.BAD_REQUEST,
      );
    }
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
