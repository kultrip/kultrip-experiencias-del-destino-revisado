import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Euro, MapPin, Users, Calendar, Info } from 'lucide-react';

export interface Experience {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  duration: string;
  price: string;
  location?: string;
  schedule?: string;
  requirements?: string;
  category: string;
  image: string;
  accessibility?: string;
  rating?: number;
  reviewCount?: number;
  categoryName?: string;
  groupSize?: string;
  includes?: string[];
  itinerary?: { time: string; activity: string }[];
}

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const handleBooking = () => {
    alert('¡Gracias por tu interés! Te contactaremos pronto para confirmar tu reserva.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {experience.price}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{experience.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            <span>{experience.duration}</span>
          </div>
          
          {experience.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              <span>{experience.location}</span>
            </div>
          )}
          
          {experience.schedule && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              <span>{experience.schedule}</span>
            </div>
          )}
          
          {experience.requirements && (
            <div className="flex items-start text-sm text-gray-600">
              <Info className="w-4 h-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
              <span>{experience.requirements}</span>
            </div>
          )}
          
          {experience.accessibility && (
            <div className="flex items-center text-sm text-green-600">
              <Users className="w-4 h-4 mr-2 text-green-500" />
              <span>{experience.accessibility}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/experience/${experience.id}`}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Ver Más & Reservar
          </Link>
          <Link
            to={`/experience/${experience.id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Ver Más
          </Link>
        </div>
      </div>
    </div>
  );
}