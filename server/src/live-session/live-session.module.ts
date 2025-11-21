import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveSessionController } from './live-session.controller';
import { LiveSessionService } from './live-session.service';
import { UsersModule } from '../users/users.module';
import { LiveSession, LiveSessionSchema } from './schemas/live-session.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: LiveSession.name, schema: LiveSessionSchema }]),
  ],
  controllers: [LiveSessionController],
  providers: [LiveSessionService],
})
export class LiveSessionModule {}
