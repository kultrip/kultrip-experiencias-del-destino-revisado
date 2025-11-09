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
import { getExperiences, getExperiencesByCategory } from './services/experienceService';

function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, [activeFilter]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      let data: Experience[];
      
      if (activeFilter === 'all') {
        data = await getExperiences();
      } else {
        data = await getExperiencesByCategory(activeFilter);
      }
      
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experiencias en Galicia
          </h2>
          <p className="text-lg text-gray-600">
            Descubre los tesoros ocultos del noroeste de España con nuestras experiencias cuidadosamente seleccionadas
          </p>
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
              No se encontraron experiencias para esta categoría.
            </p>
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
                <li><a href="#" className="hover:text-white">Atardeceres</a></li>
                <li><a href="#" className="hover:text-white">Gastronomía</a></li>
                <li><a href="#" className="hover:text-white">Rutas Literarias</a></li>
                <li><a href="#" className="hover:text-white">Excursiones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Fisterra</a></li>
                <li><a href="#" className="hover:text-white">Ribeira Sacra</a></li>
                <li><a href="#" className="hover:text-white">Rías Baixas</a></li>
                <li><a href="#" className="hover:text-white">Costa da Morte</a></li>
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