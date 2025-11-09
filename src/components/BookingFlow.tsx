import React, { useState } from 'react';
import BookingForm from './BookingForm';
import PaymentPage from './PaymentPage';
import { CheckCircle, ArrowLeft, Calendar, CreditCard } from 'lucide-react';

interface BookingFlowProps {
  experienceId: string;
  experienceTitle: string;
  basePrice?: number;
  minGroupSize?: number;
  minParticipants?: number;
  onComplete?: () => void;
}

type FlowStep = 'booking' | 'payment' | 'confirmation';

interface BookingData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  experienceDate: string;
  participants: number;
}

export default function BookingFlow({
  experienceId,
  experienceTitle,
  basePrice,
  minGroupSize,
  minParticipants,
  onComplete,
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('booking');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleBookingSuccess = (bookingId: string, customerData?: any) => {
    // You'll need to get the booking details from your booking service
    // For now, we'll use mock data
    setBookingData({
      bookingId,
      customerName: customerData?.name || 'Cliente',
      customerEmail: customerData?.email || 'email@example.com',
      totalAmount: basePrice ? basePrice * (minParticipants || 2) : 100,
      experienceDate: customerData?.date || new Date().toISOString().split('T')[0],
      participants: customerData?.participants || 2,
    });
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentId(paymentIntentId);
    setCurrentStep('confirmation');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // You might want to show an error message or go back to booking
  };

  const handleBackToBooking = () => {
    setCurrentStep('booking');
    setBookingData(null);
  };

  const handleComplete = () => {
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 ${
            currentStep === 'booking' ? 'text-orange-600' : 
            currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'booking' ? 'bg-orange-100 border-2 border-orange-600' :
              currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-100 border-2 border-green-600' :
              'bg-gray-100 border-2 border-gray-300'
            }`}>
              {currentStep === 'payment' || currentStep === 'confirmation' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Calendar className="w-5 h-5" />
              )}
            </div>
            <span className="font-medium">Reserva</span>
          </div>

          <div className="w-12 h-0.5 bg-gray-300"></div>

          <div className={`flex items-center space-x-2 ${
            currentStep === 'payment' ? 'text-orange-600' :
            currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'payment' ? 'bg-orange-100 border-2 border-orange-600' :
              currentStep === 'confirmation' ? 'bg-green-100 border-2 border-green-600' :
              'bg-gray-100 border-2 border-gray-300'
            }`}>
              {currentStep === 'confirmation' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
            </div>
            <span className="font-medium">Pago</span>
          </div>

          <div className="w-12 h-0.5 bg-gray-300"></div>

          <div className={`flex items-center space-x-2 ${
            currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'confirmation' ? 'bg-green-100 border-2 border-green-600' :
              'bg-gray-100 border-2 border-gray-300'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="font-medium">Confirmación</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg">
        {currentStep === 'booking' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Reservar: {experienceTitle}
            </h2>
            <BookingForm
              experienceId={experienceId}
              experienceTitle={experienceTitle}
              basePrice={basePrice}
              minGroupSize={minGroupSize}
              minParticipants={minParticipants}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
        )}

        {currentStep === 'payment' && bookingData && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackToBooking}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Completar Pago
              </h2>
            </div>
            <PaymentPage
              bookingId={bookingData.bookingId}
              amount={bookingData.totalAmount}
              customerEmail={bookingData.customerEmail}
              customerName={bookingData.customerName}
              experienceTitle={experienceTitle}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        )}

        {currentStep === 'confirmation' && bookingData && paymentId && (
          <div className="p-6 text-center">
            <div className="text-green-500 mb-6">
              <CheckCircle className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Tu experiencia "{experienceTitle}" ha sido reservada y pagada con éxito.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Detalles de la Reserva:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>ID de Reserva:</strong> {bookingData.bookingId.slice(0, 8)}</p>
                <p><strong>Experiencia:</strong> {experienceTitle}</p>
                <p><strong>Cliente:</strong> {bookingData.customerName}</p>
                <p><strong>Email:</strong> {bookingData.customerEmail}</p>
                <p><strong>Fecha:</strong> {bookingData.experienceDate}</p>
                <p><strong>Participantes:</strong> {bookingData.participants}</p>
                <p><strong>Total Pagado:</strong> €{bookingData.totalAmount.toFixed(2)}</p>
                <p><strong>ID de Pago:</strong> {paymentId.slice(0, 20)}...</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Se ha enviado un email de confirmación con todos los detalles a {bookingData.customerEmail}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleComplete}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Continuar Explorando
                </button>
                <button
                  onClick={() => window.print()}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Imprimir Confirmación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}