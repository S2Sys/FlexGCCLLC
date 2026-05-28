// Command Palette (⌘K)

const CommandPalette = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(0);
  const inputRef = React.useRef(null);

  const commands = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', action: () => window.location.hash = 'dashboard' },
    { id: 'users', label: 'Users', icon: 'users', action: () => window.location.hash = 'users' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics', action: () => window.location.hash = 'analytics' },
    { id: 'billing', label: 'Billing', icon: 'billing', action: () => window.location.hash = 'billing' },
    { id: 'team', label: 'Team', icon: 'team', action: () => window.location.hash = 'team' },
    { id: 'activity', label: 'Activity', icon: 'activity', action: () => window.location.hash = 'activity' },
    { id: 'settings', label: 'Settings', icon: 'settings', action: () => window.location.hash = 'settings' },
    { id: 'theme-toggle', label: 'Toggle theme', icon: 'moon', action: () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    }},
    { id: 'logout', label: 'Log out', icon: 'logout', action: () => {
      localStorage.clear();
      window.location.reload();
    }},
  ];

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    setSelected(0);
  }, [open]);

  React.useEffect(() => {
    setSelected(0);
  }, [search]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      e.preventDefault();
      filtered[selected].action();
      setOpen(false);
      setSearch('');
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '15vh 20px 20px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          width: '100%',
          maxWidth: 600,
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.2s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Icon name="search" size={18} style={{ color: 'var(--text-mute)' }} />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search commands..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 15,
              color: 'var(--text)',
            }}
          />
          <kbd style={{
            fontSize: 10,
            fontFamily: 'JetBrains Mono, monospace',
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--bg-sunken)',
            border: '1px solid var(--border)',
            color: 'var(--text-soft)',
          }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-soft)',
              fontSize: 13,
            }}>No commands found</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setOpen(false);
                  setSearch('');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 18px',
                  border: 'none',
                  background: i === selected ? 'var(--bg-sunken)' : 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  textAlign: 'left',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={() => setSelected(i)}
              >
                <Icon name={cmd.icon} size={16} style={{ color: 'var(--text-soft)' }} />
                <span style={{ flex: 1 }}>{cmd.label}</span>
                {i === selected && (
                  <Icon name="arrowRight" size={14} style={{ color: 'var(--text-mute)' }} />
                )}
              </button>
            ))
          )}
        </div>

        <div style={{
          padding: '8px 18px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 12,
          fontSize: 11,
          color: 'var(--text-mute)',
        }}>
          <span><kbd style={{ padding: '1px 4px', borderRadius: 3, background: 'var(--bg-sunken)' }}>↑↓</kbd> Navigate</span>
          <span><kbd style={{ padding: '1px 4px', borderRadius: 3, background: 'var(--bg-sunken)' }}>↵</kbd> Select</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CommandPalette });
