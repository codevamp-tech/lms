import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WatiService {
    private readonly apiUrl: string;
    private readonly accessToken: string;

    constructor(private configService: ConfigService) {
        this.apiUrl = this.configService.get<string>('WATI_API_URL') || '';
        this.accessToken = this.configService.get<string>('WATI_ACCESS_TOKEN') || '';

        if (!this.apiUrl || !this.accessToken) {
            console.warn('⚠️ WATI configuration is incomplete. WATI_API_URL and WATI_ACCESS_TOKEN are required.');
        }
    }

    /**
     * Normalize phone number for WhatsApp
     */
    private normalizePhone(phone: string): string {
        // Remove spaces, dashes, and plus signs
        let normalized = phone.replace(/[\s+\-]/g, '');

        // Add country code if not present (default to India +91)
        if (!normalized.startsWith('91') && normalized.length === 10) {
            normalized = `91${normalized}`;
        }

        return normalized;
    }

    /**
     * Send a WhatsApp template message via WATI
     * @param phone - Recipient phone number
     * @param templateName - Name of the pre-approved template
     * @param params - Parameters to fill in the template (array of objects with name and value)
     */
    async sendTemplateMessage(
        phone: string,
        templateName: string,
        params: Array<{ name: string; value: string }> = []
    ): Promise<{ success: boolean; message: string }> {
        console.log('\n📤 ========== WATI WHATSAPP SERVICE ==========');
        console.log('📤 Input phone:', phone);
        console.log('📤 Template name:', templateName);
        console.log('📤 Parameters:', params);

        if (!this.apiUrl || !this.accessToken) {
            console.error('❌ WATI not configured');
            return {
                success: false,
                message: 'WATI configuration missing',
            };
        }

        try {
            const normalizedPhone = this.normalizePhone(phone);
            console.log('📤 Normalized phone:', normalizedPhone);

            const response = await axios.post(
                `${this.apiUrl}/api/v1/sendTemplateMessage`,
                {
                    template_name: templateName,
                    broadcast_name: `broadcast_${Date.now()}`,
                    parameters: params,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        whatsappNumber: normalizedPhone,
                    },
                }
            );

            console.log('✅ WATI Response:', response.data);
            console.log('📤 ========== END WATI WHATSAPP ==========\n');

            return {
                success: true,
                message: 'WhatsApp notification sent successfully',
            };
        } catch (error: any) {
            console.error('❌ WATI WhatsApp Error:', error.message);
            console.error('❌ Error response:', error.response?.data);
            console.log('📤 ========== END WATI WHATSAPP (ERROR) ==========\n');

            // Don't throw for WhatsApp errors - it's supplementary
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'WhatsApp notification failed',
            };
        }
    }

    /**
     * Send enquiry confirmation via WhatsApp
     */
    async sendEnquiryConfirmation(phone: string, name: string): Promise<{ success: boolean; message: string }> {
        const templateName = this.configService.get<string>('WATI_TEMPLATE_ENQUIRY') || 'enquiry_confirmation';
        return this.sendTemplateMessage(phone, templateName, [
            { name: 'name', value: name },
        ]);
    }

    /**
     * Send course purchase notification via WhatsApp
     */
    async sendCoursePurchaseNotification(
        phone: string,
        courseName: string,
        paymentId: string
    ): Promise<{ success: boolean; message: string }> {
        const templateName = this.configService.get<string>('WATI_TEMPLATE_COURSE_PURCHASE') || 'course_purchase_success';
        return this.sendTemplateMessage(phone, templateName, [
            { name: 'course_name', value: courseName },
            { name: 'payment_id', value: paymentId },
        ]);
    }

    /**
     * Send live session enrollment notification via WhatsApp
     */
    async sendLiveSessionNotification(
        phone: string,
        sessionTitle: string,
        sessionDate: string
    ): Promise<{ success: boolean; message: string }> {
        const templateName = this.configService.get<string>('WATI_TEMPLATE_LIVE_SESSION') || 'live_session_enrolled';
        return this.sendTemplateMessage(phone, templateName, [
            { name: 'session_title', value: sessionTitle },
            { name: 'session_date', value: sessionDate },
        ]);
    }
}
