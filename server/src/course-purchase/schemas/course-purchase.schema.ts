import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Import Document to extend it
import * as mongoose from 'mongoose'; // Explicitly import mongoose

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class CoursePurchase extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  })
  status: string;

  @Prop()
  paymentId: string;
}

// Create the schema from the class
export const CoursePurchaseSchema = SchemaFactory.createForClass(CoursePurchase);
