import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../component/Toast';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    const toast = { id, message, type, show: true };
    setToasts((t) => [...t, toast]);

    // auto-remove after duration
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
