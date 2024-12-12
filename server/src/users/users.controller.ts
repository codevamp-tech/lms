import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

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
}
