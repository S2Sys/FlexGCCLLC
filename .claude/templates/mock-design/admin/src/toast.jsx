// Toast notification system

const ToastContext = React.createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warn: (msg, duration) => addToast(msg, 'warn', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 420,
      }}>
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: { bg: 'var(--success-soft)', border: 'var(--success)', icon: 'check' },
    error: { bg: 'var(--danger-soft)', border: 'var(--danger)', icon: 'alert' },
    warn: { bg: 'var(--warn-soft)', border: 'var(--warn)', icon: 'alert' },
    info: { bg: 'var(--accent-soft)', border: 'var(--accent)', icon: 'info' },
  };
  const s = styles[type] || styles.info;

  return (
    <div style={{
      background: 'var(--bg-elev)',
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: 'var(--shadow-lg)',
      animation: 'slideIn 0.25s ease',
      minWidth: 280,
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: s.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={s.icon} size={16} style={{ color: s.border }} />
      </div>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-mute)',
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
        }}
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
};

const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

Object.assign(window, { ToastProvider, useToast });
