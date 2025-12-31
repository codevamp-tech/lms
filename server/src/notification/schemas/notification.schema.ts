import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  SYSTEM = "SYSTEM",
  COURSE = "COURSE",
  CHAT = "CHAT",
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

     @Prop()
  name?: string;

  @Prop({ required: true })
  body: string;

  @Prop({
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  sentAt: Date;
}

export const NotificationSchema =
  SchemaFactory.createForClass(Notification);
