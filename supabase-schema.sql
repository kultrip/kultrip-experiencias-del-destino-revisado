-- Supabase SQL Schema for Experiencias del Destino (EdD) Users
-- Run this in your Supabase SQL Editor

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  date_of_birth DATE,
  nationality TEXT,
  preferred_language TEXT DEFAULT 'es' CHECK (preferred_language IN ('es', 'en', 'gl')),
  role TEXT DEFAULT 'traveler' CHECK (role IN ('traveler', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interests TEXT[] DEFAULT '{}',
  budget_range TEXT DEFAULT 'mid_range' CHECK (budget_range IN ('budget', 'mid_range', 'luxury', 'ultra_luxury')),
  group_size_preference TEXT DEFAULT 'couple' CHECK (group_size_preference IN ('solo', 'couple', 'small_group', 'large_group', 'family')),
  accessibility_needs TEXT[] DEFAULT '{}',
  bio TEXT,
  location JSONB,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  specializations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_booking_confirmation BOOLEAN DEFAULT TRUE,
  email_experience_recommendations BOOLEAN DEFAULT TRUE,
  email_promotional_offers BOOLEAN DEFAULT TRUE,
  email_experience_updates BOOLEAN DEFAULT TRUE,
  email_social_activity BOOLEAN DEFAULT TRUE,
  push_booking_reminders BOOLEAN DEFAULT TRUE,
  push_last_minute_deals BOOLEAN DEFAULT TRUE,
  push_weather_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create privacy settings table
CREATE TABLE public.privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  show_experience_reviews BOOLEAN DEFAULT TRUE,
  data_processing_consent BOOLEAN DEFAULT TRUE,
  marketing_communications BOOLEAN DEFAULT TRUE,
  analytics_tracking BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id TEXT NOT NULL, -- References your experiences
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  experience_date DATE NOT NULL,
  participants INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user reviews table
CREATE TABLE public.user_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  helpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user wishlist table
CREATE TABLE public.user_wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, experience_id)
);

-- Functions to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nuevo')
  );

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.privacy_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Row Level Security Policies
-- User profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can see all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own privacy" ON public.privacy_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookings" ON public.bookings
  FOR ALL USING (auth.uid() = user_id);

-- Admins can see all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can manage own reviews" ON public.user_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" ON public.user_wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_user_reviews_experience_id ON public.user_reviews(experience_id);
CREATE INDEX idx_user_wishlist_user_id ON public.user_wishlist(user_id);

-- Function to update user role to admin
CREATE OR REPLACE FUNCTION update_user_role(
  target_user_id uuid,
  new_role text DEFAULT 'admin'
) RETURNS void AS $$
BEGIN
  -- Validate role
  IF new_role NOT IN ('traveler', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be traveler or admin';
  END IF;

  -- Only allow existing admins to create new admins (or allow if no admins exist yet)
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) AND EXISTS (
    SELECT 1 FROM user_profiles WHERE role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can update user roles';
  END IF;

  UPDATE user_profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wishlist ENABLE ROW LEVEL SECURITY;