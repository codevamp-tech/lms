import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Certificate extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  certificateId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: false })
  filePath: string;

  @Prop({ type: Date })
  issuedDate: Date;

  @Prop({
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  })
  status: string;

  @Prop({ type: Date })
  expiryDate: Date;

  @Prop({ type: String })
  certificateURL: string;

  @Prop({ type: String })
  description: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

// Add index for faster queries
CertificateSchema.index({ userId: 1, courseId: 1 });
CertificateSchema.index({ certificateId: 1 });
