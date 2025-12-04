import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class LiveSession extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  instructor: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({ required: true })
  price: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  enrolledUsers: Types.ObjectId[];

  @Prop()
  meetLink: string;

  @Prop()
  companyId: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  link: string;

  @Prop({
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming',
  })
  status: string;

  @Prop({ default: false })
  isReminderSent: boolean;

}

export const LiveSessionSchema = SchemaFactory.createForClass(LiveSession);
