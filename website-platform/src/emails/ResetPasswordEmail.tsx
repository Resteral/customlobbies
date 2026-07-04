import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export const ResetPasswordEmail = ({
  resetUrl = '{{ .ConfirmationURL }}', // Fallback to Supabase variable
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Resolve.bet password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans text-gray-900">
          <Container className="mx-auto my-10 max-w-[600px] border border-gray-200 rounded-xl p-8 shadow-sm bg-gray-50/50">
            <Section className="text-center mb-8">
              <Heading className="text-2xl font-bold tracking-tight text-gray-900 m-0">
                Resolve.bet
              </Heading>
            </Section>
            
            <Section>
              <Heading className="text-xl font-bold mb-4">
                Reset your password
              </Heading>
              <Text className="text-base leading-6 text-gray-600 mb-6">
                Someone recently requested a password change for your Resolve.bet account. If this was you, you can set a new password here:
              </Text>
              
              <Section className="text-center my-8">
                <Button
                  className="bg-blue-600 rounded-lg text-white font-semibold text-base py-3 px-6 text-center shadow-sm"
                  href={resetUrl}
                >
                  Reset Password
                </Button>
              </Section>
              
              <Text className="text-sm leading-5 text-gray-500 mt-8">
                If you didn&apos;t request this, you can safely ignore this email and your password will remain unchanged.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
