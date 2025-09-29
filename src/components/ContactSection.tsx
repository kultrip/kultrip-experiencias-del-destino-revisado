import React from 'react';
import { Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="bg-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Necesitas Ayuda?</h2>
          <p className="text-lg text-gray-600">
            Nuestro equipo está aquí para ayudarte a planificar tu experiencia perfecta
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Llámanos</h3>
            <p className="text-orange-600 font-medium text-lg">+34 900 300 111</p>
            <p className="text-gray-600 text-sm mt-1">Llamada gratuita</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Escríbenos</h3>
            <p className="text-orange-600 font-medium">info@experienciasdeldestino.com</p>
            <p className="text-gray-600 text-sm mt-1">Respuesta en 24h</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Horario</h3>
            <p className="text-gray-900 font-medium">Lun-Vie 09:00-18:00</p>
            <p className="text-gray-600 text-sm mt-1">Atención personalizada</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>Contactar Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
}