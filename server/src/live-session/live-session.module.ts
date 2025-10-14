import { Module } from '@nestjs/common';
import { LiveSessionController } from './live-session.controller';
import { LiveSessionService } from './live-session.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [LiveSessionController],
  providers: [LiveSessionService],
})
export class LiveSessionModule {}
