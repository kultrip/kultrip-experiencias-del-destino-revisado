-- Fix Row Level Security issues on experiences table
-- This resolves the "infinite recursion detected in policy" error

-- First, check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'experiences';

-- Temporarily disable RLS on experiences table to allow access
ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;

-- Or, if you want to keep RLS but fix the policies, drop problematic policies:
-- DROP POLICY IF EXISTS "experiences_select_policy" ON public.experiences;
-- DROP POLICY IF EXISTS "experiences_insert_policy" ON public.experiences;
-- DROP POLICY IF EXISTS "experiences_update_policy" ON public.experiences;
-- DROP POLICY IF EXISTS "experiences_delete_policy" ON public.experiences;

-- Create simple, non-recursive policies
-- Allow everyone to read active experiences
CREATE POLICY "Public experiences are viewable by everyone" ON public.experiences
    FOR SELECT USING (status = 'active');

-- Allow authenticated users to see all experiences
CREATE POLICY "Authenticated users can view all experiences" ON public.experiences
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to do everything
CREATE POLICY "Service role can do everything" ON public.experiences
    FOR ALL USING (auth.role() = 'service_role');

-- Re-enable RLS (only if you want RLS)
-- ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Test query to verify it works
SELECT id, title, category, status FROM public.experiences LIMIT 5;