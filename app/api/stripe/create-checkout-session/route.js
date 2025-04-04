// app/api/stripe/create-checkout-session/route.js
import Stripe from 'stripe';

const stripeSecretKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const stripe = new Stripe(stripeSecretKey);

export async function POST(req) {
  const body = await req.json();
  const { amount, surveyorId, credits } = body;


  

  if (!amount || amount % 500 !== 0) {
    return new Response(JSON.stringify({ error: 'Amount must be divisible by 5' }), { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Credit Top-up - £${credits}`,
            description: `Purchase £${credits} worth of credits. Get £${credits - amount / 100} free credit.`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard/billing?success=true&credits=${amount / 100}`,
      cancel_url: `${baseUrl}/dashboard/billing`,
      metadata: {
        surveyorId: surveyorId.toString(),
        credits: credits.toString(),
      }
    });

    return new Response(JSON.stringify({ id: session.id }));
  } catch (err) {
    console.error('Stripe session error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}
