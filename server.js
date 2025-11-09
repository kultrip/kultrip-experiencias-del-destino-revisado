import 'dotenv/config';import 'dotenv/config';

import express from 'express';import express from 'express';

import cors from 'cors';import cors from 'cors';

import Stripe from 'stripe';import Stripe from 'stripe';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const app = express();const app = express();

const PORT = process.env.PORT || 3001;const PORT = process.env.PORT || 3001;



// Middleware// Middleware

app.use(cors());app.use(cors());

app.use(express.json());app.use(express.json());



// Health check// Health check

app.get('/health', (req, res) => {app.get('/health', (req, res) => {

  res.json({ status: 'OK', message: 'Stripe backend is running' });  res.json({ status: 'OK', message: 'Stripe backend is running' });

});});



// Create Payment Intent endpoint// Create Payment Intent endpoint

app.post('/api/create-payment-intent', async (req, res) => {app.post('/api/create-payment-intent', async (req, res) => {

  try {  try {

    const { amount, currency, bookingId, customer } = req.body;    const { amount, currency, bookingId, customer } = req.body;

        

    console.log('Creating payment intent:', { amount, currency, bookingId, customer });    console.log('Creating payment intent:', { amount, currency, bookingId, customer });

        

    const paymentIntent = await stripe.paymentIntents.create({    const paymentIntent = await stripe.paymentIntents.create({

      amount: Math.round(amount), // amount in cents      amount: Math.round(amount), // amount in cents

      currency: currency || 'eur',      currency: currency || 'eur',

      metadata: {      metadata: {

        bookingId: bookingId,        bookingId: bookingId,

        customerName: customer.name,        customerName: customer.name,

        customerEmail: customer.email        customerEmail: customer.email

      }      }

    });    });



    console.log('Payment intent created:', paymentIntent.id);    console.log('Payment intent created:', paymentIntent.id);



    res.json({    res.json({

      client_secret: paymentIntent.client_secret,      client_secret: paymentIntent.client_secret,

      paymentIntentId: paymentIntent.id,      paymentIntentId: paymentIntent.id,

    });    });

  } catch (error) {  } catch (error) {

    console.error('Error creating payment intent:', error);    console.error('Error creating payment intent:', error);

    res.status(500).json({ error: error.message });    res.status(500).json({ error: error.message });

  }  }

});});



// Update Booking Payment Status endpoint  // Update Booking Payment Status endpoint  

app.post('/api/update-booking-payment', async (req, res) => {app.post('/api/update-booking-payment', async (req, res) => {

  try {  try {

    const { bookingId, paymentIntentId, status } = req.body;    const { bookingId, paymentIntentId, status } = req.body;

        

    console.log('Updating booking payment status:', { bookingId, paymentIntentId, status });    console.log('Updating booking payment status:', { bookingId, paymentIntentId, status });

        

    // Here you could update your booking status in Supabase    // Here you could update your booking status in Supabase

    // For now, we'll just return success    // For now, we'll just return success

        

    res.json({    res.json({

      success: true,      success: true,

      booking: {      booking: {

        id: bookingId,        id: bookingId,

        status: status,        status: status,

        paymentId: paymentIntentId,        paymentId: paymentIntentId,

      },      },

    });    });

  } catch (error) {  } catch (error) {

    console.error('Error updating booking status:', error);    console.error('Error updating booking status:', error);

    res.status(500).json({ error: error.message });    res.status(500).json({ error: error.message });

  }  }

});});



// Confirm Payment endpoint// Confirm Payment endpoint

app.post('/api/confirm-payment', async (req, res) => {app.post('/api/confirm-payment', async (req, res) => {

  try {  try {

    const { paymentIntentId, bookingId } = req.body;    const { paymentIntentId, bookingId } = req.body;

        

    console.log('Confirming payment:', { paymentIntentId, bookingId });    console.log('Confirming payment:', { paymentIntentId, bookingId });

        

    // Here you could update your booking status in Supabase    // Here you could update your booking status in Supabase

    // For now, we'll just return success    // For now, we'll just return success

        

    res.json({    res.json({

      success: true,      success: true,

      booking: {      booking: {

        id: bookingId,        id: bookingId,

        status: 'paid',        status: 'paid',

      },      },

    });    });

  } catch (error) {  } catch (error) {

    console.error('Error confirming payment:', error);    console.error('Error confirming payment:', error);

    res.status(500).json({ error: error.message });    res.status(500).json({ error: error.message });

  }  }

});});



app.listen(PORT, () => {app.listen(PORT, () => {

  console.log(`🚀 Stripe backend running on http://localhost:${PORT}`);  console.log(`🚀 Stripe backend running on http://localhost:${PORT}`);

  console.log('💳 Ready to process payments with Stripe');  console.log('💳 Ready to process payments with Stripe');

  console.log('🧪 Use test card: 4242 4242 4242 4242');  console.log('🧪 Use test card: 4242 4242 4242 4242');

});});