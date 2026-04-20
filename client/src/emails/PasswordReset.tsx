import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'jsx-email';

interface PasswordResetEmailProps {
  customerName: string;
  resetLink: string;
}

export default function PasswordResetEmail({
  customerName,
  resetLink,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your ShopSphere password</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-xl mx-auto p-8 bg-white shadow-lg">
            <Section className="text-center mb-8">
              <Heading className="text-3xl font-bold text-orange-600">
                ShopSphere
              </Heading>
            </Section>

            <Section className="mb-8">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Reset Your Password
              </Heading>
              <Text className="text-gray-700 mb-2">
                Hi {customerName},
              </Text>
              <Text className="text-gray-700 mb-4">
                We received a request to reset your password. Click the button below to create a new password.
              </Text>
              
              <Section className="text-center my-6">
                <a
                  href={resetLink}
                  className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
                >
                  Reset Password
                </a>
              </Section>

              <Text className="text-gray-700">
                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </Text>
            </Section>

            <Section className="text-center py-6 border-t border-gray-200">
              <Text className="text-sm text-gray-500">
                Need help? Contact our customer support team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}