import React from 'react';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
          backgroundColor: 'rgba(251, 146, 60, 0.7)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre la Magia de Galicia
          </h1>
          <p className="text-xl mb-8 text-orange-100">
            Experiencias únicas en los rincones más hermosos del noroeste de España
          </p>
          
          <div className="bg-white rounded-lg p-4 shadow-lg">
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
  );
}