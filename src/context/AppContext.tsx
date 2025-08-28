import React, { createContext, useContext, useReducer } from 'react';
import type { Habit, HabitLog, User } from '@/types/habit';
import type { ReactNode } from 'react';
import { mockUser, mockHabits } from '@/lib/mockData';

// Estado global de la aplicación
interface AppState {
  user: User | null;
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

// Acciones del reducer
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_LOG'; payload: { habitId: string; log: HabitLog } }
  | { type: 'UPDATE_LOG'; payload: { habitId: string; date: string; updates: Partial<HabitLog> } };

// Estado inicial con datos de ejemplo
const initialState: AppState = {
  user: mockUser,
  habits: mockHabits,
  loading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        ),
      };
    
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
      };
    
    case 'ADD_LOG':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.habitId
            ? {
                ...habit,
                logs: {
                  ...habit.logs,
                  [action.payload.log.date]: action.payload.log,
                },
              }
            : habit
        ),
      };
    
    case 'UPDATE_LOG':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.habitId
            ? {
                ...habit,
                logs: {
                  ...habit.logs,
                  [action.payload.date]: {
                    ...habit.logs[action.payload.date],
                    ...action.payload.updates,
                  },
                },
              }
            : habit
        ),
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
