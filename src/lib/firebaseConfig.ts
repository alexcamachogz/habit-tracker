// Archivo para verificar la configuración de Firebase
import { auth, db } from './firebase';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

export class FirebaseConfig {
  static isConfigured = false;
  
  static async verifyConfiguration(): Promise<boolean> {
    try {
      // Verificar que las variables de entorno estén configuradas
      const requiredEnvVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID'
      ];
      
      for (const envVar of requiredEnvVars) {
        if (!import.meta.env[envVar]) {
          console.error(`Variable de entorno faltante: ${envVar}`);
          return false;
        }
      }
      
      // Verificar que Firebase esté inicializado
      if (!auth.app) {
        console.error('Firebase Auth no está inicializado');
        return false;
      }
      
      if (!db.app) {
        console.error('Firestore no está inicializado');
        return false;
      }
      
      this.isConfigured = true;
      console.log('Firebase configurado correctamente');
      return true;
    } catch (error) {
      console.error('Error al verificar configuración de Firebase:', error);
      return false;
    }
  }
  
  static getStatus() {
    return {
      configured: this.isConfigured,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
    };
  }
}
