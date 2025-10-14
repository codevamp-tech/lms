import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { LiveSessionService } from './live-session.service';
import { Response } from 'express';

@Controller('live-session')
export class LiveSessionController {
  constructor(private readonly liveSessionService: LiveSessionService) { }


  @Get('auth-url')
  getAuthUrl() {
    return this.liveSessionService.getAuthUrl();
  }

  // Step 2: Handle the OAuth callback
  @Get('oauth/callback')
  async handleOAuthCallback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.liveSessionService.handleOAuthCallback(code);
    res.send(`
      <h1>Authentication Successful!</h1>
      <h2>Copy this Refresh Token to your .env file:</h2>
      <pre style="background: #f4f4f4; padding: 20px; border-radius: 5px;">
GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
      </pre>
      <p><strong>Important:</strong> Add this to your .env file and restart your server!</p>
    `);
  }

  @Post('start')
  async startLiveSession(@Body('companyId') companyId: string) {
    const result = await this.liveSessionService.startSession(companyId);
    return result;
  }
}
