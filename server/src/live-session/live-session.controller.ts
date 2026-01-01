import { Controller, Post, Body, Get, Query, Res, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LiveSessionService } from './live-session.service';
import { Response } from 'express';
import { CreateLiveSessionDto } from './dto/create-live-session.dto';
import { EditLiveSessionDto } from './dto/edit-live-session.dto';
import { uploadMedia } from '../../utils/cloudinary';

@Controller('live-session')
export class LiveSessionController {
  constructor(private readonly liveSessionService: LiveSessionService) { }

  @Post()
  create(@Body() createLiveSessionDto: CreateLiveSessionDto) {
    return this.liveSessionService.create(createLiveSessionDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file provided' };
    }
    const result: any = await uploadMedia(file.buffer, { folder: 'live_sessions' });
    return { url: result.secure_url, public_id: result.public_id };
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

      @Get(':sessionId/enrolled-students')
    async getEnrolledStudents(
        @Param('sessionId') sessionId: string
    ) {
        return this.liveSessionService.getEnrolledStudentsBySession(sessionId);
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

  @Post('test-email')
  async sendTestEmail(@Body('to') to: string) {
    const session = {
      _id: '692edac1e1c3865af5285d5f',
      title: 'BEST SPOKEN ENGLISH COURSE',
      link: 'https://meet.google.com/pbu-gamt-wvk',
      date: new Date('2026-01-05T08:30:00.000Z'),
      enrolledUsers: [
        {
          _id: '6937d037e05126e317bc2356',
          name: 'Rahul Sharma',
          email: 'rahul@test.com',
        },
        {
          _id: '694a8e85405b1b8ce298f907',
          name: 'Anjali Verma',
          email: 'anjali@test.com',
        },
      ],
    };
    console.log(`📌 Sending test reminder for session: ${session._id}`);
    return this.liveSessionService.sendReminderEmails(session);
  }
}
