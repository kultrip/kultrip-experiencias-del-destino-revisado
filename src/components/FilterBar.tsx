import { Filter, Sunset, Wine, BookOpen, MapPin } from 'lucide-react';

const filters = [
  { id: 'all', name: 'Todas las experiencias', icon: Filter, type: 'all' },
  { id: 'galicia', name: 'Galicia', icon: MapPin, type: 'state' },
  { id: 'sunset', name: 'Atardeceres', icon: Sunset, type: 'category' },
  { id: 'gastronomy', name: 'Vino & Gastronomía', icon: Wine, type: 'category' },
  { id: 'literary', name: 'Rutas Literarias', icon: BookOpen, type: 'category' },
  { id: 'daytrips', name: 'Excursiones', icon: MapPin, type: 'category' },
];

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{filter.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}