import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const destinations = [
  {
    title: 'Descubre la Magia de Galicia',
    subtitle: 'Experiencias únicas en los rincones más hermosos del noroeste de España',
    image: 'https://images.pexels.com/photos/22191978/pexels-photo-22191978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: 'Descubre Andalucía',
    subtitle: 'Sumérgete en la cultura, historia y tradiciones del sur de España',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    title: 'Descubre Baleares',
    subtitle: 'Paraíso mediterráneo con playas cristalinas y experiencias inolvidables',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600 overflow-hidden">
      {/* Slides */}
      {destinations.map((destination, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
            style={{
              backgroundImage: `url("${destination.image}")`,
              backgroundColor: 'rgba(251, 146, 60, 0.7)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                {destination.title}
              </h1>
              <p className="text-xl mb-8 text-orange-100 animate-fade-in-delay">
                {destination.subtitle}
              </p>
              
              <div className="bg-white rounded-lg p-4 shadow-lg animate-slide-up">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="¿Qué experiencia buscas?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-colors">
                    <Search className="w-5 h-5" />
                    <span>Buscar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}