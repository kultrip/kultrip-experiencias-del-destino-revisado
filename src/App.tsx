import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ExperienceCard, { Experience } from './components/ExperienceCard';
import ContactSection from './components/ContactSection';
import ExperienceDetail from './components/ExperienceDetail';
import UserProfile from './components/UserProfile';
import UserDashboard from './components/UserDashboard';
import { getExperiences, getExperiencesByCategory, getExperiencesByState } from './services/experienceService';

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, [activeFilter, searchTerm]);

  useEffect(() => {
    // Listen for filter changes from header navigation
    const handleFilterChange = (event: CustomEvent) => {
      setActiveFilter(event.detail);
    };

    window.addEventListener('filterChange', handleFilterChange as EventListener);
    
    return () => {
      window.removeEventListener('filterChange', handleFilterChange as EventListener);
    };
  }, []);

  // Función para normalizar texto en español (remover acentos y convertir a minúsculas)
  const normalizeSpanishText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD') // Descomponer caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remover marcas de acento
      .replace(/ñ/g, 'n') // Convertir ñ a n para búsqueda más amplia
      .trim();
  };

  // Función para búsqueda inteligente en español con sinónimos
  const createSpanishSearchTerms = (searchTerm: string): string[] => {
    const normalized = normalizeSpanishText(searchTerm);
    const terms = [normalized];
    
    // Sinónimos y variaciones comunes en español
    const synonyms: { [key: string]: string[] } = {
      'atardecer': ['puesta de sol', 'ocaso', 'sunset'],
      'comida': ['gastronomia', 'gastronomica', 'culinaria', 'comer'],
      'literatura': ['literaria', 'literario', 'libros', 'escritor'],
      'excursion': ['paseo', 'viaje', 'tour', 'ruta'],
      'mar': ['oceano', 'costa', 'playa', 'maritimo'],
      'montana': ['monte', 'cerro', 'colina', 'sierra'],
      'cultura': ['cultural', 'tradicional', 'historia', 'historico'],
      'naturaleza': ['natural', 'verde', 'paisaje', 'flora'],
      'noche': ['nocturno', 'nocturna', 'evening'],
      'dia': ['diurno', 'diurna', 'manana', 'tarde']
    };
    
    // Agregar sinónimos si existen
    Object.entries(synonyms).forEach(([key, values]) => {
      if (normalized.includes(key)) {
        terms.push(...values);
      }
      // También buscar en el sentido contrario
      values.forEach(value => {
        if (normalized.includes(normalizeSpanishText(value))) {
          terms.push(key);
        }
      });
    });
    
    return [...new Set(terms)]; // Remover duplicados
  };

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      let data: Experience[];
      
      if (activeFilter === 'all') {
        data = await getExperiences();
      } else if (activeFilter === 'galicia') {
        data = await getExperiencesByState('Galicia');
      } else {
        // For category filters (sunset, gastronomy, literary, daytrips)
        data = await getExperiencesByCategory(activeFilter);
      }
      
      // Apply search filter if search term exists (intelligent Spanish search with synonyms)
      if (searchTerm.trim()) {
        const searchTerms = createSpanishSearchTerms(searchTerm);
        
        data = data.filter(experience => {
          const normalizedTitle = normalizeSpanishText(experience.title);
          const normalizedDescription = normalizeSpanishText(experience.description);
          const normalizedLocation = experience.location ? normalizeSpanishText(experience.location) : '';
          const normalizedCategory = normalizeSpanishText(experience.category);
          
          // Buscar cualquier término de búsqueda en cualquier campo
          return searchTerms.some(term => 
            normalizedTitle.includes(term) ||
            normalizedDescription.includes(term) ||
            normalizedLocation.includes(term) ||
            normalizedCategory.includes(term)
          );
        });
      }
      
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // The effect will trigger fetchExperiences when searchTerm changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero onSearch={handleSearch} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        
        <div className="mb-8">
          {searchTerm ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Resultados de búsqueda para "{searchTerm}"
              </h2>
              <p className="text-lg text-gray-600">
                {loading ? 'Buscando...' : `Se encontraron ${experiences.length} experiencias`}
              </p>
              {!loading && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
                >
                  ← Volver a todas las experiencias
                </button>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Experiencias en Galicia
              </h2>
              <p className="text-lg text-gray-600">
                Descubre los tesoros ocultos del noroeste de España con nuestras experiencias cuidadosamente seleccionadas
              </p>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience}
              />
            ))}
          </div>
        )}
        
        {!loading && experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm 
                ? `No se encontraron experiencias que coincidan con "${searchTerm}".`
                : 'No se encontraron experiencias para esta categoría.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Ver todas las experiencias
              </button>
            )}
          </div>
        )}
      </main>
      
      <ContactSection />
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Experiencias del Destino</h3>
              <p className="text-gray-400">
                Tu puerta de entrada a las experiencias más auténticas de Galicia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Experiencias</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setActiveFilter('sunset')} 
                    className="hover:text-white text-left"
                  >
                    Atardeceres
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveFilter('gastronomy')} 
                    className="hover:text-white text-left"
                  >
                    Gastronomía
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveFilter('literary')} 
                    className="hover:text-white text-left"
                  >
                    Rutas Literarias
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveFilter('daytrips')} 
                    className="hover:text-white text-left"
                  >
                    Excursiones
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setActiveFilter('galicia')} 
                    className="hover:text-white text-left"
                  >
                    Galicia
                  </button>
                </li>
                <li>
                  <span className="text-gray-500">Fisterra (próximamente)</span>
                </li>
                <li>
                  <span className="text-gray-500">Ribeira Sacra (próximamente)</span>
                </li>
                <li>
                  <span className="text-gray-500">Rías Baixas (próximamente)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+34 900 300 111</li>
                <li>info@experienciasdeldestino.com</li>
                <li>Lun-Vie 09:00-18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Experiencias del Destino. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experience/:id" element={<ExperienceDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;