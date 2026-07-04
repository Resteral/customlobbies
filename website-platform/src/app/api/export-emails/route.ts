import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { ResetPasswordEmail } from '@/emails/ResetPasswordEmail';

export async function GET() {
  try {
    // Render the React components into HTML strings
    // We pass the Supabase template variable {{ .ConfirmationURL }} as the URL
    // so it gets embedded in the final HTML.
    const welcomeHtml = await render(
      WelcomeEmail({ confirmationUrl: '{{ .ConfirmationURL }}' })
    );
    
    const resetHtml = await render(
      ResetPasswordEmail({ resetUrl: '{{ .ConfirmationURL }}' })
    );

    return NextResponse.json({
      welcomeHtml,
      resetHtml,
      instructions: "Copy the HTML strings above and paste them into your Supabase Dashboard -> Authentication -> Email Templates."
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate emails' }, { status: 500 });
  }
}
