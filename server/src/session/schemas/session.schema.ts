import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  whatsappNo: string;

  @Prop()
  message?: string;

  @Prop()
  product?: string;

  @Prop()
  price?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
