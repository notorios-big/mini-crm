import nodemailer from 'nodemailer';
import { getQuery, allQuery, runQuery } from '../config/database';
import { EmailLog, EmailSequence, Lead } from '../models/types';

let transporter: nodemailer.Transporter | null = null;

// Initialize email transporter
export async function initializeEmailService() {
  try {
    const smtpHost = await getQuery<{ value: string }>('SELECT value FROM config WHERE key = ?', ['smtp_host']);
    const smtpPort = await getQuery<{ value: string }>('SELECT value FROM config WHERE key = ?', ['smtp_port']);
    const smtpUser = await getQuery<{ value: string }>('SELECT value FROM config WHERE key = ?', ['smtp_user']);
    const smtpPassword = await getQuery<{ value: string }>('SELECT value FROM config WHERE key = ?', ['smtp_password']);
    const smtpFrom = await getQuery<{ value: string }>('SELECT value FROM config WHERE key = ?', ['smtp_from']);

    if (!smtpHost?.value || !smtpUser?.value || !smtpPassword?.value) {
      console.log('⚠ SMTP not configured, email service disabled');
      return;
    }

    transporter = nodemailer.createTransport({
      host: smtpHost.value,
      port: parseInt(smtpPort?.value || '587'),
      secure: false,
      auth: {
        user: smtpUser.value,
        pass: smtpPassword.value,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✓ Email service initialized');
  } catch (error) {
    console.error('Email service initialization error:', error);
    transporter = null;
  }
}

// Replace variables in email template
function replaceVariables(template: string, lead: Lead): string {
  return template
    .replace(/\{nombre\}/g, lead.name)
    .replace(/\{name\}/g, lead.name)
    .replace(/\{email\}/g, lead.email)
    .replace(/\{telefono\}/g, lead.phone)
    .replace(/\{phone\}/g, lead.phone)
    .replace(/\{ciudad\}/g, lead.city || '')
    .replace(/\{city\}/g, lead.city || '')
    .replace(/\{pais\}/g, lead.country || '')
    .replace(/\{country\}/g, lead.country || '');
}

// Send email
export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  if (!transporter) {
    console.log('Email service not available, skipping email to:', to);
    return false;
  }

  try {
    const smtpFrom = await getQuery<{ value: string }>('SELECT value FROM config WHERE key = ?', ['smtp_from']);

    await transporter.sendMail({
      from: smtpFrom?.value || 'noreply@notorios.com',
      to,
      subject,
      html: body,
    });

    console.log('✓ Email sent to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Process pending email logs
export async function processPendingEmails() {
  try {
    // Get pending emails that should be sent now
    const now = new Date().toISOString();
    const pendingEmails = await allQuery<EmailLog>(
      `SELECT * FROM email_logs WHERE status = 'pending' AND scheduled_at <= ?`,
      [now]
    );

    for (const emailLog of pendingEmails) {
      try {
        // Get lead data
        const lead = await getQuery<Lead>('SELECT * FROM leads WHERE id = ?', [emailLog.lead_id]);

        if (!lead) {
          await runQuery(
            'UPDATE email_logs SET status = ?, error = ? WHERE id = ?',
            ['failed', 'Lead not found', emailLog.id]
          );
          continue;
        }

        // Get sequence data
        const sequence = await getQuery<EmailSequence>(
          'SELECT * FROM email_sequences WHERE id = ?',
          [emailLog.sequence_id]
        );

        if (!sequence) {
          await runQuery(
            'UPDATE email_logs SET status = ?, error = ? WHERE id = ?',
            ['failed', 'Sequence not found', emailLog.id]
          );
          continue;
        }

        // Replace variables
        const subject = replaceVariables(sequence.subject, lead);
        const body = replaceVariables(sequence.body, lead);

        // Send email
        const success = await sendEmail(lead.email, subject, body);

        if (success) {
          await runQuery(
            'UPDATE email_logs SET status = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
            ['sent', emailLog.id]
          );
        } else {
          await runQuery(
            'UPDATE email_logs SET status = ?, error = ? WHERE id = ?',
            ['failed', 'Failed to send email', emailLog.id]
          );
        }
      } catch (error) {
        console.error('Error processing email log:', emailLog.id, error);
        await runQuery(
          'UPDATE email_logs SET status = ?, error = ? WHERE id = ?',
          ['failed', String(error), emailLog.id]
        );
      }
    }

    if (pendingEmails.length > 0) {
      console.log(`✓ Processed ${pendingEmails.length} pending emails`);
    }
  } catch (error) {
    console.error('Error processing pending emails:', error);
  }
}
