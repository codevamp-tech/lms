import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema'; // Import your course schema

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: ['superadmin', 'admin', 'instructor', 'student'],
    default: 'student',
  })
  role: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }])
  enrolledCourses: Course[];

  @Prop({ default: '' })
  photoUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
