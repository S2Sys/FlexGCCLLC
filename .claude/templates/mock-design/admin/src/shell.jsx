// Shell: sidebar + topbar + content (updated for mobile)
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { 
    id: 'users', 
    label: 'Users', 
    icon: 'users', 
    count: 12,
    submenu: [
      { id: 'users', label: 'All Users' },
      { id: 'users-roles', label: 'Roles & Permissions' },
      { id: 'users-invites', label: 'Pending Invites' },
    ]
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: 'analytics',
    submenu: [
      { id: 'analytics', label: 'Overview' },
      { id: 'analytics-reports', label: 'Reports' },
      { id: 'analytics-insights', label: 'Insights' },
    ]
  },
  { id: 'billing', label: 'Billing', icon: 'billing' },
  { id: 'team', label: 'Team', icon: 'team' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const SCREENS = {
  dashboard: Dashboard,
  users: UsersScreen,
  analytics: AnalyticsScreen,
  billing: BillingScreen,
  team: TeamScreen,
  activity: ActivityScreen,
  settings: SettingsScreen,
};

const Logo = ({ size = 28 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000))',
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px var(--ring)',
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l9-5 9 5-9 5-9-5z"/>
        <path d="M3 12l9 5 9-5"/>
        <path d="M3 17l9 5 9-5"/>
      </svg>
    </div>
  </div>
);

