import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

@Injectable()
export class LiveSessionService {
    private transporter: nodemailer.Transporter;
    private oAuth2Client: any;

    constructor(private readonly usersService: UsersService) {
        console.log('🔧 ========== CONSTRUCTOR START ==========');
        console.log('🔧 Initializing LiveSessionService...');

        // Initialize nodemailer
        console.log('📧 Setting up nodemailer...');
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'mohsinansari4843@gmail.com',
                pass: process.env.EMAIL_PASS || 'zgyc pkar kyjc vfmm',
            },
        });
        console.log('✅ Nodemailer configured with user:', process.env.EMAIL_USER || 'mohsinansari4843@gmail.com');

        // Initialize Google OAuth2 Client
        console.log('🔑 Setting up Google OAuth2 Client...');
        const credentials = {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uris: [process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/live-session/oauth/callback'],
        };

        console.log('📝 OAuth Credentials Check:');
        console.log('  - CLIENT_ID:', credentials.client_id ? credentials.client_id.substring(0, 20) + '...' : 'MISSING');
        console.log('  - CLIENT_SECRET:', credentials.client_secret ? 'EXISTS (hidden)' : 'MISSING');
        console.log('  - REDIRECT_URI:', credentials.redirect_uris[0]);
        console.log('  - REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'EXISTS (hidden)' : '❌ MISSING - THIS IS REQUIRED!');

        this.oAuth2Client = new google.auth.OAuth2(
            credentials.client_id,
            credentials.client_secret,
            credentials.redirect_uris[0]
        );

        // Set credentials if refresh token is available
        if (process.env.GOOGLE_REFRESH_TOKEN) {
            console.log('✅ Setting refresh token...');
            this.oAuth2Client.setCredentials({
                refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            });
        } else {
            console.error('❌❌❌ CRITICAL: GOOGLE_REFRESH_TOKEN is not set!');
            console.error('❌ Google Meet links WILL NOT WORK without this!');
            console.error('📖 Generate auth URL by visiting: /live-session/auth-url');
        }

        console.log('✅ ========== CONSTRUCTOR END ==========\n');
    }

    getAuthUrl(): { authUrl: string } {
        console.log('🔗 Generating OAuth URL...');

        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events'
            ],
            prompt: 'consent', // Forces refresh token to be returned
        });

        console.log('✅ Auth URL generated:', authUrl);
        return { authUrl };
    }

    async handleOAuthCallback(code: string): Promise<any> {
        console.log('🔑 Exchanging code for tokens...');
        console.log('Code received:', code);

        try {
            const { tokens } = await this.oAuth2Client.getToken(code);
            console.log('✅ Tokens received!');
            console.log('📝 Refresh Token:', tokens.refresh_token);
            console.log('📝 Access Token:', tokens.access_token ? 'EXISTS' : 'MISSING');

            if (!tokens.refresh_token) {
                console.error('❌ No refresh token received! Try revoking access and trying again.');
            }

            return tokens;
        } catch (error) {
            console.error('❌ Error exchanging code for tokens:', error);
            throw error;
        }
    }

    async createGoogleMeetLink(): Promise<string> {
        console.log('\n🚀 ========== CREATE GOOGLE MEET LINK START ==========');
        console.log('🚀 Function: createGoogleMeetLink() called');

        try {
            console.log('🔍 Step 1: Checking OAuth2 credentials...', process.env.GOOGLE_REFRESH_TOKEN);

            if (!process.env.GOOGLE_REFRESH_TOKEN) {
                console.error('❌ REFRESH_TOKEN is missing from environment!');
                throw new Error('GOOGLE_REFRESH_TOKEN not configured. Cannot create Meet links.');
            }

            console.log('🔍 Step 2: Getting current credentials from OAuth client...');
            let credentials;
            try {
                credentials = await this.oAuth2Client.credentials;
                console.log('📋 Credentials retrieved:', {
                    hasRefreshToken: !!credentials?.refresh_token,
                    hasAccessToken: !!credentials?.access_token,
                    expiryDate: credentials?.expiry_date,
                });
            } catch (credError) {
                console.error('❌ Error getting credentials:', credError);
                throw credError;
            }

            console.log('📅 Step 3: Initializing Google Calendar API...');
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            console.log('✅ Calendar API initialized');

            const startTime = new Date();
            const endTime = new Date(Date.now() + 60 * 60000);

            console.log('⏰ Step 4: Preparing meeting times:');
            console.log('  - Start:', startTime.toISOString());
            console.log('  - End:', endTime.toISOString());

            const requestId = `meeting-${Date.now()}`;
            console.log('  - Request ID:', requestId);

            const event = {
                summary: 'Live Session - Instant Meeting',
                description: 'Instant live session for students',
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: 'UTC',
                },
                conferenceData: {
                    createRequest: {
                        requestId: requestId,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
            };

            console.log('📤 Step 5: Sending request to Google Calendar API...');
            console.log('📋 Request parameters:');
            console.log('  - calendarId: primary');
            console.log('  - conferenceDataVersion: 1');

            let response;
            try {
                response = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: event,
                    conferenceDataVersion: 1,
                });
                console.log('✅ API call successful!');
            } catch (apiError) {
                console.error('❌ API call failed!');
                console.error('API Error:', apiError);
                throw apiError;
            }

            console.log('📥 Step 6: Processing API response...');
            console.log('📋 Response status:', response.status);
            console.log('📋 Response statusText:', response.statusText);
            console.log('📋 Response data keys:', Object.keys(response.data || {}));

            console.log('🔍 Step 7: Extracting Meet link...');
            console.log('  - hangoutLink:', response.data.hangoutLink || 'NOT FOUND');
            console.log('  - conferenceData exists:', !!response.data.conferenceData);

            if (response.data.conferenceData) {
                console.log('  - conferenceData.entryPoints:', response.data.conferenceData.entryPoints);
            }

            const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri;

            console.log('\n📊 FULL RESPONSE DATA:');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('📊 END RESPONSE DATA\n');

            if (!meetLink) {
                console.error('❌ No Meet link found in response!');
                console.error('❌ This might mean:');
                console.error('   1. Google Meet is not enabled for your account');
                console.error('   2. The calendar API response format changed');
                console.error('   3. Insufficient permissions');
                throw new Error('Failed to generate Google Meet link - no link in response');
            }

            console.log('✅ Google Meet link extracted:', meetLink);
            console.log('🚀 ========== CREATE GOOGLE MEET LINK END (SUCCESS) ==========\n');
            return meetLink;

        } catch (error) {
            console.error('\n❌ ========== CREATE GOOGLE MEET LINK END (ERROR) ==========');
            console.error('❌ ERROR in createGoogleMeetLink():');
            console.error('❌ Error type:', error.constructor.name);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error code:', (error as any).code);
            console.error('❌ Error status:', (error as any).status);
            console.error('❌ Error errors array:', (error as any).errors);
            console.error('❌ Full error object:', JSON.stringify(error, null, 2));
            console.error('❌ Error stack:', error.stack);

            if ((error as any).code === 401 || (error as any).status === 401) {
                console.error('\n🔴 AUTHENTICATION ERROR (401)!');
                console.error('🔴 Your refresh token is invalid, expired, or missing.');
                console.error('🔴 You need to re-authenticate and get a new refresh token.');
            }

            console.error('❌ ========== ERROR END ==========\n');
            throw new Error(`Failed to create Google Meet link: ${error.message}`);
        }
    }

    async sendInvitations(meetLink: string, companyId: string): Promise<void> {
        console.log('\n📨 ========== SEND INVITATIONS START ==========');
        console.log('📨 Starting sendInvitations()...');
        console.log('  - Meet link:', meetLink || '❌ UNDEFINED/NULL');
        console.log('  - Company ID:', companyId);

        if (!meetLink) {
            console.error('❌ Cannot send invitations: meetLink is undefined!');
            console.error('❌ This means createGoogleMeetLink() failed or returned undefined');
        }

        const students = await this.usersService.getUsersByCompany(companyId);
        console.log(`👥 Found ${students.length} total users`);

        const studentUsers = students.filter((student) => student.role === 'student');
        console.log(`🎓 Found ${studentUsers.length} students to invite`);

        if (studentUsers.length === 0) {
            console.warn('⚠️  No students found to send invitations to!');
            return;
        }

        const emailPromises = studentUsers.map(async (student, index) => {
            console.log(`\n📧 [${index + 1}/${studentUsers.length}] Preparing email for:`, student.email);

            const mailOptions = {
                from: process.env.EMAIL_USER || 'mohsinansari4843@gmail.com',
                to: student.email,
                subject: 'Live Session Invitation',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #4285f4; color: white; padding: 20px; text-align: center; }
                            .content { background-color: #f9f9f9; padding: 20px; }
                            .button { 
                                display: inline-block; 
                                padding: 12px 24px; 
                                background-color: #4285f4; 
                                color: white; 
                                text-decoration: none; 
                                border-radius: 4px; 
                                margin: 20px 0;
                            }
                            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Live Session Invitation</h1>
                            </div>
                            <div class="content">
                                <p>Hello ${student.name},</p>
                                <p>You have been invited to join a live session. Click the button below to join the meeting:</p>
                                <div style="text-align: center;">
                                    <a href="${meetLink}" class="button">Join Live Session</a>
                                </div>
                                <p>Or copy and paste this link into your browser:</p>
                                <p><a href="${meetLink}">${meetLink}</a></p>
                                <p>See you there!</p>
                            </div>
                            <div class="footer">
                                <p>This is an automated message. Please do not reply to this email.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            };

            try {
                console.log(`📤 Sending email to ${student.email}...`);
                await this.transporter.sendMail(mailOptions);
                console.log(`✅ Email sent successfully to ${student.email}`);
            } catch (error) {
                console.error(`❌ Failed to send email to ${student.email}:`, error.message);
                console.error('Full error:', error);
            }
        });

        await Promise.all(emailPromises);
        console.log('\n✅ All invitation emails processed');
        console.log('📨 ========== SEND INVITATIONS END ==========\n');
    }

    async startSession(companyId: string): Promise<{ meetLink: string }> {
        console.log('\n🎬 ==========================================');
        console.log('🎬 START SESSION CALLED');
        console.log('🎬 ==========================================');
        console.log('🏢 Company ID:', companyId);
        console.log('🕐 Timestamp:', new Date().toISOString());

        try {
            // Create Google Meet link
            console.log('\n📝 STEP 1 OF 2: Creating Google Meet link...');
            const meetLink = await this.createGoogleMeetLink();
            console.log('✅ STEP 1 COMPLETE - Meet link:', meetLink);

            // Send invitations to all students
            console.log('\n📝 STEP 2 OF 2: Sending invitations...');
            await this.sendInvitations(meetLink, companyId);
            console.log('✅ STEP 2 COMPLETE - Invitations sent');

            console.log('\n🎬 ==========================================');
            console.log('🎬 SESSION STARTED SUCCESSFULLY');
            console.log('🎬 Final Meet Link:', meetLink);
            console.log('🎬 ==========================================\n');

            return { meetLink };
        } catch (error) {
            console.error('\n🔴 ==========================================');
            console.error('🔴 SESSION START FAILED');
            console.error('🔴 ==========================================');
            console.error('🔴 Error type:', error.constructor.name);
            console.error('🔴 Error message:', error.message);
            console.error('🔴 Error stack:', error.stack);
            console.error('🔴 ==========================================\n');
            throw error;
        }
    }
}