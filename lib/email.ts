import { Resend } from "resend";

// All outbound mail goes through this file (architecture.md §1, §6.1).
// If the operator prefers Hostinger SMTP over Resend, swap the implementation
// of sendEmail() below for a nodemailer transport — callers never change.

const FROM = "BRF Inspektion <no-reply@brfinspektion.se>";

let resendClient: Resend | null = null;

function getClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // In local dev without an API key, log instead of failing the request.
    console.info("[email:dev-noop]", { to, subject });
    return;
  }
  await getClient().emails.send({ from: FROM, to, subject, html });
}

export function notifyEmailAddress(): string {
  const address = process.env.NOTIFY_EMAIL;
  if (!address) {
    throw new Error("NOTIFY_EMAIL is not set");
  }
  return address;
}
