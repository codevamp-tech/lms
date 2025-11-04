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
  BadRequestException,
  Headers,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { AuthGuard } from '../auth/auth.guard';
// import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor';
import { ResetPasswordDto } from './dto/reset-password';
import { ForgotPasswordDto } from './dto/forgot-password';
import { CreateAdminDto } from './dto/create-admin';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() body: { name: string; email: string; password: string },
  ) {
    try {
      return await this.usersService.signup(body);
    } catch (error) {
      // Check if the error is related to an existing email
      if (error.message === 'Email is already registered') {
        throw new HttpException(
          'Email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
      // If it's a different error, send a generic internal server error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('addinstructor')
  async addInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.usersService.addInstructor(createInstructorDto);
  }

  @Post('addAdmin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
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
          companyId: user.companyId,
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
  async getInstructors(
    @Headers('Authorization') Auth: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 7,
  ) {
    const companyId = Auth.split(' ')[1];
    console.log(Auth, 'auth header controller');
    return this.usersService.getInstructors(
      companyId,
      //  '68e36d0271cf3cfa6140be6b',
      Number(page),
      Number(limit),
    );
  }

  @Delete('/admin/:id')
  async removeAdmin(@Param('id') Id: string) {
    return this.usersService.deleteAdmin(Id);
  }

  @Get('admins')
  async getAdmins(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 7,
  ) {
    try {
      return await this.usersService.getAdmins(Number(page), Number(limit));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('toggle-status/:id')
  async toggleInstructorStatus(
    @Param('id') id: string,
    @Query('status') status: string,
  ) {
    if (status !== 'true' && status !== 'false') {
      throw new BadRequestException('Invalid status value');
    }

    const isStatus = status === 'true'; // Convert string to boolean

    const statusMessage = await this.usersService.toggleInstructorStatus(
      id,
      isStatus,
    );

    return {
      message: `Instructor is ${statusMessage.message}`,
    };
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
