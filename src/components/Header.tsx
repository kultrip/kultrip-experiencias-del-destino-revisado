import React from 'react';
import { Menu, Phone, Mail, Clock } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      {/* Top contact bar */}
      <div className="bg-orange-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+34 900 300 111</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>info@experienciasdeldestino.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Lun-Vie 09:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img 
              src="/public/Screenshot 2025-09-26 at 12.52.45.png" 
              alt="Experiencias del Destino" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Inicio</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Experiencias</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Galicia</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Sobre Nosotros</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Contacto</a>
          </nav>

          <button className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}