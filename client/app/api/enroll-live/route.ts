import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, message, product, price } = body || {};

    // TODO: Add your payment gateway integration here (Razorpay, Stripe, etc.).
    // This endpoint will be called when the user submits the enroll form.

    // Attempt to send a payment receipt email to the user if SMTP env vars are configured.
    try {
      const SMTP_HOST = process.env.SMTP_HOST;
      const SMTP_USER = process.env.SMTP_USER;
      const SMTP_PASS = process.env.SMTP_PASS;
      const SMTP_PORT = process.env.SMTP_PORT;
      const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

      if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        // dynamic require to avoid build-time errors if nodemailer isn't installed
        // (we added nodemailer to package.json, but this pattern is safer)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT ? Number(SMTP_PORT) : 587,
          secure: SMTP_PORT === '465',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const mailOptions = {
          from: FROM_EMAIL,
          to: email,
          subject: `Enrollment Receipt - ${product}`,
          text: `Hi ${name},\n\nThank you for enrolling in ${product}.\nAmount: ₹${price}\n\nWe have received your enrollment request and will follow up shortly with payment instructions or confirmation.\n\n- Mr English Team`,
        };

        await transporter.sendMail(mailOptions);
      } else {
        // If SMTP not configured, just log and continue.
        console.log('SMTP configuration not found. Skipping email send.');
      }
    } catch (emailErr) {
      console.error('Failed to send receipt email:', emailErr);
      // do not fail the entire request because of email issues
    }

    // Return success for now. In a real system integrate payment capture here.
    return NextResponse.json({
      success: true,
      message: 'Enrollment request received',
    });
  } catch (error) {
    console.error('Error in enroll-live POST:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process enrollment',
    }, { status: 500 });
  }
}