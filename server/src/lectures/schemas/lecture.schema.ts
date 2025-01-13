import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Document to extend it

@Schema({ timestamps: true }) // This will automatically add createdAt and updatedAt fields
export class Lecture extends Document {
  @Prop({ required: true })
  lectureTitle: string;

  @Prop()
  videoUrl: string;

  @Prop()
  publicId: string;

  @Prop()
  isPreviewFree: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true }) // Reference to the Course schema
  courseId: Types.ObjectId;
}

// Create the schema from the class
export const LectureSchema = SchemaFactory.createForClass(Lecture);
