import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@digitalcard.com';
const FROM_NAME = process.env.FROM_NAME || 'Digital Card';

// Email service adapter
class EmailService {
  private resend: Resend | null = null;
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Initialize Resend if API key is available
    if (RESEND_API_KEY) {
      this.resend = new Resend(RESEND_API_KEY);
    }
    // Fallback to SMTP if configured
    else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    }
  }

  async send(to: string, subject: string, html: string, text?: string) {
    try {
      // Use Resend if available
      if (this.resend) {
        const result = await this.resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to,
          subject,
          html,
          text: text || this.htmlToText(html),
        });
        return { success: true, data: result };
      }

      // Use SMTP transporter
      if (this.transporter) {
        const result = await this.transporter.sendMail({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to,
          subject,
          html,
          text: text || this.htmlToText(html),
        });
        return { success: true, data: result };
      }

      // No email service configured - log to console
      console.log('📧 Email (No service configured):', { to, subject });
      console.log('HTML:', html);
      return { success: false, error: 'No email service configured' };
    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const emailService = new EmailService();

// Email templates
export const emailTemplates = {
  invitationSent: (data: {
    guestName: string;
    hostName: string;
    eventName: string;
    eventDate: string;
    inviteUrl: string;
  }) => ({
    subject: `You're Invited: ${data.eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ You're Invited! ✨</h1>
            </div>
            <div class="content">
              <p>Dear ${data.guestName},</p>
              <p>${data.hostName} cordially invites you to celebrate ${data.eventName}!</p>
              <p><strong>📅 Date:</strong> ${data.eventDate}</p>
              <p>View your personalized 3D invitation:</p>
              <p style="text-align: center;">
                <a href="${data.inviteUrl}" class="button">View Invitation</a>
              </p>
              <p>Please RSVP by clicking the link above.</p>
              <p>We look forward to celebrating with you!</p>
              <p>Best regards,<br>${data.hostName}</p>
            </div>
            <div class="footer">
              <p>Sent via Digital Card - Create your own stunning 3D invitations</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  rsvpConfirmation: (data: {
    guestName: string;
    hostName: string;
    eventName: string;
    rsvpStatus: string;
    guestCount: number;
  }) => ({
    subject: `RSVP Confirmation - ${data.eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ RSVP Confirmed</h1>
            </div>
            <div class="content">
              <p>Dear ${data.guestName},</p>
              <p>Thank you for your RSVP!</p>
              <div class="status">
                <strong>Status:</strong> ${data.rsvpStatus}<br>
                <strong>Number of Guests:</strong> ${data.guestCount}
              </div>
              <p>We have received your response for ${data.eventName}.</p>
              ${
                data.rsvpStatus === 'ACCEPTED'
                  ? '<p>We are excited to celebrate with you! See you soon!</p>'
                  : '<p>Thank you for letting us know. You will be missed!</p>'
              }
              <p>Best regards,<br>${data.hostName}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  rsvpNotification: (data: {
    hostName: string;
    guestName: string;
    eventName: string;
    rsvpStatus: string;
    guestCount: number;
    dashboardUrl: string;
  }) => ({
    subject: `New RSVP: ${data.guestName} - ${data.eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196F3; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #2196F3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New RSVP Received!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.hostName},</p>
              <p>Good news! You have a new RSVP for ${data.eventName}.</p>
              <p><strong>Guest:</strong> ${data.guestName}</p>
              <p><strong>Status:</strong> ${data.rsvpStatus}</p>
              <p><strong>Number of Guests:</strong> ${data.guestCount}</p>
              <p style="text-align: center;">
                <a href="${data.dashboardUrl}" class="button">View Dashboard</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  eventReminder: (data: {
    guestName: string;
    eventName: string;
    eventDate: string;
    venue: string;
    inviteUrl: string;
  }) => ({
    subject: `Reminder: ${data.eventName} is coming up!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF9800; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #FF9800; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Event Reminder</h1>
            </div>
            <div class="content">
              <p>Dear ${data.guestName},</p>
              <p>This is a friendly reminder about the upcoming event:</p>
              <p><strong>${data.eventName}</strong></p>
              <p><strong>📅 Date:</strong> ${data.eventDate}</p>
              <p><strong>📍 Venue:</strong> ${data.venue}</p>
              <p style="text-align: center;">
                <a href="${data.inviteUrl}" class="button">View Invitation</a>
              </p>
              <p>We look forward to seeing you there!</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
