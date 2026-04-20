import { NextRequest, NextResponse } from 'next/server';
import billingService from '@/services/billingService';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and headers
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }
    
    // Handle the webhook
    const response = await billingService.handleWebhook(
      Buffer.from(body),
      signature
    );
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
```

```typescript