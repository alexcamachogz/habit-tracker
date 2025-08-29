import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl w-full mx-auto px-8">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cargando...</h2>
        <p className="text-lg text-gray-600 leading-relaxed">Preparando tu experiencia</p>
      </div>
    </div>
  );
};

export default Loading;
