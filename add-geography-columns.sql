-- Add geographical hierarchy columns to experiences table
-- This will enable filtering by country, state/region, and city

-- Add the new columns
ALTER TABLE public.experiences 
ADD COLUMN country TEXT DEFAULT 'España',
ADD COLUMN state TEXT,
ADD COLUMN city TEXT;

-- Update existing experiences with geographical data
-- Based on the current location data in the experiences

-- Fisterra experiences
UPDATE public.experiences 
SET state = 'Galicia', city = 'Fisterra'
WHERE title LIKE '%Fisterra%' OR location LIKE '%Fisterra%';

-- A Coruña province experiences
UPDATE public.experiences 
SET state = 'Galicia', city = 'A Pobra do Caramiñal'
WHERE title LIKE '%Pobra do Caramiñal%' OR location LIKE '%Pobra do Caramiñal%';

UPDATE public.experiences 
SET state = 'Galicia', city = 'Santiago de Compostela'
WHERE title LIKE '%Santiago%' OR location LIKE '%Santiago%';

UPDATE public.experiences 
SET state = 'Galicia', city = 'Mondoñedo'
WHERE title LIKE '%Mariña Lucense%' OR location LIKE '%Mondoñedo%';

UPDATE public.experiences 
SET state = 'Galicia', city = 'Muxía'
WHERE title LIKE '%Costa da Morte%' OR location LIKE '%Costa da Morte%';

-- Pontevedra province experiences  
UPDATE public.experiences 
SET state = 'Galicia', city = 'O Grove'
WHERE title LIKE '%Rías Baixas%' OR location LIKE '%O Grove%';

-- Lugo province experiences
UPDATE public.experiences 
SET state = 'Galicia', city = 'Ribeira Sacra'
WHERE title LIKE '%Ribeira Sacra%' OR location LIKE '%Ribeira Sacra%';

-- General Galicia experiences (where specific city isn't clear)
UPDATE public.experiences 
SET state = 'Galicia', city = 'Galicia'
WHERE state IS NULL AND (
  title LIKE '%Galicia%' OR 
  location LIKE '%Galicia%' OR 
  description LIKE '%gallego%' OR
  description LIKE '%Galicia%'
);

-- Set default state for any remaining null values
UPDATE public.experiences 
SET state = 'Galicia'
WHERE state IS NULL;

-- Set default city for any remaining null values
UPDATE public.experiences 
SET city = 'Galicia'
WHERE city IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_experiences_country ON public.experiences(country);
CREATE INDEX IF NOT EXISTS idx_experiences_state ON public.experiences(state);
CREATE INDEX IF NOT EXISTS idx_experiences_city ON public.experiences(city);

-- Add a composite index for geographical filtering
CREATE INDEX IF NOT EXISTS idx_experiences_geography ON public.experiences(country, state, city);

-- Verify the updates
SELECT 
  title,
  country,
  state, 
  city,
  location
FROM public.experiences 
ORDER BY state, city, title;