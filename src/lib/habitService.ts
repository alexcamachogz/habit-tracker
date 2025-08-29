import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Habit, HabitLog, HabitDetails } from '@/types/habit';

export class HabitService {
    // Obtener todos los hábitos del usuario
  static async getUserHabits(userId: string): Promise<Habit[]> {
    try {
      const habitsRef = collection(db, 'habits');
      const q = query(habitsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const habits: Habit[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        habits.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          icon: data.icon,
          frequency: data.frequency,
          trackingType: data.trackingType || 'boolean', // Default para retrocompatibilidad
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          logs: data.logs || {}
        });
      });
      
      return habits;
    } catch (error) {
      console.error('Error al obtener hábitos:', error);
      // Retornar array vacío en lugar de fallar
      return [];
    }
  }

  // Crear nuevo hábito
  static async createHabit(habitData: Omit<Habit, 'id'>): Promise<string> {
    try {
      const habitsRef = collection(db, 'habits');
      const docRef = await addDoc(habitsRef, {
        ...habitData,
        createdAt: Timestamp.fromDate(habitData.createdAt),
        logs: {}
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error al crear hábito:', error);
      throw error;
    }
  }

  // Actualizar hábito existente
  static async updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const updateData = { ...updates };
      
      // Convertir fechas a Timestamp si es necesario
      if (updateData.createdAt) {
        const updateDataWithTimestamp = updateData as Record<string, unknown>;
        updateDataWithTimestamp.createdAt = Timestamp.fromDate(updateData.createdAt);
      }
      
      await updateDoc(habitRef, updateData);
    } catch (error) {
      console.error('Error al actualizar hábito:', error);
      throw error;
    }
  }

  // Eliminar hábito
  static async deleteHabit(habitId: string): Promise<void> {
    try {
      const habitRef = doc(db, 'habits', habitId);
      await deleteDoc(habitRef);
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
      throw error;
    }
  }

  // Marcar hábito como completado
  static async markHabitComplete(
    habitId: string, 
    date: string, 
    completed: boolean,
    details?: HabitDetails
  ): Promise<void> {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const habitDoc = await getDoc(habitRef);
      
      if (!habitDoc.exists()) {
        throw new Error('Hábito no encontrado');
      }
      
      const currentLogs = habitDoc.data().logs || {};
      const log: HabitLog = {
        date,
        completed,
        details,
        markedLate: this.isMarkedLate(date),
        timestamp: new Date()
      };
      
      const updatedLogs = {
        ...currentLogs,
        [date]: log
      };
      
      await updateDoc(habitRef, {
        logs: updatedLogs
      });
    } catch (error) {
      console.error('Error al marcar hábito:', error);
      throw error;
    }
  }

  // Verificar si se está marcando tardíamente
  private static isMarkedLate(logDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return logDate < today;
  }

  // Obtener logs de un hábito específico
  static async getHabitLogs(habitId: string): Promise<Record<string, HabitLog>> {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const habitDoc = await getDoc(habitRef);
      
      if (!habitDoc.exists()) {
        return {};
      }
      
      return habitDoc.data().logs || {};
    } catch (error) {
      console.error('Error al obtener logs del hábito:', error);
      return {};
    }
  }
}
