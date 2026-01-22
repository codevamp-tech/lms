import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatBuddyDocument = ChatBuddy & Document;

@Schema({ timestamps: true })
export class ChatBuddy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ default: '' })
  bio: string;

  // TOTAL SLOTS (5 TICK MARKS)
  @Prop({ default: 5 })
  maxSlots: number;

  // CURRENT BOOKED SLOTS
  @Prop({ default: 0 })
  bookedSlots: number;

  // TRACK WHO BOOKED (OPTIONAL BUT RECOMMENDED)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Enquiry' }] })
  bookings: Types.ObjectId[];

  // AUTO STATUS
  @Prop({
    enum: ['available', 'full'],
    default: 'available',
  })
  status: string;
}

export const ChatBuddySchema = SchemaFactory.createForClass(ChatBuddy);
