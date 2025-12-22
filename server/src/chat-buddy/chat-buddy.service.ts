import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatBuddy } from './schemas/chatbuddy.schema';
import { CreateChatBuddyDto } from './dto/create-chat-buudy';
import { uploadChatbuddyImageToCloudinary } from 'utils/cloudinary';
import { UpdateChatBuddyDto } from './dto/update-chat-buddy.dto';

@Injectable()
export class ChatBuddyService {
  constructor(
    @InjectModel(ChatBuddy.name)
    private readonly chatBuddyModel: Model<ChatBuddy>,
  ) { }

  async create(dto: CreateChatBuddyDto, file?: Express.Multer.File) {
    let photo = '';

    if (file) {
      const uploaded: any = await uploadChatbuddyImageToCloudinary(file);
      photo = uploaded.secure_url;
    }

    const buddy = new this.chatBuddyModel({
      ...dto,
      photo,
    });

    return buddy.save();
  }

  async findAll() {
    return this.chatBuddyModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const buddy = await this.chatBuddyModel.findById(id);
    if (!buddy) throw new NotFoundException('Chat Buddy not found');
    return buddy;
  }

  async update(
    id: string,
    dto: UpdateChatBuddyDto,
    file?: Express.Multer.File,
  ) {
    const buddy = await this.chatBuddyModel.findById(id);
    if (!buddy) throw new NotFoundException('Chat Buddy not found');


    if (file) {
      const uploaded: any = await uploadChatbuddyImageToCloudinary(file);
      buddy.photo = uploaded.secure_url;
    }

    Object.assign(buddy, dto);
    return buddy.save();
  }

  async remove(id: string) {
    const buddy = await this.chatBuddyModel.findByIdAndDelete(id);
    if (!buddy) throw new NotFoundException('Chat Buddy not found');
    return { message: 'Chat Buddy deleted successfully' };
  }
}
