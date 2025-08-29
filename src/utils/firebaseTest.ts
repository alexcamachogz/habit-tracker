// Utilidad para probar la conexión de Firebase
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async (): Promise<{
  auth: boolean;
  firestore: boolean;
  error?: string;
}> => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test Auth connection
    const authTest = auth.app !== null;
    console.log('✅ Auth initialized:', authTest);
    
    // Test Firestore connection
    const firestoreTest = db.app !== null;
    console.log('✅ Firestore initialized:', firestoreTest);
    
    return {
      auth: authTest,
      firestore: firestoreTest
    };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      auth: false,
      firestore: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testFirebaseAuth = async (): Promise<boolean> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log('✅ Auth test successful:', result.user.email);
    return true;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'auth/popup-closed-by-user' || firebaseError.code === 'auth/cancelled-popup-request') {
      console.log('ℹ️ Auth popup cancelled by user');
      return false;
    }
    console.error('❌ Auth test failed:', error);
    return false;
  }
};

export const testFirestore = async (): Promise<boolean> => {
  try {
    if (!auth.currentUser) {
      console.log('⚠️ No user authenticated for Firestore test');
      return false;
    }

    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      timestamp: new Date(),
      message: 'Firebase connection test'
    });
    
    const docSnap = await getDoc(testDoc);
    console.log('✅ Firestore test successful:', docSnap.exists());
    return docSnap.exists();
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
};
