import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status === 'paid') {
      return NextResponse.redirect(new URL(`/order-confirmation?session_id=${sessionId}`, request.url));
    } else {
      return NextResponse.redirect(new URL('/cart?payment=failed', request.url));
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.redirect(new URL('/cart?payment=error', request.url));
  }
}