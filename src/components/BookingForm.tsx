// Enhanced booking component with sales logic
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Mail, Phone, User, AlertCircle, CheckCircle, Euro, Info } from 'lucide-react';
import { bookingService, BookingRequest, BookingValidation } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

interface BookingFormProps {
  experienceId: string;
  experienceTitle: string;
  basePrice?: number;
  minGroupSize?: number;
  minParticipants?: number;
  onBookingSuccess?: (bookingId: string) => void;
}

export default function BookingForm({ 
  experienceId, 
  minParticipants,
  onBookingSuccess 
}: BookingFormProps) {
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<BookingRequest>({
    experienceId,
    experienceDate: '',
    participants: minParticipants || 2,
    customerName: user ? `${user.firstName} ${user.lastName}` : '',
    customerEmail: user?.email || '',
    customerPhone: '',
    specialRequirements: '',
    bookingNotes: ''
  });

  // UI state
  const [validation, setValidation] = useState<BookingValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    pricePerPerson: number;
    totalAmount: number;
    effectiveParticipants: number;
  } | null>(null);

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Real-time validation when key fields change
  useEffect(() => {
    if (formData.experienceDate && formData.participants > 0 && formData.customerEmail.trim()) {
      validateBookingRequest();
    }
  }, [formData.experienceDate, formData.participants, formData.customerEmail]);

  // Calculate price when participants change
  useEffect(() => {
    if (formData.participants > 0) {
      calculatePrice();
    }
  }, [formData.participants]);

  const validateBookingRequest = async () => {
    if (!formData.experienceDate || formData.participants <= 0) return;
    
    setIsValidating(true);
    try {
      const result = await bookingService.validateBooking(formData);
      setValidation(result);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const calculatePrice = async () => {
    try {
      const result = await bookingService.calculatePrice(experienceId, formData.participants);
      if (!result.error) {
        setPriceBreakdown({
          pricePerPerson: result.pricePerPerson!,
          totalAmount: result.totalAmount!,
          effectiveParticipants: result.effectiveParticipants!
        });
      }
    } catch (error) {
      console.error('Price calculation error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants' ? parseInt(value) || 0 : value
    }));
    
    // Clear previous errors when user starts typing
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation || !validation.isValid) {
      setSubmitError('Por favor corrige los errores antes de enviar');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await bookingService.createBooking(formData);
      
      if (result.error) {
        setSubmitError(result.error);
      } else if (result.booking) {
        setSubmitSuccess(`¡Reserva creada exitosamente! Referencia: ${result.booking.id.slice(0, 8)}`);
        
        // Reset form
        setFormData({
          ...formData,
          experienceDate: '',
          participants: minParticipants || 2,
          specialRequirements: '',
          bookingNotes: ''
        });
        
        // Callback for parent component
        onBookingSuccess?.(result.booking.id);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError('Ocurrió un error inesperado. Por favor inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjustParticipants = (delta: number) => {
    const newCount = Math.max(1, Math.min(50, formData.participants + delta));
    setFormData(prev => ({ ...prev, participants: newCount }));
  };

  return (
    <div className="bg-orange-50 p-6 rounded-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Reservar experiencia</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Experience Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Fecha de la experiencia
          </label>
          <input
            type="date"
            name="experienceDate"
            value={formData.experienceDate}
            onChange={handleInputChange}
            min={minDate}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Número de participantes
          </label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3">
            <button
              type="button"
              onClick={() => adjustParticipants(-1)}
              className="text-orange-500 hover:text-orange-600 font-bold text-xl"
              disabled={formData.participants <= 1}
            >
              −
            </button>
            <span className="text-lg font-semibold">{formData.participants}</span>
            <button
              type="button"
              onClick={() => adjustParticipants(1)}
              className="text-orange-500 hover:text-orange-600 font-bold text-xl"
            >
              +
            </button>
          </div>
          
          {minParticipants && formData.participants < minParticipants && (
            <p className="text-sm text-amber-600 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Mínimo {minParticipants} participantes requeridos
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        {priceBreakdown && (
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Euro className="w-4 h-4 mr-2" />
              Desglose del precio
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Precio por persona:</span>
                <span>€{priceBreakdown.pricePerPerson.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Participantes:</span>
                <span>{formData.participants}</span>
              </div>
              {priceBreakdown.effectiveParticipants > formData.participants && (
                <div className="flex justify-between text-amber-600">
                  <span>Precio mínimo grupo ({priceBreakdown.effectiveParticipants}):</span>
                  <span>€{(priceBreakdown.pricePerPerson * priceBreakdown.effectiveParticipants).toFixed(2)}</span>
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-orange-600">€{priceBreakdown.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nombre completo
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requisitos especiales o comentarios
          </label>
          <textarea
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Alergias, necesidades de accesibilidad, solicitudes especiales..."
          />
        </div>

        {/* Validation Messages */}
        {validation && (
          <div className="space-y-2">
            {validation.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center text-red-800 font-medium mb-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Errores a corregir:
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validation.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center text-amber-800 font-medium mb-2">
                  <Info className="w-4 h-4 mr-2" />
                  Información importante:
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              {submitError}
            </div>
          </div>
        )}

        {/* Submit Success */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              {submitSuccess}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            isSubmitting || 
            isValidating || 
            !validation?.isValid || 
            !formData.experienceDate ||
            !formData.customerName ||
            !formData.customerEmail
          }
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
        >
          {isSubmitting ? 'Procesando...' : 'Crear reserva'}
        </button>

        <div className="text-xs text-gray-500 text-center">
          Al hacer la reserva, recibirás un email de confirmación. El pago se procesará en el siguiente paso.
        </div>
      </form>
    </div>
  );
}