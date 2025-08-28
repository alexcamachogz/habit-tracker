import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { IconRenderer } from '@/components/ui/icon-renderer';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: {
    name: string;
    description: string;
    category: string;
    icon: string;
    targetDays: number[];
    targetFrequency: string;
  }) => void;
}

const categories = [
  'skincare',
  'gym', 
  'alimentacion',
  'lectura',
  'nueva'
];

const categoryLabels: Record<string, string> = {
  'skincare': 'Skin Care',
  'gym': 'Ejercicio',
  'alimentacion': 'Alimentación',
  'lectura': 'Lectura', 
  'nueva': 'Nueva'
};

const availableIcons = [
  'Dumbbell', 'Heart', 'Brain', 'BookOpen', 'Sparkles', 
  'Activity', 'Salad', 'Coffee', 'Moon', 'Sun'
];

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    icon: 'Heart',
    targetDays: [] as number[], // Ningún día seleccionado por defecto
    targetFrequency: 'daily'
  });

  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  const handleCategoryChange = (value: string) => {
    if (value === 'nueva') {
      setShowCustomCategoryInput(true);
      setFormData(prev => ({ ...prev, category: value }));
    } else {
      setShowCustomCategoryInput(false);
      setCustomCategory('');
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    // Validar que si es categoría "nueva", tenga texto personalizado
    if (formData.category === 'nueva' && !customCategory.trim()) {
      alert('Por favor ingresa el nombre de la nueva categoría');
      return;
    }
    
    // Si la categoría es "nueva" y hay una categoría personalizada, usarla
    const finalCategory = formData.category === 'nueva' && customCategory.trim() 
      ? customCategory.trim().toLowerCase()
      : formData.category;
    
    onSave({
      ...formData,
      category: finalCategory
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      icon: 'Heart',
      targetDays: [],
      targetFrequency: 'daily'
    });
    setCustomCategory('');
    setShowCustomCategoryInput(false);
    
    onClose();
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      targetDays: prev.targetDays.includes(day)
        ? prev.targetDays.filter(d => d !== day)
        : [...prev.targetDays, day]
    }));
  };

  // Función para validar si el formulario es válido
  const isFormValid = () => {
    const hasName = formData.name.trim().length > 0;
    const hasValidCategory = formData.category.length > 0 && 
                           (formData.category !== 'nueva' || 
                            (formData.category === 'nueva' && customCategory.trim().length > 0));
    return hasName && hasValidCategory;
  };

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Hábito</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none p-2 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre del hábito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del hábito *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
              placeholder="Ej: Hacer ejercicio"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
              placeholder="Descripción opcional del hábito"
              rows={3}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
            >
              <option value="" disabled>Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
            
            {/* Input para categoría personalizada */}
            {showCustomCategoryInput && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white"
                  placeholder="Ingresa el nombre de la nueva categoría"
                  maxLength={20}
                />
              </div>
            )}
          </div>

          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-3 rounded-lg border-2 transition-colors focus:outline-none ${
                    formData.icon === icon
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconRenderer iconName={icon} className="w-6 h-6 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Días de la semana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días objetivo
            </label>
            <div className="flex gap-2">
              {dayNames.map((dayName, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.targetDays.includes(index)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dayName}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              Crear Hábito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
