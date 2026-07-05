import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Mock mode if no key
      return NextResponse.json({ url: '/checkout/success' });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as '2026-06-24.dahlia' });
    const { items, successUrl, cancelUrl } = await req.json();

    interface CheckoutItem {
      name: string;
      price: number;
      quantity: number;
    }

    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/checkout/success`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
