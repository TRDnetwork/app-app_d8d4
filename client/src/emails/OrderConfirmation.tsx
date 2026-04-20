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

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  orderDate: string;
  totalAmount: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export default function OrderConfirmationEmail({
  customerName,
  orderId,
  orderDate,
  totalAmount,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ShopSphere order has been confirmed!</Preview>
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
                Order Confirmed
              </Heading>
              <Text className="text-gray-700 mb-2">
                Hi {customerName},
              </Text>
              <Text className="text-gray-700">
                Thank you for your order! We're preparing your items for shipment.
              </Text>
            </Section>

            <Section className="bg-gray-50 p-6 rounded-lg mb-8">
              <Text className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Order ID:</span> {orderId}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Order Date:</span> {orderDate}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Total Amount:</span> {totalAmount}
              </Text>
            </Section>

            <Section className="mb-8">
              <Heading className="text-lg font-semibold text-gray-900 mb-3">
                Shipping Address
              </Heading>
              <Text className="text-gray-700 mb-1">{shippingAddress.name}</Text>
              <Text className="text-gray-700 mb-1">{shippingAddress.address}</Text>
              <Text className="text-gray-700 mb-1">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              </Text>
              <Text className="text-gray-700">{shippingAddress.country}</Text>
            </Section>

            <Section className="text-center py-6 border-t border-gray-200">
              <Text className="text-sm text-gray-500">
                Need help? Contact our customer support team
              </Text>
              <Text className="text-sm text-gray-500">
                We'll respond within 24 hours
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}