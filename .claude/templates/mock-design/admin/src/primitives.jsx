// Reusable UI primitives

const Avatar = ({ name, color = '#6366f1', size = 28 }) => {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, minWidth: size,
      borderRadius: '50%',
      background: color,
      color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600,
      letterSpacing: '0.02em',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
    }}>{initials}</div>
  );
};

const Badge = ({ children, tone = 'neutral', size = 'sm' }) => {
  const tones = {
    neutral: { bg: 'var(--bg-sunken)', fg: 'var(--text-soft)', border: 'var(--border)' },
    accent:  { bg: 'var(--accent-soft)', fg: 'var(--accent)', border: 'transparent' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', border: 'transparent' },
    warn:    { bg: 'var(--warn-soft)',    fg: 'var(--warn)',    border: 'transparent' },
    danger:  { bg: 'var(--danger-soft)',  fg: 'var(--danger)',  border: 'transparent' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 500,
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: 999,
      background: t.bg, color: t.fg,
      border: `1px solid ${t.border}`,
      whiteSpace: 'nowrap',
      lineHeight: 1.4,
    }}>{children}</span>
  );
};

const StatusDot = ({ status }) => {
  const colors = {
    active: 'var(--success)',
    invited: 'var(--warn)',
    suspended: 'var(--danger)',
    online: 'var(--success)',
    offline: 'var(--text-mute)',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontSize: 12, color: 'var(--text-soft)', textTransform: 'capitalize', fontWeight: 500,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: colors[status] || colors.offline,
        boxShadow: `0 0 0 3px color-mix(in srgb, ${colors[status] || colors.offline} 18%, transparent)`,
      }} />
      {status}
    </span>
  );
};

const Button = ({ children, variant = 'secondary', size = 'md', icon, iconRight, onClick, type = 'button', style, disabled }) => {
  const sizes = {
    sm: { padding: '6px 10px', fontSize: 12, height: 28, iconSize: 14, gap: 6 },
    md: { padding: '8px 14px', fontSize: 13, height: 34, iconSize: 15, gap: 8 },
    lg: { padding: '10px 18px', fontSize: 14, height: 40, iconSize: 16, gap: 8 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: 'var(--accent)', color: 'var(--accent-fg)',
      border: '1px solid var(--accent)',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'var(--bg-elev)', color: 'var(--text)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-soft)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--danger-soft)', color: 'var(--danger)',
      border: '1px solid transparent',
    },
  };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        padding: s.padding, fontSize: s.fontSize, height: s.height,
        fontWeight: 500,
        borderRadius: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        ...v,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = variant === 'ghost' ? 'none' : 'brightness(0.97)'; if (variant === 'ghost') e.currentTarget.style.background = 'var(--bg-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none'; if (variant === 'ghost') e.currentTarget.style.background = 'transparent'; }}
    >
      {icon && <Icon name={icon} size={s.iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.iconSize} />}
    </button>
  );
};

const IconButton = ({ icon, onClick, size = 34, tooltip, active, style }) => (
  <button
    onClick={onClick}
    title={tooltip}
    style={{
      width: size, height: size,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 8,
      background: active ? 'var(--bg-sunken)' : 'transparent',
      color: active ? 'var(--text)' : 'var(--text-soft)',
      border: '1px solid transparent',
      transition: 'all 0.15s ease',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = active ? 'var(--bg-sunken)' : 'transparent'; e.currentTarget.style.color = active ? 'var(--text)' : 'var(--text-soft)'; }}
  >
    <Icon name={icon} size={18} />
  </button>
);

const Card = ({ children, style, padding = 20, interactive, dataAos, aosDelay, className }) => (
  <div
    data-aos={dataAos}
    style={{
      '--aos-delay': aosDelay ? `${aosDelay}ms` : undefined,
      background: 'var(--bg-elev)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding,
      transition: 'all 0.2s ease',
      ...(interactive ? { cursor: 'pointer' } : {}),
      ...style,
    }}
    className={[interactive ? 'lift' : '', className || ''].join(' ').trim()}
  >{children}</div>
);

