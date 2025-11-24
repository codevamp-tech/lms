import { Controller, Post, Body, Get, Query, Res, Param, Put, Delete } from '@nestjs/common';
import { LiveSessionService } from './live-session.service';
import { Response } from 'express';
import { CreateLiveSessionDto } from './dto/create-live-session.dto';
import { EditLiveSessionDto } from './dto/edit-live-session.dto';

@Controller('live-session')
export class LiveSessionController {
  constructor(private readonly liveSessionService: LiveSessionService) { }

  @Post()
  create(@Body() createLiveSessionDto: CreateLiveSessionDto) {
    return this.liveSessionService.create(createLiveSessionDto);
  }

  @Get()
  findAll() {
    return this.liveSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveSessionService.findOne(id);
  }
   @Get('enrolled/:userId')
  getEnrolledSessions(@Param('userId') userId: string) {
    return this.liveSessionService.getEnrolledSessions(userId);
  }

  

  @Put(':id')
  update(@Param('id') id: string, @Body() editLiveSessionDto: EditLiveSessionDto) {
    return this.liveSessionService.update(id, editLiveSessionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.liveSessionService.delete(id);
  }

  @Post(':sessionId/enroll')
  enroll(@Param('sessionId') sessionId: string, @Body('studentId') studentId: string) {
    return this.liveSessionService.enroll(sessionId, studentId);
  }


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
