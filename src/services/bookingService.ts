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
        validation.errors.push('Experience not found or not available');
        return validation;
      }

      // Check if experience has pricing
      if (!experience.price_per_person) {
        validation.isValid = false;
        validation.errors.push('Experience requires custom pricing - please contact us');
        return validation;
      }

      validation.pricePerPerson = parseFloat(experience.price_per_person);

      // Check minimum participants requirement
      if (experience.min_participants && request.participants < experience.min_participants) {
        validation.isValid = false;
        validation.errors.push(
          `Minimum ${experience.min_participants} participants required for this experience`
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
          `Price calculated for minimum group size of ${experience.min_group_size} people`
        );
      }

      // Validate date
      const experienceDate = new Date(request.experienceDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (experienceDate < today) {
        validation.isValid = false;
        validation.errors.push('Experience date cannot be in the past');
      }

      // Check if date is too soon (less than 24 hours)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (experienceDate < tomorrow) {
        validation.warnings.push('Booking for tomorrow may require special confirmation');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.customerEmail)) {
        validation.isValid = false;
        validation.errors.push('Please provide a valid email address');
      }

      // Validate participants count
      if (request.participants < 1 || request.participants > 50) {
        validation.isValid = false;
        validation.errors.push('Number of participants must be between 1 and 50');
      }

    } catch (error) {
      console.error('Error validating booking:', error);
      validation.isValid = false;
      validation.errors.push('Error validating booking request');
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
        return { error: 'Failed to create booking' };
      }

      return { booking: this.mapBookingFromDB(booking) };

    } catch (error) {
      console.error('Error in createBooking:', error);
      return { error: 'Unexpected error creating booking' };
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
        return { error: 'Failed to fetch bookings' };
      }

      const bookings = data.map(this.mapBookingFromDB);
      return { bookings };

    } catch (error) {
      console.error('Error in getUserBookings:', error);
      return { error: 'Unexpected error fetching bookings' };
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
        return { error: 'Failed to fetch bookings' };
      }

      const bookings = data.map(this.mapBookingFromDB);
      return { bookings };

    } catch (error) {
      console.error('Error in getAllBookings:', error);
      return { error: 'Unexpected error fetching bookings' };
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
        return { success: false, error: 'Failed to update booking status' };
      }

      return { success: true };

    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      return { success: false, error: 'Unexpected error updating booking' };
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
      const { data, error } = await supabase
        .rpc('calculate_booking_total', {
          experience_uuid: experienceId,
          participant_count: participants
        });

      if (error) {
        console.error('Error calculating price:', error);
        return { error: 'Failed to calculate price' };
      }

      // Get experience details for breakdown
      const { data: experience } = await supabase
        .from('experiences')
        .select('price_per_person, min_group_size')
        .eq('id', experienceId)
        .single();

      if (!experience) {
        return { error: 'Experience not found' };
      }

      const pricePerPerson = parseFloat(experience.price_per_person || '0');
      const effectiveParticipants = Math.max(participants, experience.min_group_size || 1);
      
      return {
        pricePerPerson,
        totalAmount: parseFloat(data || '0'),
        effectiveParticipants
      };

    } catch (error) {
      console.error('Error in calculatePrice:', error);
      return { error: 'Unexpected error calculating price' };
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