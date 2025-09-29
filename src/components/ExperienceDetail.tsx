import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Star, CheckCircle, Phone, Mail, Calendar, Minus, Plus } from 'lucide-react';
import { experiences } from '../data/experiences';
import Header from './Header';

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const experience = experiences.find(exp => exp.id === id);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(2);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`¡Gracias ${formData.name}! Hemos recibido tu solicitud de reserva para "${experience.title}" el ${selectedDate} para ${participants} personas. Te contactaremos pronto para confirmar los detalles.`);
    setShowBookingForm(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
                <div className="bg-orange-50 p-6 rounded-lg sticky top-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Reservar experiencia</h3>
                  
                  {!showBookingForm ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de la experiencia
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={minDate}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de participantes
                        </label>
                        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setParticipants(Math.max(1, participants - 1))}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="text-lg font-semibold">{participants}</span>
                          <button
                            type="button"
                            onClick={() => setParticipants(participants + 1)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Total estimado:</span>
                          <span className="text-2xl font-bold text-orange-600">{experience.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          *El precio final puede variar según la fecha y número de participantes
                        </p>
                      </div>

                      <button
                        onClick={() => setShowBookingForm(true)}
                        disabled={!selectedDate}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
                      >
                        Continuar con la reserva
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h4 className="font-semibold mb-2">Resumen de tu reserva:</h4>
                        <p className="text-sm text-gray-600">Fecha: {selectedDate}</p>
                        <p className="text-sm text-gray-600">Participantes: {participants}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensaje adicional
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Cualquier solicitud especial o pregunta..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowBookingForm(false)}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          Atrás
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                        >
                          Enviar solicitud
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-8 pt-6 border-t border-orange-200">
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