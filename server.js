import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import Stripe from 'stripe';
import { Resend } from 'resend';

// For development only - ignore SSL certificate errors
if (process.env.NODE_ENV === 'development') {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory (built React app)
app.use(express.static('dist'));

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

// Send Confirmation Email endpoint
app.post('/api/send-confirmation-email', async (req, res) => {
  try {
    const { bookingData, customerEmail, customerName } = req.body;
    
    console.log('Sending confirmation email to:', customerEmail);
    
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>¡Tu aventura está confirmada!</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff7e00, #ff9500); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .highlight { background: #fff3e0; padding: 15px; border-left: 4px solid #ff7e00; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .button { display: inline-block; background: #ff7e00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Hola ${customerName}! 🎉</h1>
            <h2>¡Tu aventura está confirmada!</h2>
            <p>Estamos súper emocionados de que formes parte de esta experiencia única 🌟</p>
        </div>
        
        <div class="content">
            <h3>📋 Detalles de tu Reserva:</h3>
            
            <div class="highlight">
                <p><strong>🎯 Experiencia:</strong> ${bookingData.experienceTitle}</p>
                <p><strong>📅 Fecha:</strong> ${new Date(bookingData.experienceDate).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>👥 Participantes:</strong> ${bookingData.participants} personas</p>
                <p><strong>💰 Total Pagado:</strong> €${bookingData.totalAmount}</p>
                <p><strong>🎫 Código de Reserva:</strong> ${bookingData.bookingId.slice(0, 8).toUpperCase()}</p>
            </div>
            
            <h3>🎒 ¿Qué puedes esperar?</h3>
            <p>Te vas a sumergir en una experiencia auténtica que recordarás para siempre. Nuestro equipo se encargará de que todo sea perfecto para que solo tengas que disfrutar.</p>
            
            <h3>📞 ¿Necesitas ayuda?</h3>
            <p>Si tienes alguna pregunta o necesitas modificar algo, no dudes en contactarnos:</p>
            <ul>
                <li>📧 Email: <strong>reservas@experienciasdeldestino.com</strong></li>
                <li>📱 Teléfono: <strong>+34 900 123 456</strong></li>
                <li>💬 WhatsApp: <strong>+34 600 789 123</strong></li>
            </ul>
        </div>
        
        <div class="footer">
            <p>¡Gracias por confiar en nosotros! 💛</p>
            <p><strong>Experiencias del Destino</strong><br>
            Creando recuerdos únicos desde 2024</p>
            <p style="font-size: 12px; color: #999;">
                Este email fue enviado a ${customerEmail}<br>
                Si tienes problemas para ver este email, <a href="#">haz click aquí</a>
            </p>
        </div>
    </div>
</body>
</html>`;

    // Try to send email via Resend
    try {
      const result = await resend.emails.send({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: customerEmail,
        subject: `¡Tu aventura "${bookingData.experienceTitle}" está confirmada! 🎉`,
        html: emailTemplate,
      });
      
      console.log('✅ Email sent successfully via Resend:');
      console.log('📋 Result:', JSON.stringify(result, null, 2));
      console.log('📧 To:', customerEmail);
      console.log('📧 Subject:', `¡Tu aventura "${bookingData.experienceTitle}" está confirmada! 🎉`);
      
      res.json({ success: true, messageId: result.data?.id || result.id, result });
    } catch (emailError) {
      console.error('❌ Resend error:', emailError);
      
      // For development - log the email content instead of failing
      console.log('📧 EMAIL WOULD BE SENT (Resend API key needed):');
      console.log('📧 To:', customerEmail);
      console.log('📧 From:', `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`);
      console.log('📧 Subject:', `¡Tu aventura "${bookingData.experienceTitle}" está confirmada! 🎉`);
      console.log('📧 Content: Email with booking details for', bookingData.experienceTitle);
      
      res.json({ 
        success: true, 
        messageId: 'dev-mode-' + Date.now(),
        note: 'Email logged to console (Resend API key needed)' 
      });
    }

  } catch (error) {
    console.error('Error in send-confirmation-email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
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

// Serve React app for any route that doesn't match API endpoints
// The static middleware above will handle this automatically

app.listen(PORT, () => {
  console.log(`🚀 Stripe backend running on http://localhost:${PORT}`);
  console.log('💳 Ready to process payments with Stripe');
  console.log('🧪 Use test card: 4242 4242 4242 4242');
});