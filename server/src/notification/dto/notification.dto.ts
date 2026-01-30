
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { NotificationType } from "../schemas/notification.schema";

export class NotificationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  sentAt?: Date;
}
