// Booking and Sales Service for Kultrip
// Handles all booking-related operations with business logic

import { supabase } from '../lib/supabase';

// Types for booking system
export interface BookingRequest {
  experienceId: string;
  experienceDate: string; // YYYY-MM-DD format
  participants: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequirements?: string;
  bookingNotes?: string;
}

export interface Booking {
  id: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  experienceId: string | null;
  experienceTitle: string;
  bookingDate: string;
  experienceDate: string;
  participants: number;
  pricePerPerson: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  bookingNotes?: string;
  specialRequirements?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  completedAt?: string;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed' 
  | 'paid'
  | 'cancelled'
  | 'completed'
  | 'refunded'
  | 'no_show';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partial_refund';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  paymentProvider?: string;
  externalPaymentId?: string;
  paymentDate?: string;
  failureReason?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  calculatedTotal: number;
  minimumParticipants?: number;
  pricePerPerson?: number;
}

class BookingService {
  // Validate booking request against experience requirements
  async validateBooking(request: BookingRequest): Promise<BookingValidation> {
    const validation: BookingValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      calculatedTotal: 0
    };

    try {
      // Get experience details
      const { data: experience, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', request.experienceId)
        .eq('status', 'active')
        .single();

      if (error || !experience) {
        validation.isValid = false;
        validation.errors.push('Experiencia no encontrada o no disponible');
        return validation;
      }

      // Check if experience has pricing
      if (!experience.price_per_person) {
        validation.isValid = false;
        validation.errors.push('Esta experiencia requiere cotización personalizada - por favor contáctanos');
        return validation;
      }

      validation.pricePerPerson = parseFloat(experience.price_per_person);

      // Check minimum participants requirement
      if (experience.min_participants && request.participants < experience.min_participants) {
        validation.isValid = false;
        validation.errors.push(
          `Se requiere un mínimo de ${experience.min_participants} participantes para esta experiencia`
        );
        validation.minimumParticipants = experience.min_participants;
      }

      // Check minimum group size for pricing
      const effectiveParticipants = Math.max(
        request.participants, 
        experience.min_group_size || 1
      );

      validation.calculatedTotal = validation.pricePerPerson * effectiveParticipants;

      // Add warning if charging for minimum group size
      if (experience.min_group_size && request.participants < experience.min_group_size) {
        validation.warnings.push(
          `Precio calculado para un grupo mínimo de ${experience.min_group_size} personas`
        );
      }

      // Validate date
      const experienceDate = new Date(request.experienceDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (experienceDate < today) {
        validation.isValid = false;
        validation.errors.push('La fecha de la experiencia no puede ser en el pasado');
      }

      // Check if date is too soon (less than 24 hours)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (experienceDate < tomorrow) {
        validation.warnings.push('Las reservas para mañana pueden requerir confirmación especial');
      }

      // Validate email format
      const email = request.customerEmail?.trim() || '';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!email) {
        validation.isValid = false;
        validation.errors.push('El email es obligatorio');
      } else if (!emailRegex.test(email)) {
        console.log('Email validation failed for:', email); // Debug log
        validation.isValid = false;
        validation.errors.push('Por favor proporciona una dirección de correo electrónico válida');
      }

      // Validate participants count
      if (request.participants < 1 || request.participants > 50) {
        validation.isValid = false;
        validation.errors.push('El número de participantes debe estar entre 1 y 50');
      }

    } catch (error) {
      console.error('Error validating booking:', error);
      validation.isValid = false;
      validation.errors.push('Error al validar la solicitud de reserva');
    }

