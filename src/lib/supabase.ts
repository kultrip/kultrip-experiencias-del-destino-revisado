import { createClient } from '@supabase/supabase-js';

// Vite environment variables (prefixed with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone?: string;
          avatar?: string;
          date_of_birth?: string;
          nationality?: string;
          preferred_language: 'es' | 'en' | 'gl';
          role: 'traveler' | 'admin';
          status: 'active' | 'suspended' | 'pending_verification';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          phone?: string;
          avatar?: string;
          date_of_birth?: string;
          nationality?: string;
          preferred_language?: 'es' | 'en' | 'gl';
          role?: 'traveler' | 'admin';
          status?: 'active' | 'suspended' | 'pending_verification';
        };
        Update: {
          first_name?: string;
          last_name?: string;
          phone?: string;
          avatar?: string;
          date_of_birth?: string;
          nationality?: string;
          preferred_language?: 'es' | 'en' | 'gl';
          role?: 'traveler' | 'admin';
          status?: 'active' | 'suspended' | 'pending_verification';
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          interests: string[];
          budget_range: 'budget' | 'mid_range' | 'luxury' | 'ultra_luxury';
          group_size_preference: 'solo' | 'couple' | 'small_group' | 'large_group' | 'family';
          accessibility_needs: string[];
          bio?: string;
          location?: any;
          experience_level?: 'beginner' | 'intermediate' | 'expert';
          specializations: string[];
          created_at: string;
          updated_at: string;
        };
      };
      notification_preferences: {
        Row: {
          id: string;
          user_id: string;
          email_booking_confirmation: boolean;
          email_experience_recommendations: boolean;
          email_promotional_offers: boolean;
          email_experience_updates: boolean;
          email_social_activity: boolean;
          push_booking_reminders: boolean;
          push_last_minute_deals: boolean;
          push_weather_alerts: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      privacy_settings: {
        Row: {
          id: string;
          user_id: string;
          profile_visibility: 'public' | 'friends' | 'private';
          show_real_name: boolean;
          share_booking_history: boolean;
          allow_contact_from_providers: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          experience_id: string;
          booking_date: string;
          experience_date: string;
          participants: number;
          total_price: number;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
          special_requests?: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}