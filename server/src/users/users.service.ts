import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import * as jwt from 'jsonwebtoken';

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
    const payload = { id: user._id, email: user.email };
    return jwt.sign(payload, 'secretKey', { expiresIn: '1h' });
  }
}
