import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '90px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 size={18} color="#17653e" />,
          error: <AlertCircle size={18} color="#b91c1c" />,
          warning: <AlertTriangle size={18} color="#c27803" />,
          info: <Info size={18} color="#173f34" />,
        };

        const bgColors = {
          success: '#eaf5ee',
          error: '#fef2f2',
          warning: '#fef7ea',
          info: '#f6f3ec',
        };

        const borderColors = {
          success: '#a3d9b8',
          error: '#fca5a5',
          warning: '#fcd34d',
          info: '#dda943',
        };

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: bgColors[toast.type],
              border: `1.5px solid ${borderColors[toast.type]}`,
              borderRadius: '12px',
              padding: '12px 14px',
              boxShadow: '0 8px 24px rgba(23, 39, 31, 0.12)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.25s ease-out'
            }}
          >
            <div style={{ marginTop: '2px' }}>{icons[toast.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#17271f' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '2px' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#929b98',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
