import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Habit, HabitLog, User, HabitDetails } from '@/types/habit';
import type { ReactNode } from 'react';
import { AuthService } from '@/lib/authService';
import { HabitService } from '@/lib/habitService';
import type { User as FirebaseUser } from 'firebase/auth';

// Estado global de la aplicación
interface AppState {
  user: User | null;
  habits: Habit[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
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
  | { type: 'UPDATE_LOG'; payload: { habitId: string; date: string; updates: Partial<HabitLog> } }
  | { type: 'SET_AUTHENTICATED'; payload: boolean };

// Estado inicial
const initialState: AppState = {
  user: null,
  habits: [],
  loading: true,
  error: null,
  isAuthenticated: false
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    
    case 'SET_HABITS':
      return { ...state, habits: action.payload, loading: false };
    
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        )
      };
    
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload)
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
                  [action.payload.log.date]: action.payload.log
                }
              }
            : habit
        )
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
                    ...action.payload.updates
                  }
                }
              }
            : habit
        )
      };

    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Métodos de autenticación
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  // Métodos de hábitos
  createHabit: (habitData: Omit<Habit, 'id'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  markHabitComplete: (habitId: string, date: string, completed: boolean, details?: HabitDetails) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Listener de autenticación
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          // Obtener datos completos del usuario
          const userData = await AuthService.getCurrentUser(firebaseUser.uid);
          if (userData) {
            dispatch({ type: 'SET_USER', payload: userData });
            
            // Cargar hábitos del usuario
            const habits = await HabitService.getUserHabits(firebaseUser.uid);
            dispatch({ type: 'SET_HABITS', payload: habits });
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos del usuario' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_HABITS', payload: [] });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    return () => unsubscribe();
  }, []);

  // Métodos de autenticación
  const signIn = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const userData = await AuthService.signInWithGoogle();
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al iniciar sesión' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cerrar sesión' });
    }
  };

  // Métodos de hábitos
  const createHabit = async (habitData: Omit<Habit, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const habitId = await HabitService.createHabit(habitData);
      
      const newHabit: Habit = {
        ...habitData,
        id: habitId
      };
      
      dispatch({ type: 'ADD_HABIT', payload: newHabit });
    } catch (error) {
      console.error('Error al crear hábito:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al crear hábito' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    try {
      await HabitService.updateHabit(id, updates);
      dispatch({ type: 'UPDATE_HABIT', payload: { id, updates } });
    } catch (error) {
      console.error('Error al actualizar hábito:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar hábito' });
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await HabitService.deleteHabit(id);
      dispatch({ type: 'DELETE_HABIT', payload: id });
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar hábito' });
    }
  };

  const markHabitComplete = async (habitId: string, date: string, completed: boolean, details?: HabitDetails) => {
    try {
      await HabitService.markHabitComplete(habitId, date, completed, details);
      
      const log: HabitLog = {
        date,
        completed,
        details,
        markedLate: date < new Date().toISOString().split('T')[0],
        timestamp: new Date()
      };
      
      dispatch({ type: 'ADD_LOG', payload: { habitId, log } });
    } catch (error) {
      console.error('Error al marcar hábito:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al marcar hábito' });
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    signIn,
    signOut,
    createHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
