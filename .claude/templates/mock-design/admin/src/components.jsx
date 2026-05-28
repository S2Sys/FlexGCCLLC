// Breadcrumb component

const Breadcrumb = ({ items }) => {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <Icon name="chevronRight" size={14} style={{ color: 'var(--text-mute)' }} />
          )}
          {item.href ? (
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                if (item.onClick) item.onClick();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: i === items.length - 1 ? 'var(--text)' : 'var(--text-soft)',
                fontWeight: i === items.length - 1 ? 600 : 500,
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => { if (i !== items.length - 1) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (i !== items.length - 1) e.currentTarget.style.color = 'var(--text-soft)'; }}
            >
              {item.icon && <Icon name={item.icon} size={15} />}
              {item.label}
            </a>
          ) : (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text)',
              fontWeight: 600,
            }}>
              {item.icon && <Icon name={item.icon} size={15} />}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Dropdown menu component
const DropdownMenu = ({ trigger, items, align = 'left' }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          [align]: 0,
          minWidth: 200,
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-lg)',
          padding: 6,
          zIndex: 100,
          animation: 'fadeIn 0.15s ease',
        }}>
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {item.divider ? (
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              ) : item.submenu ? (
                <SubmenuItem item={item} onClose={() => setOpen(false)} />
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  disabled={item.disabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: 13,
                    color: item.danger ? 'var(--danger)' : 'var(--text)',
                    borderRadius: 6,
                    textAlign: 'left',
                    opacity: item.disabled ? 0.5 : 1,
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!item.disabled) {
                      e.currentTarget.style.background = item.danger ? 'var(--danger-soft)' : 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {item.icon && <Icon name={item.icon} size={14} style={{ color: item.danger ? 'var(--danger)' : 'var(--text-soft)' }} />}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <Badge tone="neutral" size="sm">{item.badge}</Badge>}
                  {item.shortcut && (
                    <kbd style={{
                      fontSize: 10,
                      fontFamily: 'JetBrains Mono, monospace',
                      padding: '2px 5px',
                      borderRadius: 4,
                      background: 'var(--bg-sunken)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-soft)',
                    }}>{item.shortcut}</kbd>
                  )}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

// Submenu item (nested dropdown)
const SubmenuItem = ({ item, onClose }) => {
  const [subOpen, setSubOpen] = React.useState(false);
  const ref = React.useRef(null);

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseEnter={() => setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
    >
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '8px 10px',
          fontSize: 13,
          color: 'var(--text)',
          borderRadius: 6,
          textAlign: 'left',
          background: subOpen ? 'var(--bg-hover)' : 'transparent',
        }}
      >
        {item.icon && <Icon name={item.icon} size={14} style={{ color: 'var(--text-soft)' }} />}
        <span style={{ flex: 1 }}>{item.label}</span>
        <Icon name="chevronRight" size={12} style={{ color: 'var(--text-mute)' }} />
      </button>
      {subOpen && (
        <div style={{
          position: 'absolute',
          left: '100%',
          top: 0,
          minWidth: 180,
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: 'var(--shadow-lg)',
          padding: 6,
          marginLeft: 4,
          zIndex: 101,
          animation: 'fadeIn 0.12s ease',
        }}>
          {item.submenu.map((subitem, j) => (
            <button
              key={j}
              onClick={() => {
                subitem.onClick?.();
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px 10px',
                fontSize: 13,
                color: 'var(--text)',
                borderRadius: 6,
                textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {subitem.icon && <Icon name={subitem.icon} size={14} style={{ color: 'var(--text-soft)' }} />}
              {subitem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Side panel component (for settings, edit forms, etc)
const SidePanel = ({ open, onClose, title, children, width = 480, footer }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          animation: 'fadeIn 0.15s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: width,
          background: 'var(--bg-elev)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease',
        }}
      >
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <IconButton icon="close" size={32} onClick={onClose} />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}>{footer}</div>
        )}
      </div>
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
};

Object.assign(window, { Breadcrumb, DropdownMenu, SidePanel });
