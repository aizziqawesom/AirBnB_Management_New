import { EmailTemplate } from '../../../components/email/email-template';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'StayFlow <onboarding@resend.dev>',
      to: [email],
      subject: 'Hello from StayFlow!',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    return Response.json({
      success: true,
      messageId: data?.id,
      message: `Email sent to ${email}`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}