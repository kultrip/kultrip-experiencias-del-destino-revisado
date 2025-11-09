import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../services/paymentService';
import PaymentForm from './PaymentForm';
import { CreditCard, Shield, Lock, CheckCircle } from 'lucide-react';

interface PaymentPageProps {
  bookingId: string;
  amount: number; // in euros
  customerEmail: string;
  customerName: string;
  experienceTitle: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentPage({
  bookingId,
  amount,
  customerEmail,
  customerName,
  experienceTitle,
  onPaymentSuccess,
  onPaymentError,
}: PaymentPageProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stripePromise = getStripe();

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [bookingId, amount]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      
      // TODO: Call your backend API to create payment intent
      // For now, we'll simulate this
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'eur',
          bookingId,
          customer: {
            email: customerEmail,
            name: customerName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();
      setClientSecret(client_secret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating payment';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#f97316', // Orange theme to match your site
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret: clientSecret || '',
    appearance,
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Preparando el pago...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error en el Pago</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={createPaymentIntent}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración de Pago</h3>
            <p className="text-gray-600">
              El sistema de pagos no está configurado. Contacta con el administrador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">Finalizar Pago</h2>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Resumen del Pedido</h3>
          <div className="text-sm text-gray-600 mb-4">
            <p><strong>Experiencia:</strong> {experienceTitle}</p>
            <p><strong>Cliente:</strong> {customerName}</p>
            <p><strong>Email:</strong> {customerEmail}</p>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-orange-600">€{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <PaymentForm
                bookingId={bookingId}
                onSuccess={onPaymentSuccess}
                onError={onPaymentError}
              />
            </Elements>
          )}
        </div>

        {/* Security Info */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              <Lock className="w-4 h-4 mr-2 text-green-500" />
              <span>Pago seguro procesado por Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}