const Sidebar = ({ active, onNav, collapsed, onToggle }) => {
  const [expandedMenu, setExpandedMenu] = React.useState(null);
  
  const toggleSubmenu = (id) => {
    setExpandedMenu(prev => prev === id ? null : id);
  };
  
  const width = collapsed ? 68 : 240;
  return (
    <aside style={{
      width, flexShrink: 0,
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease',
      position: 'sticky', top: 0,
      height: '100vh',
    }}>
      {/* Header — always rendered; position:relative is the containing block for the separator toggle */}
      <div style={{
        height: 64, flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        display: 'flex', alignItems: 'center',
        padding: collapsed ? 0 : '0 18px',
        justifyContent: 'space-between',
        overflow: 'visible',
      }}>
        {!collapsed && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
              <Logo />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Smart Console</div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>Enterprise</div>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (onToggle) onToggle(); }}
              title="Collapse sidebar"
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, color: 'var(--text-soft)',
                background: 'transparent', border: 'none',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-soft)'; }}
            >
              <Icon name="chevronLeft" size={16} />
            </button>
          </>
        )}

        {/* Separator toggle — absolute on right edge, centered in the 64px header row */}
        {collapsed && (
          <button
            onClick={(e) => { e.stopPropagation(); if (onToggle) onToggle(); }}
            title="Expand sidebar"
            style={{
              position: 'absolute',
              right: -14,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 60,
              width: 28, height: 28,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-soft)',
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.12s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.color = 'var(--text-soft)'; }}
          >
            <Icon name="chevronRight" size={14} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
        {!collapsed && (
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-mute)', fontWeight: 600, padding: '10px 10px 6px' }}>
            Workspace
          </div>
        )}
        {NAV.map(item => {
          const isActive = active === item.id || (item.submenu && item.submenu.some(sub => sub.id === active));
          const isExpanded = expandedMenu === item.id;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          
          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasSubmenu && !collapsed) {
                    toggleSubmenu(item.id);
                  } else {
                    onNav(item.id);
                  }
                }}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: collapsed ? '10px' : '9px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  color: isActive ? 'var(--text)' : 'var(--text-soft)',
                  background: isActive ? 'var(--bg-sunken)' : 'transparent',
                  transition: 'all 0.12s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-soft)'; } }}
              >
                {isActive && !collapsed && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, background: 'var(--accent)', borderRadius: 2 }} />}
                <Icon name={item.icon} size={18} style={{ color: isActive ? 'var(--accent)' : 'inherit' }} />
                {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
                {!collapsed && item.count && <Badge tone="neutral">{item.count}</Badge>}
                {!collapsed && hasSubmenu && (
                  <Icon name="chevronDown" size={14} style={{ 
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                  }} />
                )}
              </button>
              
              {/* Submenu */}
              {!collapsed && hasSubmenu && isExpanded && (
                <div style={{ 
                  marginTop: 4, marginBottom: 4, marginLeft: 30,
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                  {item.submenu.map(subitem => {
                    const isSubActive = active === subitem.id;
                    return (
                      <button
                        key={subitem.id}
                        onClick={() => onNav(subitem.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 10px',
                          borderRadius: 6,
                          fontSize: 12, fontWeight: 500,
                          color: isSubActive ? 'var(--text)' : 'var(--text-soft)',
                          background: isSubActive ? 'var(--bg-hover)' : 'transparent',
                          transition: 'all 0.12s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => { if (!isSubActive) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)'; } }}
                        onMouseLeave={e => { if (!isSubActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-soft)'; } }}
                      >
                        {subitem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: 10, borderTop: '1px solid var(--border)' }}>
        <div style={{
          padding: collapsed ? 8 : 12, borderRadius: 10,
          background: 'var(--bg-sunken)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <Avatar name="Amelia Chen" color="#6366f1" size={collapsed ? 28 : 32} />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Amelia Chen</div>
              <div style={{ fontSize: 10, color: 'var(--text-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>amelia@smartconsole.co</div>
            </div>
          )}
          {!collapsed && <IconButton icon="logout" size={26} />}
        </div>
      </div>
    </aside>
  );
};

const NOTIFICATIONS = [
  { id: 'n1', icon: 'users', title: 'New user signed up', detail: 'Marcus Okafor joined the platform', time: '2m ago', unread: true },
  { id: 'n2', icon: 'billing', title: 'Payment received', detail: '$2,400 from Enterprise plan', time: '1h ago', unread: true },
  { id: 'n3', icon: 'activity', title: 'Export complete', detail: 'User report ready for download', time: '3h ago', unread: false },
];

const TopNav = ({ active, onNav }) => {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'var(--topbar-bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo />
          <div style={{ fontSize: 15, fontWeight: 600 }}>Smart Console</div>
        </div>
        <nav style={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
          {NAV.slice(0, 7).map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => onNav(item.id)} style={{
                padding: '8px 12px', fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--text)' : 'var(--text-soft)',
                background: isActive ? 'var(--bg-sunken)' : 'transparent',
                borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.12s',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-soft)'; } }}
              >
                <Icon name={item.icon} size={15} style={{ color: isActive ? 'var(--accent)' : 'inherit' }} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

const Topbar = ({ onMenu, onTheme, theme }) => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const notifRef = React.useRef(null);
  const profileRef = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unread = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 15,
      background: 'color-mix(in srgb, var(--topbar-bg) 80%, transparent)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      height: 64,
      padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, maxWidth: 480 }}>
        {onMenu && <IconButton icon="menu" onClick={onMenu} />}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flex: 1,
          background: 'var(--bg-sunken)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '0 12px', height: 36,
        }}>
          <Icon name="search" size={15} style={{ color: 'var(--text-mute)' }} />
          <input
            placeholder="Search users, invoices, settings…"
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13, color: 'var(--text)' }}
          />
          <kbd style={{
            fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
            padding: '2px 6px', borderRadius: 4,
            background: 'var(--bg-elev)', border: '1px solid var(--border)',
            color: 'var(--text-soft)',
          }}>⌘K</kbd>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} onClick={onTheme} />
        <IconButton icon="help" />

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            style={{
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, color: 'var(--text-soft)', position: 'relative',
              background: notifOpen ? 'var(--bg-sunken)' : 'transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = notifOpen ? 'var(--bg-sunken)' : 'transparent'}
          >
            <Icon name="bell" size={18} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--danger)', border: '2px solid var(--topbar-bg)',
              }} />
            )}
          </button>
          {notifOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              width: 360,
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.15s ease',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Notifications</div>
                <button style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>Mark all read</button>
              </div>
              <div style={{ maxHeight: 400, overflow: 'auto' }}>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={n.id} style={{
                    padding: '12px 16px', display: 'flex', gap: 12,
                    borderBottom: i === NOTIFICATIONS.length - 1 ? 'none' : '1px solid var(--border)',
                    background: n.unread ? 'color-mix(in srgb, var(--accent-soft) 40%, transparent)' : 'transparent',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'var(--bg-sunken)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}><Icon name={n.icon} size={15} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>{n.detail}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={profileRef} style={{ position: 'relative', marginLeft: 6 }}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 6px 4px 4px', borderRadius: 8,
              background: profileOpen ? 'var(--bg-sunken)' : 'transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = profileOpen ? 'var(--bg-sunken)' : 'transparent'}
          >
            <Avatar name="Amelia Chen" color="#6366f1" size={26} />
            <Icon name="chevronDown" size={14} style={{ color: 'var(--text-soft)' }} />
          </button>
          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              width: 220,
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.15s ease',
              padding: 8,
            }}>
              {['Profile', 'Settings', 'Billing', null, 'Log out'].map((item, i) =>
                item === null ? (
                  <div key={i} style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                ) : (
                  <button key={item} style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px',
                    fontSize: 13, fontWeight: 500, borderRadius: 6,
                    color: item === 'Log out' ? 'var(--danger)' : 'var(--text)',
                    background: 'transparent',
                    transition: 'all 0.12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Shell = ({ children, layout = 'sidebar', sidebarCollapsed = false, onSidebarToggle, theme, onTheme }) => {
  const [active, setActive] = React.useState(() => {
    const hash = window.location.hash.slice(1);
    return SCREENS[hash] ? hash : 'dashboard';
  });

  React.useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1);
      if (SCREENS[hash]) setActive(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const onNav = (id) => {
    setActive(id);
    window.location.hash = id;
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {mobileOpen && (
        <div 
          className={`mobile-overlay ${mobileOpen ? 'active' : ''}`}
          onClick={closeMobile}
        />
      )}
      
      <div style={{ display: 'flex', minHeight: '100vh' }} data-layout={layout}>
        {layout === 'sidebar' && (
          <div 
            className={`sidebar-wrapper ${mobileOpen ? 'mobile-open' : ''}`}
            style={{
              position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
              width: sidebarCollapsed ? 72 : 240,
              transition: 'width 0.2s ease, transform 0.3s ease',
            }}
          >
            <Sidebar 
              active={active} 
              onNav={(id) => {
                onNav(id);
                closeMobile();
              }} 
              collapsed={sidebarCollapsed} 
              onToggle={onSidebarToggle}
            />
          </div>
        )}

        <div style={{
          flex: 1,
          marginLeft: window.innerWidth > 768 && layout === 'sidebar' ? (sidebarCollapsed ? 72 : 240) : 0,
          display: 'flex', flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease',
        }}>
          {layout === 'topbar' && <TopNav active={active} onNav={onNav} />}
          <Topbar 
            onMenu={layout === 'sidebar' && window.innerWidth <= 768 ? toggleMobile : null} 
            onTheme={onTheme} 
            theme={theme} 
          />
          <main style={{ flex: 1, padding: '32px 32px 32px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { Shell, Sidebar, TopNav, Topbar, NAV, SCREENS });
