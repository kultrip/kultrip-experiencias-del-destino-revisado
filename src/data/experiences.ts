import { Experience } from '../components/ExperienceCard';

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Los Atardeceres del Camino de Santiago (Fisterra)',
    description: 'Vive una experiencia mágica en el fin del mundo conocido. Este weekend en Fisterra combina relajación, naturaleza y tradición en un entorno único donde el Camino de Santiago encuentra su final simbólico.',
    fullDescription: 'Descubre la magia del "Fin del Mundo" en esta experiencia única que combina la espiritualidad del Camino de Santiago con la belleza natural de la Costa da Morte. Durante tres días inolvidables, te alojarás en un hotel con spa donde podrás relajarte después de cada jornada de descubrimientos.\n\nEl punto culminante de la experiencia es el paseo en barco al atardecer, donde tendrás la oportunidad de avistar delfines en su hábitat natural mientras el sol se pone en el horizonte atlántico. La gastronomía local será protagonista con degustaciones de mariscos frescos y platos tradicionales gallegos.\n\nAdemás, visitarás el icónico Faro de Fisterra, conocerás las leyendas y tradiciones locales, y tendrás tiempo libre para explorar este pueblo marinero con su encanto auténtico.',
    duration: '3 días (Vie-Dom)',
    price: '€300 pareja (€195 p.p.)',
    category: 'sunset',
    requirements: 'Disponible de Semana Santa a mediados de octubre',
    image: 'https://images.pexels.com/photos/4129287/pexels-photo-4129287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.9,
    reviewCount: 87,
    categoryName: 'Atardeceres',
    location: 'Fisterra, A Coruña',
    groupSize: 'Grupos pequeños',
    includes: [
      'Alojamiento 2 noches en hotel con spa',
      'Paseo en barco al atardecer',
      'Avistamiento de delfines',
      'Degustación de mariscos',
      'Visita al Faro de Fisterra',
      'Guía especializado',
      'Seguro de viaje'
    ],
    itinerary: [
      { time: 'Viernes 18:00', activity: 'Llegada y check-in en hotel' },
      { time: '19:30', activity: 'Cena de bienvenida con productos locales' },
      { time: 'Sábado 10:00', activity: 'Visita al Faro de Fisterra' },
      { time: '12:00', activity: 'Tiempo libre en el pueblo' },
      { time: '14:00', activity: 'Almuerzo con mariscos frescos' },
      { time: '16:00', activity: 'Sesión de spa y relajación' },
      { time: '19:00', activity: 'Paseo en barco al atardecer' },
      { time: 'Domingo 10:00', activity: 'Desayuno y check-out' },
      { time: '11:00', activity: 'Última visita y despedida' }
    ]
  },
  {
    id: '2',
    title: 'Atardecer en la Ría de Arousa desde Pobra do Caramiñal',
    description: 'Vive uno de los atardeceres más bellos de Galicia a bordo del emblemático barco Seijas, disfrutando de la brisa marina, frutos del mar locales y una experiencia pensada para todos, con accesibilidad total.',
    fullDescription: 'Embárcate en una travesía mágica por la ría de Arousa, zarpando desde el puerto deportivo de Pobra do Caramiñal en el histórico barco Seijas, antaño dedicado al cultivo de mejillón. A medida que surcamos las aguas, descubrirás la historia marinera de la zona y admirarás la puesta de sol desde Punta Cabalo, antiguo faro emblemático. El barco está perfectamente adaptado para personas con movilidad reducida, garantizando comodidad y seguridad para todos los participantes. Durante la navegación, nuestra tripulación te ofrecerá una degustación de productos locales: mejillones de la ría, empanada gallega y vinos de la región, mientras disfrutas de la panorámica única sobre el mar. Aparcamiento gratuito y atención personalizada completan una experiencia ideal para grupos de amigos, familias y amantes de la naturaleza.',
    duration: '~2 horas (salida 20:00, regreso 21:30)',
    price: 'Grupo €575 (mín. 10 personas)',
    category: 'sunset',
    categoryName: 'Atardeceres',
    location: 'Pobra do Caramiñal, Ría de Arousa, A Coruña',
    groupSize: 'Grupo mínimo 10 personas',
    accessibility: 'Accesible para sillas de ruedas y movilidad reducida',
    image: 'https://www.paxinasgalegas.es/imagenes/porto-deportivo-de-a-pobra-do-carami%c3%b1al-muport-sl_img688104t0.jpg',
    includes: [
      'Paseo en barco por la ría de Arousa',
      'Degustación de productos locales (mejillones, empanada, vino gallego)',
      'Bebida incluida (agua, vino, cerveza)',
      'Tripulación especializada',
      'Accesibilidad para movilidad reducida',
      'Aparcamiento gratuito en el puerto',
      'Narración sobre historia y leyendas de la ría'
    ],
    itinerary: [
      { time: '20:00', activity: 'Recepción y embarque en el puerto deportivo' },
      { time: '20:15', activity: 'Inicio de la navegación y presentación del barco Seijas' },
      { time: '20:30', activity: 'Cruce de la ría, degustación de productos locales y bebidas' },
      { time: '21:00', activity: 'Llegada a Punta Cabalo y observación del atardecer' },
      { time: '21:15', activity: 'Regreso al puerto y cierre de la experiencia' }
    ]
  },
  {
    id: '3',
    title: 'Ruta Literaria en la Ribeira Sacra – "Todo esto te daré"',
    description: 'Una inmersión en la literatura y el paisaje gallego: viñedos, bodegas, gastronomía, historia y arte en escenarios de novela.',
    fullDescription: 'Explora la Ribeira Sacra de la mano de la novela "Todo esto te daré" de Dolores Redondo en una jornada que fusiona literatura, naturaleza y gastronomía. El recorrido comienza con la visita a viñedos y la bodega Vía Romana, donde degustarás vinos que forman parte de la historia de la novela. Nuestro guía te introducirá en el universo literario y en las tradiciones locales, mientras los paisajes de bosques y terrazas de viñas se despliegan ante ti. El almuerzo, servido en Playa da Cova, te permitirá saborear los platos más típicos de la región. Por la tarde, navega en catamarán por el río Miño, rodeado de viñedos y leyendas. La ruta finaliza con la visita a Santo Estevo de Ribas de Miño, joya del románico gallego, y la oportunidad de conversar con productores y artesanos locales. Una experiencia pensada para amantes de la literatura, el vino y la cultura gallega.',
    duration: 'Día completo (11:00 – tarde)',
    price: '€90 por persona',
    category: 'literary',
    categoryName: 'Literaria',
    location: 'Ribeira Sacra, Lugo',
    groupSize: 'Grupo abierto',
    requirements: 'Recomendable calzado cómodo y ropa de exterior',
    image: 'https://images.pexels.com/photos/32666743/pexels-photo-32666743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includes: [
      'Visita guiada basada en la novela "Todo esto te daré"',
      'Cata de 3 vinos en Bodega Vía Romana',
      'Almuerzo tradicional en enclave natural',
      'Paseo en catamarán por el río Miño',
      'Visita a iglesia románica Santo Estevo de Ribas de Miño',
      'Narración y contexto literario',
      'Encuentro con viticultores y artesanos locales'
    ],
    itinerary: [
      { time: '11:00', activity: 'Recepción y presentación de la ruta literaria' },
      { time: '11:30', activity: 'Visita a viñedos y Bodega Vía Romana con cata de vinos' },
      { time: '13:30', activity: 'Almuerzo tradicional en Playa da Cova' },
      { time: '16:00', activity: 'Paseo en catamarán por el río Miño y relatos literarios' },
      { time: '17:30', activity: 'Visita a Santo Estevo de Ribas de Miño y charla con productores' },
      { time: '18:30', activity: 'Cierre y despedida' }
    ]
  },
  {
    id: '4',
    title: 'De Paseo por las Rías Baixas, con Parada Michelín',
    description: 'Un fin de semana de placer gastronómico y relax en las Rías Baixas, con alojamiento superior y la mejor cocina gallega en restaurantes con estrella Michelin.',
    fullDescription: 'Descubre el lado más exclusivo de las Rías Baixas con una experiencia gastro-relax diseñada para los paladares más exigentes. Dos noches en el Hotel Spa Norat O Grove 3* Superior te esperan, con acceso diario al circuito termal y desayuno buffet. El punto culminante será una comida o cena en uno de los restaurantes gallegos con estrella Michelin, como Culler de Pau o Pepe Vieira, donde cada plato es una obra de arte que fusiona tradición y creatividad. Además, tendrás tiempo para disfrutar de la costa, pasear por O Grove y dejarte mimar por el entorno y los servicios del hotel. Un viaje ideal para parejas, foodies y amantes del bienestar.',
    duration: '3 días / 2 noches',
    price: '€490 por persona',
    category: 'gastronomy',
    categoryName: 'Gastronomía',
    location: 'O Grove, Pontevedra',
    groupSize: 'Grupos pequeños, ideal parejas',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includes: [
      '2 noches en Hotel Spa Norat O Grove 3* Superior',
      'Desayuno buffet diario',
      'Acceso al circuito termal cada día',
      'Menú degustación en restaurante Michelin (Culler de Pau o Pepe Vieira)',
      'Seguro de viaje y asistencia',
      'Asesoría personalizada para experiencias gastronómicas'
    ],
    itinerary: [
      { time: 'Día 1 - 16:00', activity: 'Check-in y bienvenida en el hotel, circuito termal' },
      { time: 'Día 2 - Mañana', activity: 'Desayuno y tiempo libre para explorar O Grove' },
      { time: 'Día 2 - 13:30', activity: 'Comida o cena en restaurante Michelin seleccionado' },
      { time: 'Día 2 - Tarde', activity: 'Relax en el spa y paseo costero' },
      { time: 'Día 3 - 08:00', activity: 'Desayuno y check-out, cierre de la experiencia' }
    ]
  },
  {
    id: '5',
    title: 'Ruta por la Mariña Lucense',
    description: 'Una excursión completa por los tesoros naturales y culturales de la costa lucense: monumentos, historia, gastronomía y arquitectura indiana en un solo día.',
    fullDescription: 'Adéntrate en la Mariña Lucense con una ruta pensada para explorar sus maravillas naturales y culturales. El día comienza con la visita a la Playa de las Catedrales, Monumento Natural famoso por sus imponentes arcos y formaciones rocosas, accesible solo con marea baja. Continuamos hacia Mondoñedo, localidad histórica con su catedral del siglo XIII, calles empedradas y leyendas de escritores y emigrantes ilustres. El almuerzo en Ribadeo te permitirá degustar los sabores locales antes de pasear por el centro histórico y admirar la arquitectura indiana, con la Torre de los Moreno como joya modernista. Todo el viaje es guiado por expertos y el transporte está incluido desde Lugo o Santiago. Perfecto para grupos y familias, con opción de alternativas si no se alcanza el mínimo de participantes.',
    duration: '10 horas (salida 10:00, regreso 20:00)',
    price: '€95 por persona',
    category: 'daytrips',
    categoryName: 'Excursiones',
    location: 'Mariña Lucense (Mondoñedo, Playa de las Catedrales, Ribadeo)',
    groupSize: 'Grupos de 4+, ideal familias',
    requirements: 'Requiere mín. 4 participantes',
    image: 'https://images.pexels.com/photos/13683723/pexels-photo-13683723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includes: [
      'Transporte desde Lugo/Santiago',
      'Visitas guiadas por expertos locales',
      'Entrada y visita a la Playa de las Catedrales',
      'Visita a la Catedral y casco histórico de Mondoñedo',
      'Almuerzo típico en Ribadeo',
      'Recorrido por arquitectura indiana y Torre de los Moreno',
      'Narración histórica y cultural',
      'Alternativas garantizadas si no se alcanza el mínimo de participantes'
    ],
    itinerary: [
      { time: '10:00', activity: 'Salida desde Lugo/Santiago y bienvenida' },
      { time: '11:30', activity: 'Visita guiada a Playa de las Catedrales' },
      { time: '13:00', activity: 'Ruta por Mondoñedo y su catedral' },
      { time: '14:30', activity: 'Almuerzo típico en Ribadeo' },
      { time: '16:00', activity: 'Recorrido por el centro histórico y arquitectura indiana' },
      { time: '18:30', activity: 'Tiempo libre y recomendaciones locales' },
      { time: '20:00', activity: 'Regreso y cierre de la excursión' }
    ]
  },
  {
    id: '6',
    title: 'Ruta del Camino de Santiago (adaptada)',
    description: 'Una introducción guiada al Camino de Santiago, con recorrido a pie, historia, cultura y visita a la Catedral de Santiago en grupo reducido.',
    fullDescription: 'Descubre la esencia del Camino de Santiago en una experiencia adaptada para grupos pequeños y personas que deseen vivir la tradición jacobea de manera cómoda y guiada. El tour abarca 5 km de recorrido a pie por los últimos tramos del Camino, acompañado de explicaciones sobre la historia, las leyendas y el significado del peregrinaje. La visita a la Catedral de Santiago es el broche final, con posibilidad de ampliar la experiencia añadiendo la entrada al Pórtico de la Gloria (opcional y sujeto a disponibilidad). Nuestro guía especializado te ayudará a comprender el valor cultural y espiritual del Camino, y te dará indicaciones para aprovechar al máximo tu visita a la ciudad. Ideal para quienes buscan una experiencia auténtica y personalizada.',
    duration: 'Medio día (09:00 a 13:00)',
    price: '€75 por persona (mín. 2 personas)',
    category: 'daytrips',
    categoryName: 'Camino de Santiago',
    location: 'Santiago de Compostela, A Coruña',
    groupSize: 'Grupos mínimos de 2, ideal familias o amigos',
    requirements: 'Mín. 2 personas',
    image: 'https://images.pexels.com/photos/11690243/pexels-photo-11690243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includes: [
      'Recorrido guiado de 5 km por el Camino de Santiago',
      'Historia y contexto cultural del peregrinaje',
      'Visita a la Catedral de Santiago (Pórtico de la Gloria opcional)',
      'Guía especializado en la ruta y la ciudad',
      'Recomendaciones para explorar Santiago de Compostela'
    ],
    itinerary: [
      { time: '09:00', activity: 'Recepción y comienzo del recorrido a pie' },
      { time: '10:30', activity: 'Parada en puntos de interés histórico y cultural' },
      { time: '12:00', activity: 'Visita guiada a la Catedral de Santiago' },
      { time: '13:00', activity: 'Cierre y despedida, recomendaciones locales' }
    ]
  },
  {
    id: '7',
    title: 'Cata de Productos Autóctonos de Galicia',
    description: 'Descubre los sabores auténticos de Galicia con una cata guiada de quesos, vinos y productos del mar, visitando productores locales y aprendiendo los secretos de la gastronomía gallega.',
    fullDescription: 'Sumérgete en una experiencia gastronómica única que te llevará a descubrir los sabores más auténticos de Galicia. En esta cata de productos autóctonos, tendrás la oportunidad de degustar una cuidada selección de quesos artesanales elaborados por maestros queseros locales, vinos con denominación de origen de las mejores bodegas gallegas y productos del mar frescos que reflejan la rica tradición marinera de la región.\n\nNuestro guía experto te acompañará durante todo el recorrido, compartiendo historias fascinantes sobre la tradición culinaria gallega, los métodos de elaboración ancestrales y los secretos mejor guardados de cada producto. La experiencia incluye visitas a productores locales, donde podrás conocer de primera mano los procesos de elaboración y hablar directamente con los artesanos.\n\nAdemás de la degustación, aprenderás sobre el maridaje perfecto entre vinos y quesos, las características únicas del terroir gallego, y cómo identificar productos de calidad. La experiencia culmina con una degustación especial de productos del mar, incluyendo percebes, mejillones de las rías gallegas y pulpo á feira preparado según la receta tradicional.',
    duration: '3 horas (10:00 a 13:00)',
    price: '€55 por persona',
    category: 'gastronomy',
    categoryName: 'Gastronomía',
    location: 'Galicia (consultar ubicación exacta)',
    groupSize: 'Grupos abiertos',
    image: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includes: [
      'Degustación de 8 quesos artesanales diferentes',
      'Cata de 4 vinos con D.O. Rías Baixas y Ribeiro',
      'Productos del mar frescos (percebes, mejillones, pulpo á feira)',
      'Guía gastronómico especializado',
      'Visita a quesería tradicional',
      'Material de cata profesional',
      'Certificado de participación'
    ],
    itinerary: [
      { time: '10:00', activity: 'Recepción y bienvenida' },
      { time: '10:15', activity: 'Introducción a la gastronomía gallega' },
      { time: '10:45', activity: 'Cata de quesos artesanales' },
      { time: '11:30', activity: 'Degustación de vinos D.O.' },
      { time: '12:15', activity: 'Visita a productores locales' },
      { time: '12:45', activity: 'Productos del mar y maridajes' },
      { time: '13:00', activity: 'Cierre y despedida' }
    ]
  },
  {
    id: '8',
    title: 'Ruta de Cata de Vino en Ribeira Sacra',
    description: 'Explora el mágico mundo del vino gallego: navegación en catamarán, visitas a bodegas, catas guiadas y gastronomía local en los paisajes únicos de la Ribeira Sacra.',
    fullDescription: 'Adéntrate en el universo vinícola de la Ribeira Sacra con una ruta completa que combina naturaleza, cultura y enología. La experiencia comienza con la salida de Santiago y la llegada al embarcadero de Doade, donde embarcarás en un catamarán para navegar por el río Miño y admirar los viñedos en terrazas y los cañones fluviales. La primera parada será la Adega Vella, donde degustarás 4 vinos y conocerás los secretos de la viticultura heroica gallega. Tras el almuerzo típico en restaurante de la zona, visitarás el castillo de Castro Caldelas, testigo de la historia medieval gallega. La jornada culmina en la bodega Ponte da Boga, con una cata de 3 vinos y explicación sobre el terroir único de la Ribeira Sacra. Una experiencia diseñada para amantes del vino y la naturaleza, con guía especializado y opción de personalización según intereses del grupo.',
    duration: 'Día completo (09:00 – 18:30)',
    price: 'Consultar precio',
    category: 'gastronomy',
    categoryName: 'Enoturismo',
    location: 'Ribeira Sacra, Lugo',
    groupSize: 'Grupos mínimos de 4, ideal enoturistas',
    requirements: 'Requiere mín. 4 participantes',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includes: [
      'Paseo en catamarán por el río Miño y visita a viñedos',
      'Visita y cata en Adega Vella (4 vinos)',
      'Almuerzo típico gallego',
      'Visita guiada al castillo de Castro Caldelas',
      'Visita y cata en Ponte da Boga (3 vinos)',
      'Guía especializado en enoturismo',
      'Narración sobre historia y cultura vitivinícola',
      'Alternativas garantizadas si no se alcanza el mínimo de participantes'
    ],
    itinerary: [
      { time: '09:00', activity: 'Salida de Santiago de Compostela y recepción' },
      { time: '11:30', activity: 'Paseo en catamarán por el río Miño y explicación de los viñedos' },
      { time: '13:30', activity: 'Visita y cata en Adega Vella (4 vinos)' },
      { time: '14:30', activity: 'Almuerzo tradicional en restaurante local' },
      { time: '16:00', activity: 'Visita guiada al castillo de Castro Caldelas' },
      { time: '17:30', activity: 'Visita y cata en Ponte da Boga (3 vinos)' },
      { time: '18:30', activity: 'Regreso a Santiago y cierre de la experiencia' }
    ]
  },
  {
    id: '9',
    title: 'Costa da Morte Mística',
    description: 'Recorre la legendaria Costa da Morte visitando sus faros más emblemáticos y descubriendo las leyendas que envuelven este litoral mágico.',
    fullDescription: 'Descubre los misterios y leyendas de la Costa da Morte en una jornada completa que te llevará por algunos de los paisajes más dramáticos y espirituales de Galicia. Esta ruta te permitirá visitar tres faros emblemáticos, cada uno con su propia historia y personalidad única.\n\nComenzarás en Cabo Vilán, el primer faro eléctrico de España, continuarás hacia Muxía con su santuario y las piedras sagradas, y terminarás en Finisterre, el mítico "fin del mundo" donde los romanos creían que terminaba la tierra conocida.\n\nDurante el recorrido, tu guía especializado compartirá las leyendas marineras, historias de naufragios, tradiciones celtas y la rica mitología que envuelve esta costa. La experiencia culmina con la puesta de sol en Finisterre, un momento mágico que conecta con siglos de tradición y espiritualidad.',
    duration: '8 horas',
    price: '€90 por persona (mín. 2 personas)',
    category: 'sunset',
    image: 'https://images.pexels.com/photos/10713938/pexels-photo-10713938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.8,
    reviewCount: 145,
    categoryName: 'Atardeceres',
    location: 'Costa da Morte, A Coruña',
    groupSize: 'Grupos pequeños (mín. 2)',
    includes: [
      'Visita a 3 faros históricos',
      'Guía especializado en leyendas',
      'Transporte cómodo',
      'Entrada a museos de faros',
      'Tiempo para el atardecer en Finisterre',
      'Merienda tradicional',
      'Seguro de viaje'
    ],
    itinerary: [
      { time: '11:00', activity: 'Salida hacia Cabo Vilán' },
      { time: '12:00', activity: 'Visita Faro de Cabo Vilán' },
      { time: '13:00', activity: 'Traslado a Muxía' },
      { time: '14:00', activity: 'Almuerzo en Muxía' },
      { time: '15:30', activity: 'Santuario y piedras sagradas' },
      { time: '16:30', activity: 'Traslado a Finisterre' },
      { time: '17:30', activity: 'Visita al Faro de Finisterre' },
      { time: '18:30', activity: 'Atardecer en el "fin del mundo"' },
      { time: '19:00', activity: 'Regreso' }
    ]
  }
];