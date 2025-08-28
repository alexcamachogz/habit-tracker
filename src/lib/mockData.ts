// Datos de ejemplo para testing de la aplicación
import type { Habit, User } from '@/types/habit';

export const mockUser: User = {
  id: 'user1',
  name: 'Usuario de Prueba',
  email: 'usuario@example.com',
  createdAt: new Date('2025-08-01'),
};

export const mockHabits: Habit[] = [
  {
    id: 'habit1',
    userId: 'user1',
    name: 'Ejercicio en el Gym',
    icon: '🏋️',
    frequency: {
      type: 'weekly',
      days: [1, 3, 5], // Lunes, Miércoles, Viernes
    },
    trackingType: 'detailed',
    description: 'Mantenerme en forma con rutina de ejercicios',
    category: 'gym',
    createdAt: new Date('2025-08-01'),
    logs: {
      '2025-08-26': {
        date: '2025-08-26',
        completed: true,
        details: { type: 'pesas', duration: 60 },
        markedLate: false,
        timestamp: new Date('2025-08-26T07:30:00'),
      },
      '2025-08-28': {
        date: '2025-08-28',
        completed: true,
        details: { type: 'cardio', duration: 45 },
        markedLate: false,
        timestamp: new Date('2025-08-28T08:00:00'),
      },
    },
  },
  {
    id: 'habit2',
    userId: 'user1',
    name: 'Rutina de Skincare',
    icon: '🧴',
    frequency: {
      type: 'daily',
    },
    trackingType: 'detailed',
    description: 'Cuidado facial mañana y noche',
    category: 'skincare',
    createdAt: new Date('2025-08-01'),
    logs: {
      '2025-08-26': {
        date: '2025-08-26',
        completed: true,
        details: { morning: true, night: true },
        markedLate: false,
        timestamp: new Date('2025-08-26T22:00:00'),
      },
      '2025-08-27': {
        date: '2025-08-27',
        completed: false,
        details: { morning: true, night: false },
        markedLate: true,
        timestamp: new Date('2025-08-28T09:00:00'),
      },
      '2025-08-28': {
        date: '2025-08-28',
        completed: true,
        details: { morning: true, night: false },
        markedLate: false,
        timestamp: new Date('2025-08-28T09:30:00'),
      },
    },
  },
  {
    id: 'habit3',
    userId: 'user1',
    name: 'Lectura',
    icon: '📚',
    frequency: {
      type: 'daily',
    },
    trackingType: 'detailed',
    description: 'Leer al menos 20 minutos al día',
    category: 'lectura',
    createdAt: new Date('2025-08-15'),
    logs: {
      '2025-08-26': {
        date: '2025-08-26',
        completed: true,
        details: { minutes: 25, pages: 8 },
        markedLate: false,
        timestamp: new Date('2025-08-26T20:00:00'),
      },
      '2025-08-27': {
        date: '2025-08-27',
        completed: true,
        details: { minutes: 30, pages: 10 },
        markedLate: false,
        timestamp: new Date('2025-08-27T21:00:00'),
      },
    },
  },
  {
    id: 'habit4',
    userId: 'user1',
    name: 'Plan de Alimentación',
    icon: '🥗',
    frequency: {
      type: 'weekly',
      days: [1, 2, 3, 4, 5], // Lunes a Viernes
    },
    trackingType: 'detailed',
    description: 'Seguir plan nutricional saludable',
    category: 'alimentacion',
    createdAt: new Date('2025-08-10'),
    logs: {
      '2025-08-26': {
        date: '2025-08-26',
        completed: true,
        details: { meals: '3/3' },
        markedLate: false,
        timestamp: new Date('2025-08-26T19:00:00'),
      },
      '2025-08-27': {
        date: '2025-08-27',
        completed: false,
        details: { meals: '1/3' },
        markedLate: false,
        timestamp: new Date('2025-08-27T20:00:00'),
      },
    },
  },
];
