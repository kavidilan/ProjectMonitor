import React, { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => dismiss(id), 3000);
  }, [dismiss]);

  return { toasts, toast, dismiss };
};

export const ToastContainer = ({ toasts, dismiss }) => {
  const getColor = (type) => {
    switch (type) {
      case 'success': return 'linear-gradient(135deg, #16a34a, #15803d)';
      case 'error': return 'linear-gradient(135deg, #dc2626, #b91c1c)';
      case 'warn': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'linear-gradient(135deg, #0ea5e9, #0284c7)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          style={{
            background: getColor(t.type),
            color: '#fff',
            padding: '11px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            pointerEvents: 'all',
            cursor: 'pointer',
            animation: 'slideIn 0.3s ease-out',
            boxShadow: '0 12px 24px rgba(3, 27, 47, 0.28)',
            minWidth: 250,
          }}
        >
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
