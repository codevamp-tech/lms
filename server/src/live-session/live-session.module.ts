import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveSessionController } from './live-session.controller';
import { LiveSessionService } from './live-session.service';
import { UsersModule } from '../users/users.module';
import { LiveSession, LiveSessionSchema } from './schemas/live-session.schema';
import { LiveSessionCron } from './live-session.cron';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { NotificationsModule } from 'src/notification/notifications.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: LiveSession.name, schema: LiveSessionSchema }]),
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [LiveSessionController],
  providers: [LiveSessionService, LiveSessionCron],
})
export class LiveSessionModule { }
