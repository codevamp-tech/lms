import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'; // Explicitly import mongoose

// Subschema for Lecture Progress
@Schema()
export class LectureProgress {
  @Prop({ required: true })
  lectureId: string;

  @Prop({ required: true })
  viewed: boolean;
}

// Main schema for Course Progress
@Schema({ timestamps: true }) // Adds createdAt and updatedAt automatically
export class CourseProgress extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  completed: boolean;

  @Prop({ type: [LectureProgress], default: [] })
  lectureProgress: LectureProgress[];
}

// Create the schema from the class
export const CourseProgressSchema =
  SchemaFactory.createForClass(CourseProgress);
export const LectureProgressSchema =
  SchemaFactory.createForClass(LectureProgress);
