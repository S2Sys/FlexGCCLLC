// Main app with all new features integrated

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "sidebarCollapsed": false,
  "fontFamily": "inter",
  "layout": "sidebar"
}/*EDITMODE-END*/;

const TweaksPanel = ({ tweaks, setTweak, onClose }) => {
  const fontOptions = [
    { value: 'inter',    label: 'Inter',           family: 'Inter' },
    { value: 'poppins',  label: 'Poppins',          family: 'Poppins' },
    { value: 'outfit',   label: 'Outfit',           family: 'Outfit' },
    { value: 'dm-sans',  label: 'DM Sans',          family: 'DM Sans' },
    { value: 'nunito',   label: 'Nunito',           family: 'Nunito' },
    { value: 'grotesk',  label: 'Space Grotesk',    family: 'Space Grotesk' },
    { value: 'raleway',  label: 'Raleway',          family: 'Raleway' },
    { value: 'playfair', label: 'Playfair Display', family: 'Playfair Display' },
    { value: 'mono',     label: 'JetBrains Mono',   family: 'JetBrains Mono' },
  ];
  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, zIndex: 50,
      width: 300,
      background: 'var(--bg-elev)', border: '1px solid var(--border)',
      borderRadius: 14, boxShadow: 'var(--shadow-lg)',
      animation: 'scaleIn 0.2s ease',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="tweaks" size={16} style={{ color: 'var(--accent)' }} />
          <div style={{ fontSize: 14, fontWeight: 600 }}>Tweaks</div>
        </div>
        <IconButton icon="close" size={26} onClick={onClose} />
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 8 }}>Theme</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {['light', 'dark'].map(t => (
              <button key={t} onClick={() => setTweak('theme', t)} style={{
                padding: '10px', borderRadius: 8,
                border: `1.5px solid ${tweaks.theme === t ? 'var(--accent)' : 'var(--border)'}`,
                background: tweaks.theme === t ? 'var(--accent-soft)' : 'var(--bg-elev)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
                color: tweaks.theme === t ? 'var(--accent)' : 'var(--text)',
              }}>
                <Icon name={t === 'light' ? 'sun' : 'moon'} size={14} />{t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 8 }}>Layout</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[{ v: 'sidebar', l: 'Sidebar', i: 'sidebar' }, { v: 'topbar', l: 'Topbar', i: 'menu' }].map(o => (
              <button key={o.v} onClick={() => setTweak('layout', o.v)} style={{
                padding: '10px', borderRadius: 8,
                border: `1.5px solid ${tweaks.layout === o.v ? 'var(--accent)' : 'var(--border)'}`,
                background: tweaks.layout === o.v ? 'var(--accent-soft)' : 'var(--bg-elev)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 12, fontWeight: 500,
                color: tweaks.layout === o.v ? 'var(--accent)' : 'var(--text)',
              }}>
                <Icon name={o.i} size={14} />{o.l}
              </button>
            ))}
          </div>
        </div>

        {tweaks.layout === 'sidebar' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Collapse sidebar</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>Icon-only rail</div>
            </div>
            <Toggle checked={tweaks.sidebarCollapsed} onChange={(v) => setTweak('sidebarCollapsed', v)} />
          </div>
        )}

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 8 }}>Font family</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {fontOptions.map(f => (
              <button key={f.value} onClick={() => setTweak('fontFamily', f.value)} style={{
                padding: '10px', borderRadius: 8,
                border: `1.5px solid ${tweaks.fontFamily === f.value ? 'var(--accent)' : 'var(--border)'}`,
                background: tweaks.fontFamily === f.value ? 'var(--accent-soft)' : 'var(--bg-elev)',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
              }}>
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: f.family, color: tweaks.fontFamily === f.value ? 'var(--accent)' : 'var(--text)' }}>Aa</span>
                <span style={{ fontSize: 10, color: tweaks.fontFamily === f.value ? 'var(--accent)' : 'var(--text-soft)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(TWEAK_DEFAULTS.sidebarCollapsed);
  const [layout, setLayout] = React.useState(TWEAK_DEFAULTS.layout);

  // Apply theme + font to document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.body.className = `font-${tweaks.fontFamily}`;
  }, [tweaks.theme, tweaks.fontFamily]);

  // Register edit-mode listener
  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') { setTweaksOpen(true); }
      if (e.data.type === '__deactivate_edit_mode') { setTweaksOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweak = (key, value) => {
    const next = { ...tweaks, [key]: value };
    setTweaks(next);
    if (key === 'sidebarCollapsed') setSidebarCollapsed(value);
    if (key === 'layout') setLayout(value);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  };
  
  // Expose methods for settings panel
  React.useEffect(() => {
    window.App.setLayout = setLayout;
    window.App.setSidebarCollapsed = setSidebarCollapsed;
  }, []);

  const renderScreen = () => {
    const Screen = SCREENS[currentScreen] || SCREENS.dashboard;
    return React.createElement(Screen);
  };

  // Sync with hash changes
  React.useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1);
      if (SCREENS[hash]) setCurrentScreen(hash);
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const MobileNavComp = window.MobileNav || (() => null);

  return (
    <div className={`font-${tweaks.fontFamily}`}>
      <Shell
        layout={layout}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => {
          const next = !sidebarCollapsed;
          setSidebarCollapsed(next);
          setTweak('sidebarCollapsed', next);
        }}
        theme={tweaks.theme}
        onTheme={() => setTweak('theme', tweaks.theme === 'light' ? 'dark' : 'light')}
        tweaksOn={tweaksOpen}
        onTweaksClick={() => setTweaksOpen(!tweaksOpen)}
      >
        {renderScreen()}
      </Shell>
      
      <MobileNavComp 
        currentScreen={currentScreen} 
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.location.hash = screen;
        }} 
      />
      
      {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => setTweaksOpen(false)} />}
    </div>
  );
};

window.App = App;
