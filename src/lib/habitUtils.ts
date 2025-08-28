// Utilidades para cálculos de hábitos según la definición del producto
import type { Habit, HabitFrequency, HabitLog, HabitStats } from '@/types/habit';

/**
 * Verifica si un hábito debe estar activo en una fecha específica
 */
export const isHabitActiveToday = (frequency: HabitFrequency, targetDate: Date): boolean => {
  const dayOfWeek = targetDate.getDay(); // 0=domingo, 1=lunes...

  switch (frequency.type) {
    case 'daily':
      return true;
    
    case 'weekly':
      return frequency.days?.includes(dayOfWeek) ?? false;
    
    case 'custom':
      // TODO: Implementar lógica custom según count/period
      return true; // Por ahora asumimos que está activo
    
    default:
      return false;
  }
};

/**
 * Calcula la racha actual y más larga de un hábito
 */
export const calculateStreak = (
  logs: Record<string, HabitLog>, 
  frequency: HabitFrequency, 
  currentDate: Date = new Date()
): { currentStreak: number; longestStreak: number } => {
  const sortedDates = Object.keys(logs)
    .filter(date => logs[date].completed)
    .sort()
    .reverse();

  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
//   const today = formatDate(currentDate);
  const checkDate = new Date(currentDate);
  
  // Calcular racha actual
  for (let i = 0; i < 100; i++) { // máximo 100 días hacia atrás
    const dateStr = formatDate(checkDate);
    
    if (isHabitActiveToday(frequency, checkDate)) {
      if (logs[dateStr]?.completed) {
        if (i === 0 || currentStreak > 0) { // Continua la racha
          currentStreak++;
        }
      } else {
        break; // Se rompe la racha
      }
    }
    
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calcular racha más larga histórica
  for (const dateStr of sortedDates) {
    tempStreak++;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    
    // Verificar si la racha continúa
    const nextDate = new Date(dateStr);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = formatDate(nextDate);
    
    if (!logs[nextDateStr]?.completed) {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
};

/**
 * Calcula el progreso en un período específico
 */
export const getProgress = (
  logs: Record<string, HabitLog>,
  frequency: HabitFrequency,
  startDate: Date,
  endDate: Date
): { completed: number; expected: number; percentage: number } => {
  let expected = 0;
  let completed = 0;
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isHabitActiveToday(frequency, currentDate)) {
      expected++;
      const dateStr = formatDate(currentDate);
      if (logs[dateStr]?.completed) {
        completed++;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const percentage = expected > 0 ? Math.round((completed / expected) * 100) : 0;
  
  return { completed, expected, percentage };
};

/**
 * Obtiene estadísticas generales de un hábito
 */
export const getHabitStats = (habit: Habit): HabitStats => {
  const { currentStreak, longestStreak } = calculateStreak(habit.logs, habit.frequency);
  
  const completedLogs = Object.values(habit.logs).filter(log => log.completed);
  const totalDaysCompleted = completedLogs.length;
  
  // Calcular tasa de éxito desde la creación
  const today = new Date();
  const createdAt = new Date(habit.createdAt);
  const { completed, expected } = getProgress(habit.logs, habit.frequency, createdAt, today);
  const successRate = expected > 0 ? Math.round((completed / expected) * 100) : 0;
  
  // Última fecha completada
  const lastCompletedDate = completedLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    ?.timestamp;

  return {
    currentStreak,
    longestStreak,
    totalDaysCompleted,
    successRate,
    lastCompletedDate,
  };
};

/**
 * Progreso semanal
 */
export const getWeeklyProgress = (
  logs: Record<string, HabitLog>,
  frequency: HabitFrequency,
  weekStart: Date
) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return getProgress(logs, frequency, weekStart, weekEnd);
};

/**
 * Progreso mensual
 */
export const getMonthlyProgress = (
  logs: Record<string, HabitLog>,
  frequency: HabitFrequency,
  month: number,
  year: number
) => {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  return getProgress(logs, frequency, monthStart, monthEnd);
};

/**
 * Genera array de fechas activas en un período
 */
export const generateActiveDates = (
  frequency: HabitFrequency,
  startDate: Date,
  endDate: Date
): string[] => {
  const activeDates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isHabitActiveToday(frequency, currentDate)) {
      activeDates.push(formatDate(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return activeDates;
};

/**
 * Verifica si un log fue marcado tardíamente
 */
export const isMarkedLate = (logDate: string, actualDate: Date): boolean => {
  const logDateTime = new Date(logDate);
  const actualDateTime = new Date(actualDate);
  
  // Si se marcó después del día correspondiente
  return actualDateTime.getTime() > logDateTime.getTime() + (24 * 60 * 60 * 1000);
};

/**
 * Formatea fecha a string YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Obtiene el inicio de la semana (lunes)
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el inicio
  return new Date(d.setDate(diff));
};