    return validation;
  }

  // Create a new booking
  async createBooking(request: BookingRequest): Promise<{ booking?: Booking; error?: string }> {
    try {
      // First validate the booking
      const validation = await this.validateBooking(request);
      if (!validation.isValid) {
        return { error: validation.errors.join(', ') };
      }

      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();

      // Get experience title for snapshot
      const { data: experience } = await supabase
        .from('experiences')
        .select('title')
        .eq('id', request.experienceId)
        .single();

      // Create booking record
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user?.id || null,
          customer_name: request.customerName,
          customer_email: request.customerEmail,
          customer_phone: request.customerPhone,
          experience_id: request.experienceId,
          experience_title: experience?.title || 'Unknown Experience',
          booking_date: new Date().toISOString().split('T')[0],
          experience_date: request.experienceDate,
          participants: request.participants,
          price_per_person: validation.pricePerPerson!,
          total_amount: validation.calculatedTotal,
          currency: 'EUR',
          status: 'pending',
          booking_notes: request.bookingNotes,
          special_requirements: request.specialRequirements,
          created_by: user?.id || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        return { error: 'Error al crear la reserva' };
      }

      return { booking: this.mapBookingFromDB(booking) };

    } catch (error) {
      console.error('Error in createBooking:', error);
      return { error: 'Error inesperado al crear la reserva' };
    }
  }

  // Get bookings for current user
  async getUserBookings(): Promise<{ bookings?: Booking[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user bookings:', error);
        return { error: 'Error al obtener las reservas' };
      }

      const bookings = data.map(this.mapBookingFromDB);
      return { bookings };

    } catch (error) {
      console.error('Error in getUserBookings:', error);
      return { error: 'Error inesperado al obtener las reservas' };
    }
  }

  // Get all bookings (admin only)
  async getAllBookings(): Promise<{ bookings?: Booking[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('booking_summary')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all bookings:', error);
        return { error: 'Error al obtener las reservas' };
      }

      const bookings = data.map(this.mapBookingFromDB);
      return { bookings };

    } catch (error) {
      console.error('Error in getAllBookings:', error);
      return { error: 'Error inesperado al obtener las reservas' };
    }
  }

  // Update booking status (admin only)
  async updateBookingStatus(
    bookingId: string, 
    status: BookingStatus, 
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      // Add appropriate timestamp based on status
      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
        updateData.cancellation_reason = reason;
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        return { success: false, error: 'Error al actualizar el estado de la reserva' };
      }

      return { success: true };

    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      return { success: false, error: 'Error inesperado al actualizar la reserva' };
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    return this.updateBookingStatus(bookingId, 'cancelled', reason);
  }

  // Calculate total price for an experience
  async calculatePrice(experienceId: string, participants: number): Promise<{
    pricePerPerson?: number;
    totalAmount?: number;
    effectiveParticipants?: number;
    error?: string;
  }> {
    try {
      // Get experience details for price calculation
      const { data: experience, error } = await supabase
        .from('experiences')
        .select('price_per_person, min_group_size, min_participants')
        .eq('id', experienceId)
        .eq('status', 'active')
        .single();

      if (error || !experience) {
        console.error('Error fetching experience for pricing:', error);
        return { error: 'Experiencia no encontrada' };
      }

      // Check if experience has pricing
      if (!experience.price_per_person) {
        return { error: 'Esta experiencia requiere cotización personalizada - por favor contáctanos' };
      }

      const pricePerPerson = parseFloat(experience.price_per_person);
      
      // Calculate effective participants (considering minimum group size)
      const effectiveParticipants = Math.max(
        participants, 
        experience.min_group_size || 1
      );
      
      const totalAmount = pricePerPerson * effectiveParticipants;
      
      return {
        pricePerPerson,
        totalAmount,
        effectiveParticipants
      };

    } catch (error) {
      console.error('Error in calculatePrice:', error);
      return { error: 'Error inesperado al calcular el precio' };
    }
  }

  // Map database booking to frontend type
  private mapBookingFromDB(dbBooking: any): Booking {
    return {
      id: dbBooking.id,
      customerId: dbBooking.customer_id,
      customerName: dbBooking.customer_name,
      customerEmail: dbBooking.customer_email,
      customerPhone: dbBooking.customer_phone,
      experienceId: dbBooking.experience_id,
      experienceTitle: dbBooking.experience_title,
      bookingDate: dbBooking.booking_date,
      experienceDate: dbBooking.experience_date,
      participants: dbBooking.participants,
      pricePerPerson: parseFloat(dbBooking.price_per_person || '0'),
      totalAmount: parseFloat(dbBooking.total_amount || '0'),
      currency: dbBooking.currency || 'EUR',
      status: dbBooking.status || 'pending',
      bookingNotes: dbBooking.booking_notes,
      specialRequirements: dbBooking.special_requirements,
      createdAt: dbBooking.created_at,
      updatedAt: dbBooking.updated_at,
      cancelledAt: dbBooking.cancelled_at,
      completedAt: dbBooking.completed_at
    };
  }
}

export const bookingService = new BookingService();