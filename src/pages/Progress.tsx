import React, { useState } from "react";
import { Lightbulb, Flame, AlertTriangle, Trophy } from "lucide-react";
import { useHabits } from "@/context/selectors";
import { IconRenderer } from "@/components/ui/icon-renderer";
import { getHabitStats, getWeeklyProgress, getMonthlyProgress, getWeekStart, formatDate } from "@/lib/habitUtils";

const Progress: React.FC = () => {
  const habits = useHabits();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedHabit, setSelectedHabit] = useState<string>('all');
  
  const today = new Date();
  const weekStart = getWeekStart(today);

  // Filtrar hábitos según selección
  const filteredHabits = selectedHabit === 'all' ? habits : habits.filter(h => h.id === selectedHabit);

  // Generar datos para gráficos
  const generateProgressData = () => {
    const data = [];
    const daysToShow = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      
      let completed = 0;
      let total = 0;
      
      filteredHabits.forEach(habit => {
        const log = habit.logs[dateStr];
        if (log) {
          total++;
          if (log.completed) {
            completed++;
          }
        }
      });
      
      data.push({
        date: dateStr,
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0
      });
    }
    
    return data;
  };

  const progressData = generateProgressData();
  const avgCompletion = progressData.length > 0 
    ? Math.round(progressData.reduce((acc, day) => acc + day.percentage, 0) / progressData.length)
    : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Progreso y Estadísticas</h1>

      {/* Controles de filtro */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Período */}
          <div>
            <h3 className="font-semibold mb-2">Período</h3>
            <div className="flex space-x-2">
              {[
                { key: 'week', label: 'Semana' },
                { key: 'month', label: 'Mes' },
                { key: 'year', label: 'Año' }
              ].map(period => (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key as 'week' | 'month' | 'year')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hábito */}
          <div>
            <h3 className="font-semibold mb-2">Hábito</h3>
            <select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los hábitos</option>
              {habits.map(habit => (
                <option key={habit.id} value={habit.id}>{habit.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{avgCompletion}%</div>
          <div className="text-sm text-gray-500">Promedio {selectedPeriod === 'week' ? 'semanal' : selectedPeriod === 'month' ? 'mensual' : 'anual'}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {progressData.reduce((acc, day) => acc + day.completed, 0)}
          </div>
          <div className="text-sm text-gray-500">Tareas completadas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {progressData.filter(day => day.percentage === 100).length}
          </div>
          <div className="text-sm text-gray-500">Días perfectos</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {habits.length > 0 ? Math.max(...habits.map(h => getHabitStats(h).currentStreak), 0) : 0}
          </div>
          <div className="text-sm text-gray-500">Mejor racha</div>
        </div>
      </div>

      {/* Gráfico de progreso simple */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          Progreso {selectedPeriod === 'week' ? 'Semanal' : selectedPeriod === 'month' ? 'Mensual' : 'Anual'}
        </h3>
        <div className="space-y-2">
          {progressData.slice(-14).map((day) => (
            <div key={day.date} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div 
                  className={`h-4 rounded-full transition-all duration-300 ${
                    day.percentage === 100 ? 'bg-green-500' :
                    day.percentage >= 75 ? 'bg-blue-500' :
                    day.percentage >= 50 ? 'bg-yellow-500' :
                    day.percentage > 0 ? 'bg-red-400' : 'bg-gray-300'
                  }`}
                  style={{ width: `${Math.max(day.percentage, 5)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                  {day.percentage > 0 ? `${day.completed}/${day.total}` : ''}
                </span>
              </div>
              <div className="w-12 text-xs text-gray-600 text-right">
                {Math.round(day.percentage)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas detalladas por hábito */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Estadísticas por Hábito</h3>
        <div className="space-y-4">
          {habits.map(habit => {
            const stats = getHabitStats(habit);
            const weeklyProgress = getWeeklyProgress(habit.logs, habit.frequency, weekStart);
            const monthlyProgress = getMonthlyProgress(habit.logs, habit.frequency, today.getMonth(), today.getFullYear());
            
            return (
              <div key={habit.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <IconRenderer iconName={habit.icon} className="w-6 h-6" />
                    <div>
                      <h4 className="font-semibold">{habit.name}</h4>
                      <p className="text-sm text-gray-500">{habit.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">{stats.currentStreak}</div>
                    <div className="text-xs text-gray-500">días de racha</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-blue-600">{weeklyProgress.percentage}%</div>
                    <div className="text-xs text-gray-500">Esta semana</div>
                    <div className="text-xs text-gray-400">{weeklyProgress.completed}/{weeklyProgress.expected}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-600">{monthlyProgress.percentage}%</div>
                    <div className="text-xs text-gray-500">Este mes</div>
                    <div className="text-xs text-gray-400">{monthlyProgress.completed}/{monthlyProgress.expected}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600">{stats.successRate}%</div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-xs text-gray-400">{stats.totalDaysCompleted} días</div>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights y recomendaciones */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span>Insights</span>
        </h3>
        <div className="space-y-3">
          {/* Mejor hábito */}
          {habits.length > 0 && (() => {
            const bestHabit = habits.reduce((best, current) => 
              getHabitStats(current).successRate > getHabitStats(best).successRate ? current : best
            );
            return (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Trophy className="w-8 h-8 text-green-500" />
                <div>
                  <div className="font-medium text-green-800">Tu mejor hábito</div>
                  <div className="text-sm text-green-700">
                    {bestHabit.name} con {getHabitStats(bestHabit).successRate}% de éxito
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Hábito que necesita atención */}
          {habits.length > 0 && (() => {
            const worstHabit = habits.reduce((worst, current) => 
              getHabitStats(current).successRate < getHabitStats(worst).successRate ? current : worst
            );
            return (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="font-medium text-yellow-800">Necesita atención</div>
                  <div className="text-sm text-yellow-700">
                    {worstHabit.name} - considera ajustar la frecuencia o la meta
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Racha más larga */}
          {habits.length > 0 && (() => {
            const longestStreakHabit = habits.reduce((longest, current) => 
              getHabitStats(current).longestStreak > getHabitStats(longest).longestStreak ? current : longest
            );
            return (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="font-medium text-orange-800">Récord personal</div>
                  <div className="text-sm text-orange-700">
                    {longestStreakHabit.name}: {getHabitStats(longestStreakHabit).longestStreak} días seguidos
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Progress;
