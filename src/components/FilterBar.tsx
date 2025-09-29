import React, { useState } from 'react';
import { Filter, Sunset, Wine, BookOpen, MapPin } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Todas', icon: Filter },
  { id: 'sunset', name: 'Atardeceres', icon: Sunset },
  { id: 'gastronomy', name: 'Vino & Gastronomía', icon: Wine },
  { id: 'literary', name: 'Rutas Literarias', icon: BookOpen },
  { id: 'daytrips', name: 'Excursiones', icon: MapPin },
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
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  activeFilter === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}