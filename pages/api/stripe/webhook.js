// pages/api/stripe/webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import { Surveyor } from "@/models/index.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = process.env.NODE_ENV === 'production'
? new Stripe(process.env.STRIPE_SECRET_KEY_LIVE) 
: new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

// Use the appropriate webhook secret based on the environment
const webhookSecret = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
  : process.env.STRIPE_WEBHOOK_SECRET_TEST;


  export default async function handler(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      const buf = await buffer(req);
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const surveyorId = parseInt(session.metadata?.surveyorId);
        const creditsToAdd = parseInt(session.metadata?.credits);
      
        console.log(`🧾 Surveyor ID: ${surveyorId}, Credits to add: ${creditsToAdd}`);
      
        try {
          const surveyor = await Surveyor.findByPk(surveyorId);
          if (surveyor) {
            surveyor.balance = (parseFloat(surveyor.balance) || 0) + creditsToAdd;
            await surveyor.save();
            console.log(`✅ Added ${creditsToAdd} credits. New balance: ${surveyor.balance}`);
          } else {
            console.warn(`⚠️ Surveyor not found: ID ${surveyorId}`);
          }
        } catch (err) {
          console.error("🔥 Database error:", err);
        }
      }
      
  
    res.status(200).json({ received: true });
  }