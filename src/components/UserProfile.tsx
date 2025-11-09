import { useState } from 'react';
import { User, Edit3, X, Mail, Phone, Calendar, Shield, Bell, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso requerido</h2>
          <p className="text-gray-600">Inicia sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'preferences', label: 'Preferencias', icon: Heart },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                  <p className="text-orange-100">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                      {user.role === 'traveler' ? 'Viajero' : user.role}
                    </span>
                    <span>Miembro desde {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
              >
                {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{user.firstName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{user.lastName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Teléfono
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{user.phone || 'No especificado'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma preferido
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                      {user.preferredLanguage === 'es' ? 'Español' : 
                       user.preferredLanguage === 'gl' ? 'Galego' : 'English'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Fecha de nacimiento
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'No especificado'}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      🚧 Funcionalidad de edición en desarrollo. Próximamente podrás editar tu perfil.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Intereses</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {user.profile.interests.map((interest) => (
                      <div
                        key={interest}
                        className="p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-orange-700 text-center"
                      >
                        <p className="text-sm font-medium capitalize">{interest}</p>
                      </div>
                    ))}
                    {user.profile.interests.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No has seleccionado intereses aún</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de viaje</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rango de presupuesto
                      </label>
                      <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                        {user.profile.budgetRange === 'budget' ? 'Económico (< €50/día)' :
                         user.profile.budgetRange === 'mid_range' ? 'Medio (€50-150/día)' :
                         user.profile.budgetRange === 'luxury' ? 'Lujo (€150-300/día)' :
                         'Ultra Lujo (> €300/día)'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño de grupo preferido
                      </label>
                      <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                        {user.profile.groupSizePreference === 'solo' ? 'Solo' :
                         user.profile.groupSizePreference === 'couple' ? 'En pareja' :
                         user.profile.groupSizePreference === 'small_group' ? 'Grupo pequeño (3-8)' :
                         user.profile.groupSizePreference === 'large_group' ? 'Grupo grande (9+)' :
                         'Familia'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones por Email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Confirmaciones de reserva</p>
                        <p className="text-sm text-gray-500">Recibe confirmaciones y recordatorios</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full ${user.profile.notifications.email.bookingConfirmation ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.profile.notifications.email.bookingConfirmation ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Recomendaciones</p>
                        <p className="text-sm text-gray-500">Sugerencias basadas en tus intereses</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full ${user.profile.notifications.email.experienceRecommendations ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.profile.notifications.email.experienceRecommendations ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Ofertas promocionales</p>
                        <p className="text-sm text-gray-500">Descuentos y ofertas especiales</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full ${user.profile.notifications.email.promotionalOffers ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.profile.notifications.email.promotionalOffers ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-900">Tu privacidad es importante</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Controla cómo compartes tu información y quién puede ver tu actividad en la plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Visibilidad del perfil</p>
                      <p className="text-sm text-gray-500">Quién puede ver tu perfil público</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium capitalize">
                      {user.profile.privacy.profileVisibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Mostrar nombre real</p>
                      <p className="text-sm text-gray-500">Usar tu nombre real en lugar de un usuario</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full ${user.profile.privacy.showRealName ? 'bg-orange-500' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.profile.privacy.showRealName ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Contacto de proveedores</p>
                      <p className="text-sm text-gray-500">Permitir que te contacten directamente</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full ${user.profile.privacy.allowContactFromProviders ? 'bg-orange-500' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${user.profile.privacy.allowContactFromProviders ? 'translate-x-6' : 'translate-x-1'} mt-0.5`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}