import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class Fast2SmsService {
    private readonly apiKey: string;
    private readonly logger = new Logger(Fast2SmsService.name);

    // Store OTPs temporarily (in production, use Redis or database)
    private otpStore: Map<string, { otp: string; expiry: Date }> = new Map();

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('FAST2SMS_API_KEY') || '';

        if (!this.apiKey) {
            this.logger.warn('⚠️ FAST2SMS_API_KEY is not configured');
        } else {
            this.logger.log(`✅ Fast2SMS API Key loaded: ${this.apiKey.substring(0, 4)}...`);
        }
    }

    /**
     * Normalize phone number to standard format
     */
    private normalizePhone(phone: string): string {
        // Remove spaces, dashes, and plus signs
        let normalized = phone.replace(/[\s+\-]/g, '');

        // Fast2SMS usually expects just the 10 digit number or standard format.
        // If it starts with 91 and is 12 digits, keep it. 
        // If it is 10 digits, it works fine too usually, but let's keep 91 just in case or follow the previous pattern.
        // Previous pattern added 91. Fast2SMS often works with just 10 digits or 91.
        // Let's stick to the previous normalization logic to be safe, but check if Fast2SMS complains.
        if (!normalized.startsWith('91') && normalized.length === 10) {
            normalized = `91${normalized}`;
        }

        return normalized;
    }

    /**
     * Generate a 6-digit OTP
     */
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Send OTP to a phone number using Fast2SMS
     * @param phone - Phone number with or without country code
     */
    async sendOtp(phone: string): Promise<{ success: boolean; requestId?: string; message: string }> {
        try {
            const normalizedPhone = this.normalizePhone(phone);
            const otp = this.generateOtp();

            // Store OTP with 5-minute expiry
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes() + 5);
            this.otpStore.set(normalizedPhone, { otp, expiry });

            // Send SMS via Fast2SMS API
            // content: "Your OTP for Mr English Training Academy is {otp}. Valid for 5 minutes."
            // Using Quick Transactional route ("q") by default for non-DLT generic messages if possible,
            // or we just send the message.
            const message = `Your OTP for Mr English Training Academy is ${otp}. Valid for 5 minutes.`;

            // Fast2SMS Bulk V2 API
            const response = await axios.post(
                'https://www.fast2sms.com/dev/bulkV2',
                {
                    route: 'q', // Quick transactional route
                    message: message,
                    language: 'english',
                    flash: 0,
                    numbers: normalizedPhone,
                },
                {
                    headers: {
                        authorization: this.apiKey,
                        "Content-Type": "application/json"
                    },
                },
            );

            this.logger.log(`📱 Fast2SMS Send OTP Response: ${JSON.stringify(response.data)}`);

            if (response.data.return === false) {
                throw new Error(response.data.message || 'Fast2SMS returned failure');
            }

            return {
                success: true,
                requestId: response.data.request_id || `otp_${normalizedPhone}_${Date.now()}`,
                message: 'OTP sent successfully',
            };
        } catch (error: any) {
            this.logger.error(`❌ Fast2SMS Send OTP Error: ${error.message}`);
            if (error.response) {
                this.logger.error(`Response Data: ${JSON.stringify(error.response.data)}`);
            }

            throw new HttpException(
                error.message || 'Failed to send OTP',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * Verify OTP
     * @param phone - Phone number with or without country code
     * @param otp - OTP entered by user
     */
    async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
        try {
            const normalizedPhone = this.normalizePhone(phone);
            const storedData = this.otpStore.get(normalizedPhone);

            if (!storedData) {
                throw new HttpException(
                    'OTP expired or not found. Please request a new OTP.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (new Date() > storedData.expiry) {
                this.otpStore.delete(normalizedPhone);
                throw new HttpException(
                    'OTP has expired. Please request a new OTP.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (storedData.otp !== otp) {
                throw new HttpException(
                    'Invalid OTP',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // OTP verified, remove from store
            this.otpStore.delete(normalizedPhone);

            return {
                success: true,
                message: 'OTP verified successfully',
            };
        } catch (error: any) {
            this.logger.error(`❌ Fast2SMS Verify OTP Error: ${error.message}`);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                error.message || 'OTP verification failed',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * Resend OTP
     * @param phone - Phone number with or without country code
     */
    async resendOtp(phone: string): Promise<{ success: boolean; message: string }> {
        // Simply send a new OTP
        const result = await this.sendOtp(phone);
        return {
            success: result.success,
            message: 'OTP resent successfully',
        };
    }

    /**
     * Send a custom SMS message
     * @param phone - Phone number
     * @param message - Message content
     */
    async sendSms(phone: string, message: string): Promise<{ success: boolean; message: string }> {
        try {
            const normalizedPhone = this.normalizePhone(phone);

            const response = await axios.post(
                'https://www.fast2sms.com/dev/bulkV2',
                {
                    route: 'q',
                    message: message,
                    language: 'english',
                    flash: 0,
                    numbers: normalizedPhone,
                },
                {
                    headers: {
                        authorization: this.apiKey,
                        "Content-Type": "application/json"
                    },
                }
            );

            this.logger.log(`📱 Fast2SMS Send SMS Response: ${JSON.stringify(response.data)}`);

            if (response.data.return === false) {
                throw new Error(response.data.message || 'Fast2SMS returned failure');
            }

            return {
                success: true,
                message: 'SMS sent successfully',
            };
        } catch (error: any) {
            this.logger.error(`❌ Fast2SMS Send SMS Error: ${error.message}`);

            return {
                success: false,
                message: error.message || 'SMS sending failed',
            };
        }
    }
}
