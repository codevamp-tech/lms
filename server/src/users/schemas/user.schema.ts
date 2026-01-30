import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema'; // Import your course schema
import { Company } from 'src/company/schemas/company.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  email: string;

  @Prop({ default: '' })
  number?: string;

  @Prop({ required: false })
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

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Company', default: null })
  companyId: mongoose.Types.ObjectId | Company;

  @Prop({ default: false })
  isStatus: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
