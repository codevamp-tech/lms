import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveSessionController } from './live-session.controller';
import { LiveSessionService } from './live-session.service';
import { UsersModule } from '../users/users.module';
import { LiveSession, LiveSessionSchema } from './schemas/live-session.schema';
import { LiveSessionCron } from './live-session.cron';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: LiveSession.name, schema: LiveSessionSchema }]),

  ],
  controllers: [LiveSessionController],
  providers: [LiveSessionService, LiveSessionCron],
})
export class LiveSessionModule { }
