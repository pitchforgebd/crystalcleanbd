import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP delivery for contact-form notifications.
 *
 * Everything is optional: when SMTP is not configured the site keeps working
 * and messages are still stored in the database — they just are not emailed.
 */

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  password?: string;
  from: string;
  to: string;
  replyToVisitor: boolean;
};

export function readMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!host || !to) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    // Port 465 is implicit TLS; 587/25 upgrade with STARTTLS.
    secure: (process.env.SMTP_SECURE ?? "").toLowerCase() === "true" || port === 465,
    user: process.env.SMTP_USER?.trim() || undefined,
    password: process.env.SMTP_PASSWORD || undefined,
    from: process.env.CONTACT_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim() || to,
    to,
    replyToVisitor: (process.env.CONTACT_AUTOREPLY ?? "true").toLowerCase() !== "false",
  };
}

export function isMailConfigured(): boolean {
  return readMailConfig() !== null;
}

let cached: Transporter | null = null;

function transport(config: MailConfig): Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user ? { user: config.user, pass: config.password } : undefined,
      // Never let a stalled SMTP server hold the visitor's request open.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }
  return cached;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string,
  );

export type ContactNotification = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  brandName: string;
  adminUrl?: string;
};

function notificationBody(data: ContactNotification) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Subject", data.subject],
  ];

  const text = [
    `New contact message from the ${data.brandName} website`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
    data.adminUrl ? `\nOpen in admin: ${data.adminUrl}` : "",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;color:#0b1220;max-width:640px">
      <h2 style="margin:0 0 4px;color:#0157bd">New contact message</h2>
      <p style="margin:0 0 20px;color:#4a5872;font-size:14px">
        Sent from the ${escapeHtml(data.brandName)} website
      </p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px;background:#edf4fa;border:1px solid #d3e3f1;width:120px;font-weight:600">${label}</td>
            <td style="padding:8px 12px;border:1px solid #d3e3f1">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 8px;font-weight:600;font-size:14px">Message</p>
      <p style="margin:0;padding:14px;background:#f2f7fc;border:1px solid #d3e3f1;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
        data.message,
      )}</p>
      ${
        data.adminUrl
          ? `<p style="margin:20px 0 0"><a href="${data.adminUrl}" style="background:#0157bd;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600">Open in admin</a></p>`
          : ""
      }
    </div>`;

  return { text, html };
}

function acknowledgementBody(data: ContactNotification) {
  const text = [
    `Hello ${data.name},`,
    "",
    `Thank you for contacting ${data.brandName}. We have received your message and will get back to you shortly.`,
    "",
    "Your message:",
    data.message,
    "",
    `— ${data.brandName}`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;color:#0b1220;max-width:640px">
      <p style="font-size:15px">Hello ${escapeHtml(data.name)},</p>
      <p style="font-size:15px;line-height:1.6">
        Thank you for contacting <strong>${escapeHtml(data.brandName)}</strong>.
        We have received your message and will get back to you shortly.
      </p>
      <p style="margin:20px 0 8px;font-weight:600;font-size:14px">Your message</p>
      <p style="margin:0;padding:14px;background:#f2f7fc;border:1px solid #d3e3f1;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
        data.message,
      )}</p>
      <p style="margin-top:24px;font-size:14px;color:#4a5872">— ${escapeHtml(data.brandName)}</p>
    </div>`;

  return { text, html };
}

export type MailOutcome =
  | { sent: true; acknowledged: boolean }
  | { sent: false; reason: "not-configured" | "failed" };

/**
 * Emails the business a new enquiry and (optionally) acknowledges the visitor.
 * Never throws — the message is already stored, so delivery problems must not
 * fail the visitor's submission.
 */
export async function sendContactNotification(
  data: ContactNotification,
): Promise<MailOutcome> {
  const config = readMailConfig();
  if (!config) return { sent: false, reason: "not-configured" };

  try {
    const mailer = transport(config);
    const body = notificationBody(data);

    await mailer.sendMail({
      from: `"${data.brandName} website" <${config.from}>`,
      to: config.to,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `New enquiry: ${data.subject}`,
      text: body.text,
      html: body.html,
    });

    let acknowledged = false;
    if (config.replyToVisitor) {
      try {
        const ack = acknowledgementBody(data);
        await mailer.sendMail({
          from: `"${data.brandName}" <${config.from}>`,
          to: data.email,
          subject: `We received your message — ${data.brandName}`,
          text: ack.text,
          html: ack.html,
        });
        acknowledged = true;
      } catch (error) {
        // The business was notified; a failed acknowledgement is not critical.
        console.error("[sendContactNotification] acknowledgement failed", error);
      }
    }

    return { sent: true, acknowledged };
  } catch (error) {
    console.error("[sendContactNotification]", error);
    return { sent: false, reason: "failed" };
  }
}
