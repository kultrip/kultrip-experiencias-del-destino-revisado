import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Star, CheckCircle, Phone, Mail } from 'lucide-react';
import { getExperienceById } from '../services/experienceService';
import { Experience } from './ExperienceCard';
import Header from './Header';
import BookingFlow from './BookingFlow';

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getExperienceById(id);
        setExperience(data);
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);
  


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Experiencia no encontrada</h1>
            <Link to="/" className="text-orange-500 hover:text-orange-600">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a experiencias
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-full text-xl font-bold">
              {experience.price}
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  {experience.categoryName && (
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                        {experience.categoryName}
                      </span>
                      {experience.rating && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="ml-1 text-lg font-semibold">{experience.rating}</span>
                          </div>
                          <span className="text-gray-600">({experience.reviewCount} reseñas)</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{experience.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{experience.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{experience.duration}</span>
                    </div>
                    {experience.groupSize && (
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-orange-500" />
                        <span>{experience.groupSize}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {experience.fullDescription || experience.description}
                  </div>
                </div>

                {experience.includes && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Qué incluye</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {experience.includes.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {experience.itinerary && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerario</h2>
                    <div className="space-y-4">
                      {experience.itinerary.map((item, index) => (
                        <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                          <div className="flex-shrink-0 w-20 text-sm font-bold text-orange-600 bg-white px-3 py-1 rounded-full mr-4">
                            {item.time}
                          </div>
                          <div className="text-gray-700">
                            {item.activity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(experience.requirements || experience.accessibility) && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información importante</h3>
                    <div className="space-y-2">
                      {experience.requirements && (
                        <p className="text-gray-700">
                          <strong>Requisitos:</strong> {experience.requirements}
                        </p>
                      )}
                      {experience.accessibility && (
                        <p className="text-green-700">
                          <strong>Accesibilidad:</strong> {experience.accessibility}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <BookingFlow 
                    experienceId={experience.id} 
                    experienceTitle={experience.title}
                    basePrice={parseFloat(experience.price) || undefined}
                    minGroupSize={experience.groupSize ? parseInt(experience.groupSize) : undefined}
                    minParticipants={2}
                  />
                  
                  <div className="bg-orange-50 p-6 rounded-lg mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">¿Necesitas ayuda?</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-orange-500" />
                        <span>+34 900 300 111</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-orange-500" />
                        <span>info@experienciasdeldestino.com</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        <span>Lun-Vie 09:00-18:00</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => window.open('tel:+34900300111')}
                        className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Llamar Ahora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}