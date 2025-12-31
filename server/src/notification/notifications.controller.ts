import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";


@Controller("notifications")

export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getMyNotifications(@Req() req : any) {
    return this.notificationsService.getUserNotifications(
      req.user.userId,
    );
  }

  @Patch(":id/read")
  markAsRead(@Param("id") id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch("read-all")
  markAllAsRead(@Req() req : any) {
    return this.notificationsService.markAllAsRead(
      req.user.userId,
    );
  }
}
