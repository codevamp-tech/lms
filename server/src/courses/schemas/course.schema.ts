import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema'; // Adjust the path if necessary
import { Lecture } from '../../lectures/schemas/lecture.schema'; // Adjust the path if necessary

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  courseTitle: string;

  @Prop()
  subTitle: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    type: String,
    enum: ['Beginner', 'Medium', 'Advance'],
  })
  courseLevel: string;

  @Prop()
  coursePrice: number;

  @Prop({
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive',
  })
  courseStatus: String;

  @Prop()
  courseThumbnail: string;

  @Prop()
  companyId: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  enrolledStudents: User[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }])
  lectures: Lecture[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isPrivate: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
