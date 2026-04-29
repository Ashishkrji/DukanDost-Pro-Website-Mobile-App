import axios from 'axios';

/**
 * WhatsApp Service using Meta Graph API
 * Requirements: WhatsApp Business Account, Access Token, Phone Number ID
 */
class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private version: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_ID || '';
    this.version = 'v18.0';
  }

  private get url() {
    return `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/messages`;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Send a template message (e.g. Payment Reminder)
   */
  async sendTemplateMessage(to: string, templateName: string, languageCode: string = 'en', components: any[] = []) {
    if (!this.accessToken) {
      console.warn('[WhatsApp] No access token configured. Simulating send.');
      return { success: true, message: 'Simulated send' };
    }

    try {
      const response = await axios.post(this.url, {
        messaging_product: 'whatsapp',
        to: to.startsWith('+') ? to : `+91${to}`,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components
        }
      }, { headers: this.headers });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('[WhatsApp Error]', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Send a direct text message (requires customer to have messaged first in last 24h)
   */
  async sendTextMessage(to: string, text: string) {
    if (!this.accessToken) return { success: true, message: 'Simulated send' };

    try {
      const response = await axios.post(this.url, {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to.startsWith('+') ? to : `+91${to}`,
        type: 'text',
        text: { body: text }
      }, { headers: this.headers });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('[WhatsApp Error]', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  /**
   * Send a payment reminder with dynamic variables
   */
  async sendPaymentReminder(phone: string, customerName: string, amount: number, dueDate: string) {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: customerName },
          { type: 'text', text: amount.toString() },
          { type: 'text', text: dueDate }
        ]
      }
    ];
    return this.sendTemplateMessage(phone, 'payment_reminder', 'hi', components);
  }
}

export default new WhatsAppService();
