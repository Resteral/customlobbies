import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return new NextResponse('Stripe keys not configured', { status: 400 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new NextResponse('No signature found', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout completed successfully!', session.id);
      // Here you would typically update the database to fulfill the order
      // (e.g., mark DevSpace ad as paid, or mark e-commerce order as paid)
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('OK', { status: 200 });
}
