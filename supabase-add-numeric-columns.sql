-- Add new numeric columns for group size and minimum participants
-- Run this SQL to add the new columns to the experiences table

-- Add the new columns (only if they don't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='min_group_size') THEN
        ALTER TABLE public.experiences ADD COLUMN min_group_size INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='min_participants') THEN
        ALTER TABLE public.experiences ADD COLUMN min_participants INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='price_per_person') THEN
        ALTER TABLE public.experiences ADD COLUMN price_per_person DECIMAL(10,2);
    END IF;
END $$;

-- Update the experiences with the extracted numeric values
-- Experience 1: "€300 pareja (€195 p.p.)" - 195 euros per person
UPDATE public.experiences 
SET min_group_size = 2, min_participants = NULL, price_per_person = 195.00
WHERE title = 'Los Atardeceres del Camino de Santiago (Fisterra)';

-- Experience 2: "Grupo €575 (mín. 10 personas)" - 57.50 euros per person (575/10)
UPDATE public.experiences 
SET min_group_size = 10, min_participants = 10, price_per_person = 57.50
WHERE title = 'Atardecer en la Ría de Arousa desde Pobra do Caramiñal';

-- Experience 3: "€90 por persona" - 90 euros per person
UPDATE public.experiences 
SET min_group_size = 1, min_participants = NULL, price_per_person = 90.00
WHERE title = 'Ruta Literaria en la Ribeira Sacra – "Todo esto te daré"';

-- Experience 4: "€490 por persona" - 490 euros per person
UPDATE public.experiences 
SET min_group_size = 2, min_participants = NULL, price_per_person = 490.00
WHERE title = 'De Paseo por las Rías Baixas, con Parada Michelín';

-- Experience 5: "€95 por persona" - 95 euros per person
UPDATE public.experiences 
SET min_group_size = 4, min_participants = 4, price_per_person = 95.00
WHERE title = 'Ruta por la Mariña Lucense';

-- Experience 6: "€75 por persona (mín. 2 personas)" - 75 euros per person
UPDATE public.experiences 
SET min_group_size = 2, min_participants = 2, price_per_person = 75.00
WHERE title = 'Ruta del Camino de Santiago (adaptada)';

-- Experience 7: "€55 por persona" - 55 euros per person
UPDATE public.experiences 
SET min_group_size = 1, min_participants = NULL, price_per_person = 55.00
WHERE title = 'Cata de Productos Autóctonos de Galicia';

-- Experience 8: "Consultar precio" - NULL (price on request)
UPDATE public.experiences 
SET min_group_size = 4, min_participants = 4, price_per_person = NULL
WHERE title = 'Ruta de Cata de Vino en Ribeira Sacra';

-- Experience 9: "€90 por persona (mín. 2 personas)" - 90 euros per person
UPDATE public.experiences 
SET min_group_size = 2, min_participants = 2, price_per_person = 90.00
WHERE title = 'Costa da Morte Mística';

-- Verify the updates
SELECT title, price, price_per_person, group_size, min_group_size, requirements, min_participants 
FROM public.experiences 
ORDER BY title;