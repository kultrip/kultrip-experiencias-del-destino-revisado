-- SQL to add experiences table to your existing Supabase schema
-- Run this in your Supabase SQL Editor

-- Create update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT,
  schedule TEXT,
  requirements TEXT,
  category TEXT NOT NULL CHECK (category IN ('sunset', 'gastronomy', 'literary', 'daytrips')),
  image TEXT NOT NULL,
  accessibility TEXT,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  category_name TEXT,
  group_size TEXT,
  includes TEXT[],
  itinerary JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_experiences_updated_at 
  BEFORE UPDATE ON public.experiences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Everyone can view active experiences
CREATE POLICY "Everyone can view active experiences" ON public.experiences
  FOR SELECT USING (status = 'active');

-- Admins can do everything with experiences
CREATE POLICY "Admins can manage all experiences" ON public.experiences
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_experiences_category ON public.experiences(category);
CREATE INDEX idx_experiences_status ON public.experiences(status);
CREATE INDEX idx_experiences_created_at ON public.experiences(created_at);

-- Insert the existing hardcoded experiences
INSERT INTO public.experiences (
  title, description, full_description, duration, price, location, schedule, requirements, 
  category, image, accessibility, rating, review_count, category_name, group_size, includes, itinerary
) VALUES 
(
  'Los Atardeceres del Camino de Santiago (Fisterra)',
  'Vive una experiencia mágica en el fin del mundo conocido. Este weekend en Fisterra combina relajación, naturaleza y tradición en un entorno único donde el Camino de Santiago encuentra su final simbólico.',
  'Descubre la magia del "Fin del Mundo" en esta experiencia única que combina la espiritualidad del Camino de Santiago con la belleza natural de la Costa da Morte. Durante tres días inolvidables, te alojarás en un hotel con spa donde podrás relajarte después de cada jornada de descubrimientos.\n\nEl punto culminante de la experiencia es el paseo en barco al atardecer, donde tendrás la oportunidad de avistar delfines en su hábitat natural mientras el sol se pone en el horizonte atlántico. La gastronomía local será protagonista con degustaciones de mariscos frescos y platos tradicionales gallegos.\n\nAdemás, visitarás el icónico Faro de Fisterra, conocerás las leyendas y tradiciones locales, y tendrás tiempo libre para explorar este pueblo marinero con su encanto auténtico.',
  '3 días (Vie-Dom)',
  '€300 pareja (€195 p.p.)',
  'Fisterra, A Coruña',
  null,
  'Disponible de Semana Santa a mediados de octubre',
  'sunset',
  'https://images.pexels.com/photos/4129287/pexels-photo-4129287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  null,
  4.9,
  87,
  'Atardeceres',
  'Grupos pequeños',
  ARRAY['Alojamiento 2 noches en hotel con spa', 'Paseo en barco al atardecer', 'Avistamiento de delfines', 'Degustación de mariscos', 'Visita al Faro de Fisterra', 'Guía especializado', 'Seguro de viaje'],
  '[
    {"time": "Viernes 18:00", "activity": "Llegada y check-in en hotel"},
    {"time": "19:30", "activity": "Cena de bienvenida con productos locales"},
    {"time": "Sábado 10:00", "activity": "Visita al Faro de Fisterra"},
    {"time": "12:00", "activity": "Tiempo libre en el pueblo"},
    {"time": "14:00", "activity": "Almuerzo con mariscos frescos"},
    {"time": "16:00", "activity": "Sesión de spa y relajación"},
    {"time": "19:00", "activity": "Paseo en barco al atardecer"},
    {"time": "Domingo 10:00", "activity": "Desayuno y check-out"},
    {"time": "11:00", "activity": "Última visita y despedida"}
  ]'::jsonb
),
(
  'Atardecer en la Ría de Arousa desde Pobra do Caramiñal',
  'Vive uno de los atardeceres más bellos de Galicia a bordo del emblemático barco Seijas, disfrutando de la brisa marina, frutos del mar locales y una experiencia pensada para todos, con accesibilidad total.',
  'Embárcate en una travesía mágica por la ría de Arousa, zarpando desde el puerto deportivo de Pobra do Caramiñal en el histórico barco Seijas, antaño dedicado al cultivo de mejillón. A medida que surcamos las aguas, descubrirás la historia marinera de la zona y admirarás la puesta de sol desde Punta Cabalo, antiguo faro emblemático. El barco está perfectamente adaptado para personas con movilidad reducida, garantizando comodidad y seguridad para todos los participantes. Durante la navegación, nuestra tripulación te ofrecerá una degustación de productos locales: mejillones de la ría, empanada gallega y vinos de la región, mientras disfrutas de la panorámica única sobre el mar. Aparcamiento gratuito y atención personalizada completan una experiencia ideal para grupos de amigos, familias y amantes de la naturaleza.',
  '~2 horas (salida 20:00, regreso 21:30)',
  'Grupo €575 (mín. 10 personas)',
  'Pobra do Caramiñal, Ría de Arousa, A Coruña',
  null,
  null,
  'sunset',
  'https://www.paxinasgalegas.es/imagenes/porto-deportivo-de-a-pobra-do-carami%c3%b1al-muport-sl_img688104t0.jpg',
  'Accesible para sillas de ruedas y movilidad reducida',
  null,
  null,
  'Atardeceres',
  'Grupo mínimo 10 personas',
  ARRAY['Paseo en barco por la ría de Arousa', 'Degustación de productos locales (mejillones, empanada, vino gallego)', 'Bebida incluida (agua, vino, cerveza)', 'Tripulación especializada', 'Accesibilidad para movilidad reducida', 'Aparcamiento gratuito en el puerto', 'Narración sobre historia y leyendas de la ría'],
  '[
    {"time": "20:00", "activity": "Recepción y embarque en el puerto deportivo"},
    {"time": "20:15", "activity": "Inicio de la navegación y presentación del barco Seijas"},
    {"time": "20:30", "activity": "Cruce de la ría, degustación de productos locales y bebidas"},
    {"time": "21:00", "activity": "Llegada a Punta Cabalo y observación del atardecer"},
    {"time": "21:15", "activity": "Regreso al puerto y cierre de la experiencia"}
  ]'::jsonb
);

