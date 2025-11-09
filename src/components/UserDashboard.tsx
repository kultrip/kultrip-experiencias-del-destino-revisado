import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Clock, Users, Heart, ArrowRight, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserBooking, UserStats } from '../types/user';

// Mock data - replace with actual API calls
const mockBookings: UserBooking[] = [
  {
    id: '1',
    userId: '1',
    experienceId: '1',
    bookingDate: '2024-10-15',
    experienceDate: '2024-11-15',
    participants: 2,
    totalPrice: 300,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    experienceId: '3',
    bookingDate: '2024-10-10',
    experienceDate: '2024-10-25',
    participants: 1,
    totalPrice: 90,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-10-10T14:30:00Z',
    updatedAt: '2024-10-25T20:00:00Z',
  },
];

const mockStats: UserStats = {
  userId: '1',
  totalBookings: 5,
  totalSpent: 850,
  experiencesCreated: 0,
  averageRating: 0,
  favoriteCategories: ['nature', 'culture', 'gastronomy'],
  visitedLocations: ['Fisterra', 'Ribeira Sacra', 'Rías Baixas'],
  memberSince: '2024-01-15',
  lastActivity: '2024-10-30',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate API loading
      setTimeout(() => {
        setBookings(mockBookings);
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso requerido</h2>
          <p className="text-gray-600">Inicia sesión para ver tu dashboard personal.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => new Date(b.experienceDate) > new Date());
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Hola, {user.firstName}!</h1>
              <p className="text-orange-100 text-lg">
                Bienvenido a tu dashboard personal de experiencias
              </p>
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Miembro desde {new Date(stats?.memberSince || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{stats?.visitedLocations.length || 0} destinos visitados</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                <div className="text-orange-100 text-sm">Experiencias</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Experiences */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Próximas Experiencias</h2>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {upcomingBookings.length} programadas
                </span>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Los Atardeceres del Camino de Santiago (Fisterra)
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{new Date(booking.experienceDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{booking.participants} personas</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">€{booking.totalPrice}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                            </span>
                            {booking.paymentStatus === 'paid' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Pagado
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="text-orange-500 hover:text-orange-600">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay experiencias programadas</h3>
                  <p className="text-gray-600 mb-4">¡Explora nuestras experiencias y reserva tu próxima aventura!</p>
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Explorar Experiencias
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
              
              {completedBookings.length > 0 ? (
                <div className="space-y-4">
                  {completedBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Completaste "Ruta Literaria en la Ribeira Sacra"
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(booking.updatedAt).toLocaleDateString()} • €{booking.totalPrice}
                        </p>
                      </div>
                      <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                        Dejar reseña
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No hay actividad reciente</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-700">Total gastado</span>
                  </div>
                  <span className="font-bold text-gray-900">€{stats?.totalSpent || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-700">Experiencias</span>
                  </div>
                  <span className="font-bold text-gray-900">{stats?.totalBookings || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-700">Destinos</span>
                  </div>
                  <span className="font-bold text-gray-900">{stats?.visitedLocations.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-700">Nivel</span>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                    Explorador
                  </span>
                </div>
              </div>
            </div>

            {/* Favorite Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {stats?.favoriteCategories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {category === 'nature' ? '🌲 Naturaleza' :
                     category === 'culture' ? '🏛️ Cultura' :
                     category === 'gastronomy' ? '🍷 Gastronomía' :
                     category}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-orange-500 mr-3" />
                    <span>Lista de Deseos</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-orange-500 mr-3" />
                    <span>Mis Reseñas</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
                    <span>Crear Experiencia</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Pronto</span>
                </button>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recomendado para ti</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Costa da Morte Mística</h4>
                <p className="text-sm text-gray-600 mb-3">Basado en tu interés por la naturaleza y cultura</p>
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors text-sm font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}