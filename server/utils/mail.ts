import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

const emailAPI = new TransactionalEmailsApi();
// set API key — this is how Brevo SDK expects it:
(emailAPI as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY!;

interface SendEmailParams {
  to: string;
  name: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, name, subject, html }: SendEmailParams) {
  const msg = new SendSmtpEmail();
  msg.sender = {
    email: process.env.SENDER_EMAIL!,
    name: "Mr English Academy",
  };
  msg.to = [{ email: to, name }];
  msg.subject = subject;
  msg.htmlContent = html;

  try {
    const resp = await emailAPI.sendTransacEmail(msg);
    console.log("✅ Brevo response:", resp);
    return resp;
  } catch (err: any) {
    console.error("❌ Brevo send error:", err);
    throw err;
  }
}
