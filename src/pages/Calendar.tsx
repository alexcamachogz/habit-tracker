import React, { useState } from "react";
import { useHabits } from "@/context/selectors";
import { formatDate } from "@/lib/habitUtils";

const CalendarPage: React.FC = () => {
  const habits = useHabits();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Generar días del mes para el calendario
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    
    const startDate = new Date(firstDayOfMonth);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Ajustar para lunes como inicio
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generar 42 días (6 semanas x 7 días)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Obtener estadísticas de un día específico
  const getDayStats = (date: Date) => {
    const dateStr = formatDate(date);
    let completed = 0;
    let total = 0;

    habits.forEach(habit => {
      const log = habit.logs[dateStr];
      if (log) {
        total++;
        if (log.completed) {
          completed++;
        }
      }
    });

    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  // Obtener hábitos y logs del día seleccionado
  const selectedDateStr = formatDate(selectedDate);
  const dayLogs = habits.map(habit => ({
    ...habit,
    log: habit.logs[selectedDateStr] || null
  })).filter(item => item.log !== null);

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
      
      {/* Navegación del mes */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors text-gray-700 border border-gray-200"
          >
            ← Anterior
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors text-gray-700 border border-gray-200"
          >
            Siguiente →
          </button>
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-1">
          {/* Días de la semana */}
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          
          {/* Días del mes */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = formatDate(day) === formatDate(today);
            const isSelected = formatDate(day) === formatDate(selectedDate);
            const dayStats = getDayStats(day);
            const hasActivity = dayStats.total > 0;
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  p-2 text-sm rounded-lg transition-all relative bg-white border border-transparent
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                  ${isToday && isCurrentMonth ? 'bg-blue-50 border-2 border-blue-300 font-bold text-blue-900' : ''}
                  ${isSelected && !isToday ? 'bg-gray-200 border-2 border-gray-400 text-gray-900' : ''}
                  ${!isSelected && !isToday && isCurrentMonth ? 'hover:bg-gray-50' : ''}
                  ${!isCurrentMonth ? 'hover:bg-gray-50' : ''}
                `}
              >
                <div>{day.getDate()}</div>
                {hasActivity && (
                  <div 
                    className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                      dayStats.percentage === 100 ? 'bg-green-500' : 
                      dayStats.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalles del día seleccionado */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">
          {selectedDate.toLocaleDateString('es-ES', { 
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </h3>
        
        {dayLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <p>Sin actividad registrada este día</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayLogs.map(({ id, name, icon, log }) => (
              <div 
                key={id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  log?.completed ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <h4 className={`font-medium ${log?.completed ? 'text-green-800' : 'text-red-800'}`}>
                      {name}
                    </h4>
                    {log?.markedLate && (
                      <span className="text-xs text-orange-600">• Marcado tarde</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl ${log?.completed ? '✅' : '❌'}`} />
                  <span className="text-xs text-gray-500">
                    {log?.timestamp.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen del mes */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Resumen del Mes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {habits.map(habit => {
            const monthLogs = Object.values(habit.logs).filter(log => {
              const logDate = new Date(log.date);
              return logDate.getMonth() === currentMonth.getMonth() && 
                     logDate.getFullYear() === currentMonth.getFullYear();
            });
            
            const completedInMonth = monthLogs.filter(log => log.completed).length;
            
            return (
              <div key={habit.id} className="text-center">
                <div className="text-2xl mb-1">{habit.icon}</div>
                <div className="text-sm font-medium">{habit.name}</div>
                <div className="text-xs text-gray-500">{completedInMonth} días</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
