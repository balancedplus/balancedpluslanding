'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// Context para manejar toasts globalmente
const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}

// Componente individual de Toast
function Toast({ toast, onRemove }) {
  const getToastStyles = (type) => {
    const base = "fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 max-w-xl ";
    
    switch (type) {
      case 'success':
        return `${base} bg-white text-gray-800`;
      case 'error':
        return `${base} bg-white text-gray-800`;
      case 'warning':
        return `${base} bbg-white text-gray-800`;
      default:
        return `${base} bg-white text-gray-800`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={getToastStyles(toast.type)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getIcon(toast.type)}</span>
          <span className="font-medium">{toast.message}</span>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 text-white hover:text-gray-200 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Provider que maneja el estado global de toasts
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove después del duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  }, [removeToast]); // Ahora removeToast está definido antes

  // Métodos de conveniencia
  const showSuccess = useCallback((message) => addToast(message, 'success'), [addToast]);
  const showError = useCallback((message) => addToast(message, 'error'), [addToast]);
  const showWarning = useCallback((message) => addToast(message, 'warning'), [addToast]);
  const showInfo = useCallback((message) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      
      {/* Renderizar todos los toasts activos */}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ 
              transform: `translateY(${index * 80}px)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}