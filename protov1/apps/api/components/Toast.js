import { useState, useEffect } from 'react';

let toastId = 0;

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for toast events
    const handleToast = (event) => {
      const { message, type } = event.detail;
      const id = toastId++;
      
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast toast-${toast.type} flex items-center gap-3`}
        >
          <span style={{ fontSize: '1.25rem' }}>{getToastIcon(toast.type)}</span>
          <p className="text-primary" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: '500' }}>
            {toast.message}
          </p>
        </div>
      ))}
    </div>
  );
}

// Helper function to show toast
export function showToast(message, type = 'info') {
  const event = new CustomEvent('toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}
