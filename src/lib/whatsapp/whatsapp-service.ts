// WhatsApp messaging service using Twilio or direct WhatsApp Business API

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

class WhatsAppService {
  private twilioClient: any = null;

  constructor() {
    // Initialize Twilio if credentials are available
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      try {
        // Dynamically import Twilio (not installed by default)
        // In production, run: npm install twilio
        const twilio = require('twilio');
        this.twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      } catch (error) {
        console.warn('Twilio not installed. WhatsApp messages will be logged only.');
      }
    }
  }

  async sendMessage(to: string, message: string) {
    try {
      // Ensure number has country code
      const formattedNumber = this.formatPhoneNumber(to);

      if (this.twilioClient && TWILIO_WHATSAPP_NUMBER) {
        // Send via Twilio WhatsApp
        const result = await this.twilioClient.messages.create({
          from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${formattedNumber}`,
          body: message,
        });

        return {
          success: true,
          data: result,
          messageId: result.sid,
        };
      }

      // No WhatsApp service configured - log to console
      console.log('📱 WhatsApp Message (No service configured):');
      console.log(`To: ${formattedNumber}`);
      console.log(`Message: ${message}`);

      return {
        success: false,
        error: 'No WhatsApp service configured',
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send WhatsApp message',
      };
    }
  }

  async sendInvitation(data: {
    to: string;
    guestName: string;
    hostName: string;
    eventName: string;
    eventDate: string;
    inviteUrl: string;
  }) {
    const message = `
🎉 *You're Invited!*

Hi ${data.guestName},

${data.hostName} invites you to ${data.eventName}!

📅 *Date:* ${data.eventDate}

View your personalized 3D invitation:
${data.inviteUrl}

Please RSVP by visiting the link above.

We look forward to celebrating with you! ✨
    `.trim();

    return this.sendMessage(data.to, message);
  }

  async sendRSVPConfirmation(data: {
    to: string;
    guestName: string;
    hostName: string;
    eventName: string;
    rsvpStatus: string;
  }) {
    const message = `
✓ *RSVP Confirmed*

Hi ${data.guestName},

Thank you for your RSVP!

*Event:* ${data.eventName}
*Status:* ${data.rsvpStatus}

${
  data.rsvpStatus === 'ACCEPTED'
    ? 'We are excited to celebrate with you! 🎊'
    : 'Thank you for letting us know.'
}

- ${data.hostName}
    `.trim();

    return this.sendMessage(data.to, message);
  }

  async sendEventReminder(data: {
    to: string;
    guestName: string;
    eventName: string;
    eventDate: string;
    venue: string;
    inviteUrl: string;
  }) {
    const message = `
⏰ *Event Reminder*

Hi ${data.guestName},

This is a reminder about:
*${data.eventName}*

📅 Date: ${data.eventDate}
📍 Venue: ${data.venue}

View invitation:
${data.inviteUrl}

See you soon! 🎉
    `.trim();

    return this.sendMessage(data.to, message);
  }

  async sendBulkMessages(messages: Array<{ to: string; message: string }>) {
    const results = [];

    for (const msg of messages) {
      const result = await this.sendMessage(msg.to, msg.message);
      results.push({
        to: msg.to,
        ...result,
      });

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return results;
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If doesn't start with country code, assume India (+91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }

  // Generate WhatsApp deep link for manual sharing
  generateWhatsAppLink(phoneNumber: string, message: string): string {
    const formatted = this.formatPhoneNumber(phoneNumber).replace('+', '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${formatted}?text=${encoded}`;
  }

  // Generate WhatsApp RSVP link
  generateRSVPLink(phoneNumber: string, invitationSlug: string): string {
    const message = `I'd like to RSVP for the event: ${invitationSlug}`;
    return this.generateWhatsAppLink(phoneNumber, message);
  }
}

export const whatsappService = new WhatsAppService();

// WhatsApp message templates
export const whatsappTemplates = {
  invitation: (data: {
    guestName: string;
    hostName: string;
    eventName: string;
    eventDate: string;
    inviteUrl: string;
  }) => `
🎉 *You're Invited!*

Hi ${data.guestName},

${data.hostName} invites you to ${data.eventName}!

📅 *Date:* ${data.eventDate}

View your 3D invitation: ${data.inviteUrl}

RSVP by visiting the link above! ✨
  `.trim(),

  rsvpConfirmation: (data: {
    guestName: string;
    hostName: string;
    rsvpStatus: string;
  }) => `
✓ *RSVP Confirmed*

Hi ${data.guestName},

Thank you for your RSVP (${data.rsvpStatus})!

${data.rsvpStatus === 'ACCEPTED' ? 'See you soon! 🎊' : 'Thank you for letting us know.'}

- ${data.hostName}
  `.trim(),

  reminder: (data: { guestName: string; eventName: string; eventDate: string; venue: string }) => `
⏰ *Event Reminder*

Hi ${data.guestName},

Reminder: ${data.eventName}
📅 ${data.eventDate}
📍 ${data.venue}

See you there! 🎉
  `.trim(),
};
