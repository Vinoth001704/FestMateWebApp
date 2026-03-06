import React from 'react';
import './styles/Toast.css';

export default function Toast({ toast }) {
  if (!toast?.show) return null;
  const typeClass = toast.type === 'success' ? 'toast--success' : 'toast--danger';
  return (
    <div className={`toast ${typeClass}`} role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}
