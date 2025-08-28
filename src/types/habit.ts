// Tipos base para los hábitos según la definición del producto

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'custom';
  days?: number[]; // Para weekly: [1,3,5] (1=lunes, 0=domingo)
  count?: number; // Para custom: cantidad
  period?: 'week' | 'month'; // Para custom: período
}

export interface HabitDetails {
  // Gym
  type?: 'cardio' | 'pesas' | 'funcional' | 'yoga' | 'otro';
  duration?: number;
  
  // Skincare
  morning?: boolean;
  night?: boolean;
  
  // Alimentación
  meals?: string; // "2/3", "3/3", etc.
  
  // Lectura
  minutes?: number;
  pages?: number;
  
  // Genérico para otros
  value?: string | number;
  note?: string;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  details?: HabitDetails;
  markedLate: boolean;
  timestamp: Date;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string; // emoji o lucide icon name
  frequency: HabitFrequency;
  trackingType: 'simple' | 'detailed';
  description?: string;
  category: 'skincare' | 'gym' | 'alimentacion' | 'lectura' | 'otros';
  createdAt: Date;
  logs: Record<string, HabitLog>; // key: YYYY-MM-DD
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  successRate: number; // percentage
  lastCompletedDate?: Date;
}

export interface WeeklyProgress {
  habitId: string;
  completed: number;
  expected: number;
  percentage: number;
}

export interface MonthlyProgress {
  habitId: string;
  completed: number;
  expected: number;
  percentage: number;
  year: number;
  month: number; // 0-11
}

export interface DayProgress {
  date: string; // YYYY-MM-DD
  habits: {
    habitId: string;
    completed: boolean;
    details?: HabitDetails;
  }[];
  totalCompleted: number;
  totalExpected: number;
  percentage: number;
}
