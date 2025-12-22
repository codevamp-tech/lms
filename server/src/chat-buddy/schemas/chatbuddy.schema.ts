import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatBuddy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({
    enum: ['online', 'offline', 'busy'],
    default: 'offline',
  })
  status: string;
}

export const ChatBuddySchema = SchemaFactory.createForClass(ChatBuddy);
