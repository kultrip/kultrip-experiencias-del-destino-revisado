// Booking Management Component for Admins
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  Euro, 
  Check, 
  X, 
  Eye, 
  Download,
  Search,
  Clock,
  AlertCircle
} from 'lucide-react';
import { bookingService, Booking, BookingStatus } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

export function BookingManager() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
    }
  }, [isAdmin]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const result = await bookingService.getAllBookings();
      if (result.error) {
        setError(result.error);
      } else {
        setBookings(result.bookings || []);
      }
    } catch (err) {
      setError('Error loading bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus, reason?: string) => {
    try {
      const result = await bookingService.updateBookingStatus(bookingId, newStatus, reason);
      if (result.success) {
        // Reload bookings to get updated data
        loadBookings();
        setSelectedBooking(null);
      } else {
        setError(result.error || 'Failed to update booking');
      }
    } catch (err) {
      setError('Error updating booking status');
      console.error('Error updating booking:', err);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      refunded: 'bg-gray-100 text-gray-800',
      no_show: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: BookingStatus) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      paid: 'Pagado',
      cancelled: 'Cancelado',
      completed: 'Completado',
      refunded: 'Reembolsado',
      no_show: 'No se presentó'
    };
    return labels[status] || status;
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.experienceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate summary statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    paid: bookings.filter(b => b.status === 'paid').length,
    totalRevenue: bookings
      .filter(b => ['paid', 'completed'].includes(b.status))
      .reduce((sum, b) => sum + b.totalAmount, 0)
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
        <p className="text-gray-600">Solo los administradores pueden acceder a la gestión de reservas.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p className="text-gray-600">Administra todas las reservas de experiencias</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <Check className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <Euro className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-orange-600">€{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <Euro className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por cliente, email o experiencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="paid">Pagadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="completed">Completadas</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {booking.customerEmail}
                      </div>
                      {booking.customerPhone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {booking.customerPhone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {booking.experienceTitle}
                    </div>
                    <div className="text-xs text-gray-500">
                      Reservado: {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.experienceDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-1" />
                      {booking.participants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{booking.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Confirmar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled', 'Cancelled by admin')}
                          className="text-red-600 hover:text-red-900"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron reservas que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de Reserva</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información del Cliente</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nombre:</strong> {selectedBooking.customerName}</p>
                      <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                      {selectedBooking.customerPhone && (
                        <p><strong>Teléfono:</strong> {selectedBooking.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información de Reserva</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {selectedBooking.id.slice(0, 8)}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusLabel(selectedBooking.status)}
                        </span>
                      </p>
                      <p><strong>Fecha de reserva:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                      <p><strong>Fecha de experiencia:</strong> {new Date(selectedBooking.experienceDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Experiencia</h3>
                  <p className="text-sm">{selectedBooking.experienceTitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Participantes</h3>
                    <p className="text-lg">{selectedBooking.participants}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Precio por persona</h3>
                    <p className="text-lg">€{selectedBooking.pricePerPerson.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Total</h3>
                    <p className="text-lg font-bold text-orange-600">€{selectedBooking.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {selectedBooking.specialRequirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Requisitos Especiales</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedBooking.specialRequirements}</p>
                  </div>
                )}

                {selectedBooking.bookingNotes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Notas</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedBooking.bookingNotes}</p>
                  </div>
                )}

                {/* Action buttons */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Confirmar Reserva
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled', 'Cancelled by admin')}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'paid')}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Marcar como Pagado
                    </button>
                  </div>
                )}

                {selectedBooking.status === 'paid' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                      className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Marcar como Completado
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}