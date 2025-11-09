import React, { useState } from 'react';
import { Menu, Phone, Mail, Clock, User, LogOut, Settings, Heart, Calendar, Shield, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { AdminManagement } from './AdminManagement';
import { AdminExperienceManager } from './AdminExperienceManager';

export default function Header() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showExperienceManager, setShowExperienceManager] = useState(false);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

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
            
            {/* User section in top bar */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 text-sm">
                  <span>Hola, {user.firstName}</span>
                  <span className="text-orange-500">|</span>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hover:text-orange-500"
                  >
                    Mi Cuenta
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="hover:text-orange-500"
                  >
                    Iniciar Sesión
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="hover:text-orange-500"
                  >
                    Registro
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img 
              src="https://experienciasdeldestino.com/wp-content/uploads/2019/06/Logo-EdD-NARANJA_Fondo-Blanco.png" 
              alt="Experiencias del Destino" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Inicio</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Experiencias</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Galicia</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Andalucía</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Baleares</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Sobre Nosotros</a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">Contacto</a>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:block">{user.firstName}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <nav className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Mi Perfil
                      </a>
                      <a
                        href="/bookings"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Mis Reservas
                      </a>
                      <a
                        href="/wishlist"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Lista de Deseos
                      </a>
                      {user.role === 'admin' && (
                        <>
                          <button
                            onClick={() => setShowAdminPanel(true)}
                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Gestión Usuarios
                          </button>
                          <button
                            onClick={() => setShowExperienceManager(true)}
                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <MapPin className="w-4 h-4 mr-3" />
                            Gestión Experiencias
                          </button>
                        </>
                      )}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </nav>
                  </div>
                )}
              </div>
            )}

            <button className="md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
      
      {/* Admin Management Modal */}
      {showAdminPanel && (
        <AdminManagement
          onClose={() => setShowAdminPanel(false)}
        />
      )}
      
      {/* Experience Management Modal */}
      {showExperienceManager && (
        <AdminExperienceManager
          onClose={() => setShowExperienceManager(false)}
        />
      )}
    </header>
  );
}