import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; 
import { Document } from 'mongoose'; // Import Document to extend it
import * as mongoose from 'mongoose'; // Explicitly import mongoose

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
}

// Create the schema from the class
export const LectureSchema = SchemaFactory.createForClass(Lecture);
