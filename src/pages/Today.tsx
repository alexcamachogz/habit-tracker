import React, { useState } from "react";
import { CheckCircle, Circle, PartyPopper } from "lucide-react";
import { useApp } from "@/context/AuthAppContext";
import { IconRenderer } from "@/components/ui/icon-renderer";
import { isHabitActiveToday, formatDate } from "@/lib/habitUtils";
import type { Habit } from "@/types/habit";

const Today: React.FC = () => {
  const { state, markHabitComplete } = useApp();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const today = new Date();
  const todayStr = formatDate(today);

  // Filtrar hábitos que están activos hoy
  const activeTodayHabits = state.habits.filter(habit => 
    isHabitActiveToday(habit.frequency, today)
  );

  // Verificar si un hábito ya está completado hoy
  const isCompleted = (habit: Habit) => {
    const todayLog = habit.logs[todayStr];
    return todayLog && todayLog.completed;
  };

  // Marcar/desmarcar hábito
  const toggleHabit = async (habitId: string) => {
    setIsLoading(habitId);
    
    try {
      const habit = state.habits.find(h => h.id === habitId);
      if (!habit) return;
      
      const existingLog = habit.logs[todayStr];
      const newCompletedState = existingLog ? !existingLog.completed : true;
      
      // Usar el servicio real de Firebase
      await markHabitComplete(habitId, todayStr, newCompletedState);
    } catch (error) {
      console.error('Error al marcar hábito:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const completedCount = activeTodayHabits.filter(habit => isCompleted(habit)).length;
  const progressPercentage = activeTodayHabits.length > 0 ? (completedCount / activeTodayHabits.length) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hoy</h1>
        <div className="text-sm text-gray-500">
          {today.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Progreso del día */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Progreso del Día</h2>
          <span className="text-2xl font-bold text-blue-600">{completedCount}/{activeTodayHabits.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {Math.round(progressPercentage)}% completado
        </div>
      </div>

      {/* Lista de hábitos */}
      <div className="space-y-3">
        {activeTodayHabits.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <PartyPopper className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700">¡No hay hábitos programados para hoy!</h3>
            <p className="text-gray-500">Disfruta tu día libre o crea nuevos hábitos.</p>
          </div>
        ) : (
          activeTodayHabits.map(habit => {
            const completed = isCompleted(habit);
            const loading = isLoading === habit.id;
            
            return (
              <div 
                key={habit.id} 
                className={`bg-white rounded-lg shadow p-4 transition-all duration-200 ${
                  completed ? 'bg-green-50 border-l-4 border-green-500' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      disabled={loading}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      } ${loading ? 'opacity-50' : ''}`}
                    >
                      {loading ? (
                        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <IconRenderer iconName={habit.icon} className="w-5 h-5" />
                    <div>
                      <h3 className={`font-semibold ${completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-gray-600">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs ${completed ? 'text-green-600' : 'text-gray-400'}`}>
                      {habit.frequency.type} • {habit.category}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resumen rápido */}
      {completedCount === activeTodayHabits.length && activeTodayHabits.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <PartyPopper className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">¡Todos los hábitos completados!</h3>
          <p className="text-green-700">Has terminado con éxito tu rutina de hoy.</p>
        </div>
      )}
    </div>
  );
};

export default Today;
