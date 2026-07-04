import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  confirmationUrl: string;
}

export const WelcomeEmail = ({
  confirmationUrl = '{{ .ConfirmationURL }}', // Fallback to Supabase variable
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Resolve.bet! Please confirm your email.</Preview>
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
                Confirm your email address
              </Heading>
              <Text className="text-base leading-6 text-gray-600 mb-6">
                Thanks for starting your journey with Resolve.bet. We're excited to help you generate beautiful, high-performing websites in seconds.
              </Text>
              <Text className="text-base leading-6 text-gray-600 mb-6">
                To get started, please confirm your email address by clicking the button below:
              </Text>
              
              <Section className="text-center my-8">
                <Button
                  className="bg-blue-600 rounded-lg text-white font-semibold text-base py-3 px-6 text-center shadow-sm"
                  href={confirmationUrl}
                >
                  Verify Email
                </Button>
              </Section>
              
              <Text className="text-sm leading-5 text-gray-500 mt-8">
                If you didn't create an account with Resolve.bet, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