const _HomeSvg = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>
  </svg>
);
const _ChevSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--border-strong)' }}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const SectionHeader = ({ title, subtitle, action, crumbs }) => {
  const ancestors = crumbs ? crumbs.slice(0, -1) : [];
  const current   = crumbs ? crumbs[crumbs.length - 1] : null;
  const displayTitle = current ? current.label : title;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {ancestors.map((crumb, i) => (
            <React.Fragment key={i}>
              {crumb.href ? (
                <a href={crumb.href} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-mute)', textDecoration: 'none', transition: 'color 0.12s', lineHeight: 1 }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-soft)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mute)'}
                >
                  {crumb.icon === 'home' ? <_HomeSvg /> : <span style={{ fontSize: 13, fontWeight: 500 }}>{crumb.label}</span>}
                </a>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-mute)', lineHeight: 1 }}>
                  {crumb.icon === 'home' ? <_HomeSvg /> : <span style={{ fontSize: 13, fontWeight: 500 }}>{crumb.label}</span>}
                </span>
              )}
              <_ChevSvg />
            </React.Fragment>
          ))}
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', margin: 0, lineHeight: 1.15 }}>
            {displayTitle}
          </h1>
        </div>
        {action}
      </div>
      {subtitle && <p style={{ fontSize: 14, color: 'var(--text-soft)', marginTop: 5, paddingLeft: ancestors.length > 0 ? 0 : 0 }}>{subtitle}</p>}
    </div>
  );
};

const Input = ({ value, onChange, placeholder, icon, style, type = 'text' }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'var(--bg-elev)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0 12px',
    height: 34,
    transition: 'all 0.15s ease',
    ...style,
  }}
    onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px var(--ring)`}
    onBlur={e => e.currentTarget.style.boxShadow = 'none'}
  >
    {icon && <Icon name={icon} size={15} style={{ color: 'var(--text-mute)' }} />}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        border: 'none', outline: 'none', background: 'transparent',
        fontSize: 13, flex: 1, color: 'var(--text)', minWidth: 0,
      }}
    />
  </div>
);

const Select = ({ value, onChange, options, style }) => (
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <select
      value={value}
      onChange={onChange}
      style={{
        appearance: 'none',
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '0 32px 0 12px',
        height: 34,
        fontSize: 13,
        color: 'var(--text)',
        cursor: 'pointer',
        outline: 'none',
        ...style,
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <Icon name="chevronDown" size={14} style={{
      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
      color: 'var(--text-mute)', pointerEvents: 'none',
    }} />
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
    <span
      onClick={() => onChange(!checked)}
      style={{
        width: 34, height: 20,
        borderRadius: 999,
        background: checked ? 'var(--accent)' : 'var(--border-strong)',
        position: 'relative',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2, left: checked ? 16 : 2,
        width: 16, height: 16,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
      }} />
    </span>
    {label && <span style={{ fontSize: 13, color: 'var(--text)' }}>{label}</span>}
  </label>
);

const EmptyState = ({ icon, title, subtitle, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px', textAlign: 'center', gap: 8,
  }}>
    {icon && <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: 'var(--bg-sunken)', color: 'var(--text-mute)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    }}><Icon name={icon} size={22} /></div>}
    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
    {subtitle && <div style={{ fontSize: 13, color: 'var(--text-soft)', maxWidth: 320 }}>{subtitle}</div>}
    {action && <div style={{ marginTop: 12 }}>{action}</div>}
  </div>
);

const Modal = ({ open, onClose, title, children, footer, width = 520 }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-lg)',
          width: '100%', maxWidth: width,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          animation: 'scaleIn 0.18s ease',
        }}
      >
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
          <IconButton icon="close" size={28} onClick={onClose} />
        </div>
        <div style={{ padding: 22, overflow: 'auto', flex: 1 }}>{children}</div>
        {footer && <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>{footer}</div>}
      </div>
    </div>
  );
};

const Skeleton = ({ w = '100%', h = 14, r = 6 }) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    background: 'var(--bg-sunken)',
    animation: 'pulse 1.5s ease-in-out infinite',
  }} />
);

// Key-value list (for settings rows etc)
const SettingRow = ({ label, hint, children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 280px) 1fr',
    gap: 32,
    padding: '20px 0',
    borderBottom: '1px solid var(--border)',
    alignItems: 'flex-start',
  }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</div>
      {hint && <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 4, lineHeight: 1.5 }}>{hint}</div>}
    </div>
    <div>{children}</div>
  </div>
);

Object.assign(window, {
  Avatar, Badge, StatusDot, Button, IconButton, Card, SectionHeader,
  Input, Select, Toggle, EmptyState, Modal, Skeleton, SettingRow,
});
