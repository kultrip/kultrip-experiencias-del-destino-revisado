-- Fix the missing price_per_person values
-- Run this SQL to correct the price per person data

-- Fix Cata de Productos Autóctonos: "€55 por persona" should be 55.00
UPDATE public.experiences 
SET price_per_person = 55.00 
WHERE title = 'Cata de Productos Autóctonos de Galicia';

-- Fix Costa da Morte Mística: "€90 por persona (mín. 2 personas)" should be 90.00  
UPDATE public.experiences 
SET price_per_person = 90.00 
WHERE title = 'Costa da Morte Mística';

-- Verify all price_per_person values are correct
SELECT title, price, price_per_person, min_group_size, min_participants
FROM public.experiences 
ORDER BY price_per_person ASC NULLS LAST;