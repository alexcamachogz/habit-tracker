import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onSignIn: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onSignIn, loading, error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
          <p className="text-gray-600 mb-8">
            Rastrea tus hábitos diarios y alcanza tus metas
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Iniciar Sesión
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            onClick={onSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Continuar con Google
              </div>
            )}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Al iniciar sesión, aceptas nuestros términos de servicio
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Una aplicación web para seguimiento personal de hábitos</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
