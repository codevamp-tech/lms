import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from "./schemas/notification.schema";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  // Create notification
  async createNotification(data: {
    userId?: Types.ObjectId;
    name?: string;
    title: string;
    body: string;
    type?: NotificationType;
    payload?: Record<string, any>;
  }) {
    return this.notificationModel.create({
      userId: data.userId,
        name: data.name,
      title: data.title,
      body: data.body,
      type: data.type,
      data: data.payload,
    });
  }

  // Get user notifications
  async getUserNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 });
  }

  // Mark as read
  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }

  // Mark all as read
  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
  }
}
