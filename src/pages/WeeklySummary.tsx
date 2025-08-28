import React from "react";
import { useHabits } from "@/context/selectors";
import { getHabitStats, getWeeklyProgress, getWeekStart, formatDate } from "@/lib/habitUtils";

const WeeklySummary: React.FC = () => {
  const habits = useHabits();
  const today = new Date();
  const weekStart = getWeekStart(today);

  // Calcular progreso semanal para cada hábito
  const weeklyProgress = habits.map(habit => {
    const progress = getWeeklyProgress(habit.logs, habit.frequency, weekStart);
    const stats = getHabitStats(habit);
    return {
      ...habit,
      weeklyProgress: progress,
      currentStreak: stats.currentStreak,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Resumen Semanal</h1>
      
      {/* Mini calendario semanal */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Esta Semana</h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + index);
            const isToday = formatDate(date) === formatDate(today);
            const isPast = date < today;
            
            return (
              <div key={index} className={`p-2 rounded ${isToday ? 'bg-blue-100 border-2 border-blue-500' : ''}`}>
                <div className="text-xs text-gray-500">{day}</div>
                <div className="text-sm font-medium">{date.getDate()}</div>
                {isPast && <div className="text-xs">✅</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progreso semanal por hábito */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Progreso Semanal</h2>
        <div className="space-y-3">
          {weeklyProgress.map(habit => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{habit.icon}</span>
                <span className="font-medium">{habit.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${habit.weeklyProgress.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {habit.weeklyProgress.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rachas principales */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">🔥 Rachas Actuales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyProgress
            .filter(habit => habit.currentStreak > 0)
            .map(habit => (
              <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{habit.icon}</span>
                  <span className="font-medium">{habit.name}</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {habit.currentStreak} días
                </span>
              </div>
            ))
          }
        </div>
      </div>

      {/* CTA Principal */}
      <div className="text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          📝 Marcar hábitos de hoy
        </button>
      </div>
    </div>
  );
};

export default WeeklySummary;
