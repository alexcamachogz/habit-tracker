import { useApp } from './AuthAppContext';

// Selectores útiles separados para Fast Refresh
export const useHabits = () => {
  const { state } = useApp();
  return state.habits;
};

export const useHabit = (id: string) => {
  const { state } = useApp();
  return state.habits.find(habit => habit.id === id);
};

export const useUser = () => {
  const { state } = useApp();
  return state.user;
};
