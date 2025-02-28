import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ConfigurationDocument = Configuration & Document;
@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt fields
})
export class Configuration {
  @Prop({ required: true })
  name: string;

  @Prop()
  image?: string; // URL of the uploaded image

  @Prop()
  website?: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  alternateNumber?: string;

  @Prop({ required: true })
  billingAddress: string;

  @Prop({ required: true })
  company_id: string;
}
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
