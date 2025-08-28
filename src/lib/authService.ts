import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import type { User } from '@/types/habit';

export class AuthService {
  // Iniciar sesión con Google
  static async signInWithGoogle(): Promise<User | null> {
    try {
      // Configurar opciones específicas para el popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Crear o actualizar usuario en Firestore
      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Usuario',
        email: firebaseUser.email || '',
        createdAt: new Date()
      };

      await this.createOrUpdateUser(userData);
      return userData;
    } catch (error: unknown) {
      // Manejo específico de errores comunes
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new Error('Popup cerrado por el usuario');
      } else if (firebaseError.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqueado por el navegador');
      } else {
        console.error('Error al iniciar sesión:', error);
        throw error;
      }
    }
  }

  // Obtener resultado del redirect
  static async getRedirectResult(): Promise<User | null> {
    // Este método no es necesario con popup, pero lo mantenemos por compatibilidad
    return null;
  }

  // Cerrar sesión
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Crear o actualizar usuario en Firestore
  static async createOrUpdateUser(userData: User): Promise<void> {
    try {
      const userRef = doc(db, 'users', userData.id);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Nuevo usuario - crear documento
        await setDoc(userRef, {
          ...userData,
          createdAt: userData.createdAt
        });
      } else {
        // Usuario existente - actualizar solo campos necesarios
        await setDoc(userRef, {
          name: userData.name,
          email: userData.email
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error al crear/actualizar usuario:', error);
      throw error;
    }
  }

  // Obtener usuario actual de Firestore
  static async getCurrentUser(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  // Listener para cambios de autenticación
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}
