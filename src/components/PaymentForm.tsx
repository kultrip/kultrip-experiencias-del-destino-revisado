import React, { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js';
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  bookingId: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function PaymentForm({
  bookingId,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment failed:', error);
        setMessage(error.message || 'Ocurrió un error durante el pago');
        onError?.(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        setPaymentSuccess(true);
        setMessage('¡Pago completado con éxito!');
        
        // Update booking status in your database
        await updateBookingStatus(bookingId, paymentIntent.id);
        
        onSuccess?.(paymentIntent.id);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error procesando el pago';
      setMessage(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, paymentIntentId: string) => {
    try {
      // TODO: Call your backend to update booking status
      const response = await fetch('/api/update-booking-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          paymentIntentId,
          status: 'paid',
        }),
      });

      if (!response.ok) {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 mb-4">
          <CheckCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Pago Completado!</h3>
        <p className="text-gray-600 mb-4">
          Tu reserva ha sido confirmada y procesada con éxito.
        </p>
        <p className="text-sm text-gray-500">
          Recibirás un email de confirmación en breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección de Facturación
        </label>
        <AddressElement 
          options={{
            mode: 'billing',
            fields: {
              phone: 'always',
            },
            validation: {
              phone: {
                required: 'never',
              },
            },
          }}
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Método de Pago
        </label>
        <div className="border border-gray-300 rounded-lg p-4">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {message && !paymentSuccess && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">{message}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Procesando Pago...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar Ahora
          </>
        )}
      </button>

      {/* Payment Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>
          Al hacer clic en "Pagar Ahora", aceptas nuestros términos y condiciones.
        </p>
        <p className="mt-1">
          Tu pago está protegido por encriptación SSL de 256 bits.
        </p>
      </div>
    </form>
  );
}