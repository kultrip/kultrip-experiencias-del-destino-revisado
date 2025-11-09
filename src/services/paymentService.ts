import { loadStripe, Stripe } from '@stripe/stripe-js';

// You'll need to set this environment variable
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.warn('Stripe publishable key not found. Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file');
      return null;
    }
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export interface PaymentData {
  amount: number; // Amount in cents
  currency: string;
  bookingId: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

// Payment service for handling Stripe integration
export class PaymentService {
  
  // Create payment intent on your backend
  static async createPaymentIntent(data: PaymentData): Promise<PaymentResult> {
    try {
      // TODO: This will call your backend API to create a Stripe Payment Intent
      // For now, we'll simulate the API call
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          bookingId: data.bookingId,
          customer: {
            email: data.customerEmail,
            name: data.customerName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();
      
      return {
        success: true,
        clientSecret,
        paymentIntentId,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  // Confirm payment and update booking status
  static async confirmPayment(paymentIntentId: string, bookingId: string): Promise<PaymentResult> {
    try {
      // TODO: This will call your backend to confirm the payment and update booking status
      const response = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          bookingId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      const result = await response.json();
      
      return {
        success: true,
        paymentIntentId,
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  // Convert euros to cents for Stripe
  static eurosToCents(euros: number): number {
    return Math.round(euros * 100);
  }

  // Convert cents to euros for display
  static centsToEuros(cents: number): number {
    return cents / 100;
  }
}