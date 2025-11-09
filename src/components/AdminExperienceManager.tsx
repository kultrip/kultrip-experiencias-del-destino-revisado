import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Filter, Save, X, 
  MapPin, Clock, Euro
} from 'lucide-react';
import { getAllExperiences, createExperience, updateExperience, deleteExperience, SupabaseExperience } from '../services/experienceService';

interface AdminExperienceManagerProps {
  onClose: () => void;
}

export function AdminExperienceManager({ onClose }: AdminExperienceManagerProps) {
  const [experiences, setExperiences] = useState<SupabaseExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<SupabaseExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<SupabaseExperience | null>(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    duration: '',
    price: '',
    location: '',
    schedule: '',
    requirements: '',
    category: 'sunset',
    image: '',
    accessibility: '',
    category_name: '',
    group_size: '',
    includes: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'draft',
  });

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'sunset', name: 'Atardeceres' },
    { id: 'gastronomy', name: 'Gastronomía' },
    { id: 'literary', name: 'Literarias' },
    { id: 'daytrips', name: 'Excursiones' },
  ];

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    let filtered = experiences;

    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }

    setFilteredExperiences(filtered);
  }, [experiences, searchTerm, filterCategory]);

  const fetchExperiences = async () => {
    try {
      const data = await getAllExperiences();
      setExperiences(data);
    } catch (error) {
      setMessage('Error al cargar las experiencias');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      full_description: '',
      duration: '',
      price: '',
      location: '',
      schedule: '',
      requirements: '',
      category: 'sunset',
      image: '',
      accessibility: '',
      category_name: '',
      group_size: '',
      includes: [],
      status: 'active',
    });
    setEditingExperience(null);
  };

  const handleEdit = (experience: SupabaseExperience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      description: experience.description,
      full_description: experience.full_description || '',
      duration: experience.duration,
      price: experience.price,
      location: experience.location || '',
      schedule: experience.schedule || '',
      requirements: experience.requirements || '',
      category: experience.category,
      image: experience.image,
      accessibility: experience.accessibility || '',
      category_name: experience.category_name || '',
      group_size: experience.group_size || '',
      includes: experience.includes || [],
      status: experience.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, formData);
        setMessage('Experiencia actualizada correctamente');
      } else {
        await createExperience(formData);
        setMessage('Experiencia creada correctamente');
      }
      
      await fetchExperiences();
      setShowForm(false);
      resetForm();
    } catch (error) {
      setMessage('Error al guardar la experiencia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) return;

    try {
      await deleteExperience(id);
      setMessage('Experiencia eliminada correctamente');
      await fetchExperiences();
    } catch (error) {
      setMessage('Error al eliminar la experiencia');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIncludesChange = (value: string) => {
    const includesArray = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, includes: includesArray }));
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </h2>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción corta *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción completa
                  </label>
                  <textarea
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="sunset">Atardeceres</option>
                    <option value="gastronomy">Gastronomía</option>
                    <option value="literary">Literarias</option>
                    <option value="daytrips">Excursiones</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de imagen *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de grupo
                  </label>
                  <input
                    type="text"
                    name="group_size"
                    value={formData.group_size}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qué incluye (una línea por elemento)
                  </label>
                  <textarea
                    value={formData.includes.join('\n')}
                    onChange={(e) => handleIncludesChange(e.target.value)}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Guía especializado&#10;Transporte incluido&#10;Almuerzo típico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos
                  </label>
                  <input
                    type="text"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accesibilidad
                  </label>
                  <input
                    type="text"
                    name="accessibility"
                    value={formData.accessibility}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center"
                >
                  {loading ? 'Guardando...' : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingExperience ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Experiencias</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar experiencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Experiencia
            </button>
          </div>

          {/* Experiences List */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredExperiences.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron experiencias</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredExperiences.map((experience) => (
                  <div key={experience.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex">
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-24 h-24 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {experience.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            experience.status === 'active' ? 'bg-green-100 text-green-800' :
                            experience.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {experience.status === 'active' ? 'Activa' :
                             experience.status === 'inactive' ? 'Inactiva' : 'Borrador'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Euro className="w-3 h-3 mr-1" />
                            <span>{experience.price}</span>
                          </div>
                          {experience.location && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate">{experience.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(experience)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(experience.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}