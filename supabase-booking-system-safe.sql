-- Safe Booking and Sales System Schema for Kultrip
-- This version checks for existing tables and only creates what's missing

-- Create booking status enum (safe)
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'pending',           -- Initial booking, awaiting confirmation
        'confirmed',         -- Booking confirmed, awaiting payment
        'paid',             -- Payment completed
        'cancelled',        -- Cancelled by customer or admin
        'completed',        -- Experience completed
        'refunded',         -- Payment refunded
        'no_show'           -- Customer didn't show up
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create payment status enum (safe)
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',          -- Payment not yet processed
        'processing',       -- Payment being processed
        'completed',        -- Payment successful
        'failed',          -- Payment failed
        'cancelled',       -- Payment cancelled
        'refunded',        -- Payment refunded
        'partial_refund'   -- Partial refund issued
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create payment method enum (safe)
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'credit_card',
        'debit_card', 
        'paypal',
        'bank_transfer',
        'cash',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create bookings table only if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Customer info
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Experience details
    experience_id UUID REFERENCES public.experiences(id) ON DELETE SET NULL,
    experience_title TEXT NOT NULL, -- Snapshot in case experience is deleted
    
    -- Booking details
    booking_date DATE NOT NULL,
    experience_date DATE NOT NULL,
    participants INTEGER NOT NULL CHECK (participants > 0),
    
    -- Pricing
    price_per_person DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    
    -- Status and metadata
    status booking_status DEFAULT 'pending',
    booking_notes TEXT,
    special_requirements TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Admin fields
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    cancelled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    cancellation_reason TEXT
);

-- Create payments table only if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Booking reference
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    
    -- External payment system references
    payment_provider TEXT, -- 'stripe', 'paypal', etc.
    external_payment_id TEXT, -- Transaction ID from payment provider
    
    -- Payment metadata
    payment_date TIMESTAMPTZ,
    failure_reason TEXT,
    refund_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Processing info
    processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add columns to user_profiles if they don't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[];
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS medical_conditions TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_booking_date DATE;

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at (safe - will replace if exists)
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON public.payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;

-- Customers can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = customer_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Customers can create their own bookings
CREATE POLICY "Users can create own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Only admins can update bookings (status changes, etc.)
CREATE POLICY "Admins can manage all bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Row Level Security for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;

-- Users can view payments for their bookings
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE id = payments.booking_id AND customer_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Only system/admins can insert payments
CREATE POLICY "Admins can manage payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for better performance (safe - will not error if exist)
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience ON public.bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(experience_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON public.payments(payment_date);

-- Function to calculate total booking amount
CREATE OR REPLACE FUNCTION calculate_booking_total(
    experience_uuid UUID,
    participant_count INTEGER
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    base_price DECIMAL(10,2);
    min_group INTEGER;
    total_amount DECIMAL(10,2);
BEGIN
    -- Get experience pricing
    SELECT price_per_person, min_group_size 
    INTO base_price, min_group
    FROM public.experiences 
    WHERE id = experience_uuid;
    
    -- If no price per person, return 0 (requires manual pricing)
    IF base_price IS NULL THEN
        RETURN 0.00;
    END IF;
    
    -- Calculate total
    total_amount := base_price * participant_count;
    
    -- Apply minimum group pricing if needed
    IF min_group IS NOT NULL AND participant_count < min_group THEN
        total_amount := base_price * min_group;
    END IF;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to update customer statistics
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer stats when booking is completed or paid
    IF NEW.status IN ('completed', 'paid') AND (OLD.status IS NULL OR OLD.status NOT IN ('completed', 'paid')) THEN
        UPDATE public.user_profiles 
        SET 
            total_bookings = COALESCE(total_bookings, 0) + 1,
            total_spent = COALESCE(total_spent, 0) + NEW.total_amount,
            last_booking_date = NEW.experience_date
        WHERE id = NEW.customer_id;
    END IF;
    
    -- Reverse stats if booking is cancelled after being completed
    IF NEW.status = 'cancelled' AND OLD.status IN ('completed', 'paid') THEN
        UPDATE public.user_profiles 
        SET 
            total_bookings = GREATEST(COALESCE(total_bookings, 1) - 1, 0),
            total_spent = GREATEST(COALESCE(total_spent, NEW.total_amount) - NEW.total_amount, 0)
        WHERE id = NEW.customer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for customer stats (safe)
DROP TRIGGER IF EXISTS update_customer_stats_trigger ON public.bookings;
CREATE TRIGGER update_customer_stats_trigger
    AFTER UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- View for booking summary with experience and payment info
CREATE OR REPLACE VIEW booking_summary AS
SELECT 
    b.id,
    b.customer_id,
    b.customer_name,
    b.customer_email,
    b.customer_phone,
    b.experience_id,
    b.experience_title,
    e.category,
    e.category_name,
    e.duration,
    e.location,
    b.booking_date,
    b.experience_date,
    b.participants,
    b.price_per_person,
    b.total_amount,
    b.currency,
    b.status as booking_status,
    b.booking_notes,
    b.special_requirements,
    b.created_at,
    b.updated_at,
    -- Payment info
    p.status as payment_status,
    p.payment_method,
    p.payment_date,
    p.external_payment_id
FROM public.bookings b
LEFT JOIN public.experiences e ON b.experience_id = e.id
LEFT JOIN public.payments p ON b.id = p.booking_id AND p.status = 'completed';

-- Success message
SELECT 'Booking system schema updated successfully!' as result;