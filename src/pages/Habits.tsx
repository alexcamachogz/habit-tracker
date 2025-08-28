import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { getHabitStats } from "@/lib/habitUtils";
import type { Habit } from "@/types/habit";

const Habits: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  // Filtrar hábitos por categoría
  const filteredHabits = selectedCategory === 'todas' 
    ? state.habits 
    : state.habits.filter(habit => habit.category === selectedCategory);

  // Obtener categorías únicas
  const categories = ['todas', ...Array.from(new Set(state.habits.map(habit => habit.category)))];

  const getFrequencyText = (habit: Habit) => {
    if (habit.frequency.type === 'daily') {
      return 'Diario';
    } else if (habit.frequency.type === 'weekly') {
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const days = habit.frequency.days?.map(d => dayNames[d]).join(', ') || '';
      return `Semanal: ${days}`;
    } else {
      return `${habit.frequency.count} veces por ${habit.frequency.period}`;
    }
  };

  const deleteHabit = (habitId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      dispatch({ type: 'DELETE_HABIT', payload: habitId });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mis Hábitos</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          + Nuevo Hábito
        </button>
      </div>

      {/* Filtros por categoría */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Filtrar por categoría</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'todas' ? 'Todas' : 
               category === 'skincare' ? 'Cuidado Personal' :
               category === 'gym' ? 'Ejercicio' :
               category === 'alimentacion' ? 'Alimentación' :
               category === 'lectura' ? 'Lectura' :
               'Otros'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de hábitos */}
      <div className="space-y-4">
        {filteredHabits.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay hábitos en esta categoría</h3>
            <p className="text-gray-500 mb-4">Crea tu primer hábito para comenzar a seguir tu progreso.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              + Crear Hábito
            </button>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const stats = getHabitStats(habit);
            
            return (
              <div key={habit.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{habit.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-gray-600 mt-1">{habit.description}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        <div className="text-sm text-gray-500">
                          📅 {getFrequencyText(habit)}
                        </div>
                        <div className="text-sm text-gray-500">
                          🏷️ {habit.category === 'skincare' ? 'Cuidado Personal' :
                               habit.category === 'gym' ? 'Ejercicio' :
                               habit.category === 'alimentacion' ? 'Alimentación' :
                               habit.category === 'lectura' ? 'Lectura' :
                               'Otros'}
                        </div>
                        <div className="text-sm text-gray-500">
                          📊 {habit.trackingType === 'simple' ? 'Seguimiento simple' : 'Seguimiento detallado'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="p-2 bg-white hover:bg-red-100 rounded-lg transition-colors text-red-600 border border-gray-200"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                    <div className="text-xs text-gray-500">Racha actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.longestStreak}</div>
                    <div className="text-xs text-gray-500">Mejor racha</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.totalDaysCompleted}</div>
                    <div className="text-xs text-gray-500">Días completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.successRate}%</div>
                    <div className="text-xs text-gray-500">Tasa de éxito</div>
                  </div>
                </div>

                {/* Progreso visual */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso general</span>
                    <span>{stats.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Estadísticas globales */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Estadísticas Generales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{state.habits.length}</div>
            <div className="text-sm text-gray-500">Total hábitos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {state.habits.filter(h => getHabitStats(h).currentStreak > 0).length}
            </div>
            <div className="text-sm text-gray-500">Con racha activa</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...state.habits.map(h => getHabitStats(h).currentStreak), 0)}
            </div>
            <div className="text-sm text-gray-500">Mejor racha</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(state.habits.reduce((acc, h) => acc + getHabitStats(h).successRate, 0) / state.habits.length) || 0}%
            </div>
            <div className="text-sm text-gray-500">Promedio éxito</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Habits;
