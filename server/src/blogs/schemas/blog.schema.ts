import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ unique: true, required: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  category: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