-- Add more experiences (continuing with the rest)
INSERT INTO public.experiences (
  title, description, full_description, duration, price, location, requirements, 
  category, image, category_name, group_size, includes, itinerary
) VALUES 
(
  'Ruta Literaria en la Ribeira Sacra – "Todo esto te daré"',
  'Una inmersión en la literatura y el paisaje gallego: viñedos, bodegas, gastronomía, historia y arte en escenarios de novela.',
  'Explora la Ribeira Sacra de la mano de la novela "Todo esto te daré" de Dolores Redondo en una jornada que fusiona literatura, naturaleza y gastronomía. El recorrido comienza con la visita a viñedos y la bodega Vía Romana, donde degustarás vinos que forman parte de la historia de la novela. Nuestro guía te introducirá en el universo literario y en las tradiciones locales, mientras los paisajes de bosques y terrazas de viñas se despliegan ante ti. El almuerzo, servido en Playa da Cova, te permitirá saborear los platos más típicos de la región. Por la tarde, navega en catamarán por el río Miño, rodeado de viñedos y leyendas. La ruta finaliza con la visita a Santo Estevo de Ribas de Miño, joya del románico gallego, y la oportunidad de conversar con productores y artesanos locales. Una experiencia pensada para amantes de la literatura, el vino y la cultura gallega.',
  'Día completo (11:00 – tarde)',
  '€90 por persona',
  'Ribeira Sacra, Lugo',
  'Recomendable calzado cómodo y ropa de exterior',
  'literary',
  'https://images.pexels.com/photos/32666743/pexels-photo-32666743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'Literaria',
  'Grupo abierto',
  ARRAY['Visita guiada basada en la novela "Todo esto te daré"', 'Cata de 3 vinos en Bodega Vía Romana', 'Almuerzo tradicional en enclave natural', 'Paseo en catamarán por el río Miño', 'Visita a iglesia románica Santo Estevo de Ribas de Miño', 'Narración y contexto literario', 'Encuentro con viticultores y artesanos locales'],
  '[
    {"time": "11:00", "activity": "Recepción y presentación de la ruta literaria"},
    {"time": "11:30", "activity": "Visita a viñedos y Bodega Vía Romana con cata de vinos"},
    {"time": "13:30", "activity": "Almuerzo tradicional en Playa da Cova"},
    {"time": "16:00", "activity": "Paseo en catamarán por el río Miño y relatos literarios"},
    {"time": "17:30", "activity": "Visita a Santo Estevo de Ribas de Miño y charla con productores"},
    {"time": "18:30", "activity": "Cierre y despedida"}
  ]'::jsonb
);