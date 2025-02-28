// rating.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ required: true })
  courseId: string; // ID of the course being rated

  @Prop({ required: true })
  userId: string; // ID of the user who submitted the rating

  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // A rating between 1 and 5

  @Prop()
  comment?: string; // Optional comment
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
