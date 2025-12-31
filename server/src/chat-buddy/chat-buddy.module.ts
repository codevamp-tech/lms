import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatBuddyService } from './chat-buddy.service';
import { ChatBuddyController } from './chat-buddy.controller';
import { ChatBuddy, ChatBuddySchema } from './schemas/chatbuddy.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatBuddy.name, schema: ChatBuddySchema },
    ]),
  ],
  controllers: [ChatBuddyController],
  providers: [ChatBuddyService],
})
export class ChatBuddyModule { }
