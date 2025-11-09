import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stripe backend is running' });
});

// Create Payment Intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, bookingId, customer } = req.body;
    
    console.log('Creating payment intent:', { amount, currency, bookingId, customer });
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount in cents
      currency: currency || 'eur',
      metadata: {
        bookingId: bookingId,
        customerName: customer.name,
        customerEmail: customer.email
      }
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.json({
      client_secret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Booking Payment Status endpoint  
app.post('/api/update-booking-payment', async (req, res) => {
  try {
    const { bookingId, paymentIntentId, status } = req.body;
    
    console.log('Updating booking payment status:', { bookingId, paymentIntentId, status });
    
    // Here you could update your booking status in Supabase
    // For now, we'll just return success
    
    res.json({
      success: true,
      booking: {
        id: bookingId,
        status: status,
        paymentId: paymentIntentId,
      },
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm Payment endpoint
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    
    console.log('Confirming payment:', { paymentIntentId, bookingId });
    
    // Here you could update your booking status in Supabase
    // For now, we'll just return success
    
    res.json({
      success: true,
      booking: {
        id: bookingId,
        status: 'paid',
      },
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Stripe backend running on http://localhost:${PORT}`);
  console.log('💳 Ready to process payments with Stripe');
  console.log('🧪 Use test card: 4242 4242 4242 4242');
});