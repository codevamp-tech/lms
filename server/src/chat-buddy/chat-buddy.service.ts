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

  async findAll(skip: number = 0, limit: number = 10) {
    const buddies = await this.chatBuddyModel
      .find()
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await this.chatBuddyModel.countDocuments();

    return { buddies, total };
  }

  async removeSlot(buddyId: string, enquiryId?: string) {
    const buddy = await this.chatBuddyModel.findById(buddyId);

    if (!buddy) {
      throw new NotFoundException('Chat Buddy not found');
    }

    // ❌ No slots to remove
    if (buddy.bookedSlots <= 0) {
      return buddy;
    }

    // Remove specific enquiry OR last booking
    if (enquiryId) {
      buddy.bookings = buddy.bookings.filter(
        (id) => id.toString() !== enquiryId,
      );
    } else {
      buddy.bookings.pop();
    }

    buddy.bookedSlots = Math.max(buddy.bookedSlots - 1, 0);

    // Update status
    if (buddy.bookedSlots < 5) {
      buddy.status = 'available';
    }

    return buddy.save();
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
