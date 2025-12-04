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

  @Cron('* * * * *')
  async sendLiveSessionReminders() {
    const now = new Date();
    const thirtyMinFromNow = new Date(now.getTime() + 30 * 60000);

    console.log("⏱ Cron running: checking for sessions starting at", thirtyMinFromNow);

    const upcomingSessions = await this.liveSessionService.getSessionsStartingAt(thirtyMinFromNow);

    console.log("Found Sessions:", upcomingSessions.map(s => ({
      id: s._id,
      date: s.date,
      isReminderSent: s.isReminderSent,
      status: s.status,
      users: s.enrolledUsers.length
    })));

    console.log(`🔎 Found ${upcomingSessions.length} sessions for reminders`);

    for (const session of upcomingSessions) {
      console.log(`📌 Sending reminder for session: ${session._id}`);
      await this.liveSessionService.sendReminderEmails(session);
    }
  }


}
