import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is missing.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});

// Utility function to format the amount for Stripe
const formatAmountForStripe = (amount, currency) => {
  // (For currencies with no decimals (e.g. JPY) you’d adjust this function.)
  return Math.round(amount * 100);
};

// POST: Create a checkout session
export async function POST(req) {
  try {
    // Use the referer header if available, otherwise fall back to localhost.
    const referer = req.headers.get('referer') || 'http://localhost:3000/';
    const baseUrl = referer.endsWith('/') ? referer : `${referer}/`;

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro subscription',
            },
            unit_amount: formatAmountForStripe(10, 'usd'), // $10.00
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(
      JSON.stringify({ error: { message: error instanceof Error ? error.message : error } }),
      { status: 500 }
    );
  }
}

// GET: Retrieve checkout session details
export async function GET(req) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : error } },
      { status: 500 }
    );
  }
}
