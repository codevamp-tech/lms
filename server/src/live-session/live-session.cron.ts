// live-session.cron.ts
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { LiveSessionService } from './live-session.service';

@Injectable()
export class LiveSessionCron {
  constructor(private readonly liveSessionService: LiveSessionService) { }

  @Cron('* * * * *') // Every minute
  async updateLiveSessionsStatus() {
    const now = new Date();

    // Set session live
    await this.liveSessionService.updateStatusForLive(now);

    // Set session completed
    await this.liveSessionService.updateStatusForCompleted(now);
  }
}
