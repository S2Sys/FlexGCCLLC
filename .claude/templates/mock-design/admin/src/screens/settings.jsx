const SettingsScreen = () => {
  const [tab, setTab] = React.useState('general');
  const [name, setName] = React.useState('Smart Console');
  const [domain, setDomain] = React.useState('smartconsole.co');
  const [twoFactor, setTwoFactor] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [panelMode, setPanelMode] = React.useState('view'); // 'view', 'add', 'edit'
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [appLayout, setAppLayout] = React.useState(() => window.__TWEAKS__?.layout || 'sidebar');
  const [appCollapsed, setAppCollapsed] = React.useState(() => window.__TWEAKS__?.sidebarCollapsed || false);
  const [appFont, setAppFont] = React.useState(() => window.__TWEAKS__?.fontFamily || 'inter');
  const [primaryColor, setPrimaryColor] = React.useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = React.useState('#10b981');

  const ALL_FONTS = [
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

  const PRIMARY_COLORS = [
    { label: 'Indigo',  value: '#6366f1', soft: 'rgba(99,102,241,0.12)',   ring: 'rgba(99,102,241,0.22)' },
    { label: 'Blue',    value: '#3b82f6', soft: 'rgba(59,130,246,0.12)',   ring: 'rgba(59,130,246,0.22)' },
    { label: 'Violet',  value: '#7c3aed', soft: 'rgba(124,58,237,0.12)',   ring: 'rgba(124,58,237,0.22)' },
    { label: 'Rose',    value: '#f43f5e', soft: 'rgba(244,63,94,0.12)',    ring: 'rgba(244,63,94,0.22)' },
    { label: 'Orange',  value: '#f97316', soft: 'rgba(249,115,22,0.12)',   ring: 'rgba(249,115,22,0.22)' },
    { label: 'Teal',    value: '#0d9488', soft: 'rgba(13,148,136,0.12)',   ring: 'rgba(13,148,136,0.22)' },
    { label: 'Pink',    value: '#ec4899', soft: 'rgba(236,72,153,0.12)',   ring: 'rgba(236,72,153,0.22)' },
    { label: 'Slate',   value: '#64748b', soft: 'rgba(100,116,139,0.12)',  ring: 'rgba(100,116,139,0.22)' },
  ];

  const SECONDARY_COLORS = [
    { label: 'Emerald', value: '#10b981', soft: 'rgba(16,185,129,0.12)' },
    { label: 'Sky',     value: '#0ea5e9', soft: 'rgba(14,165,233,0.12)' },
    { label: 'Purple',  value: '#a855f7', soft: 'rgba(168,85,247,0.12)' },
    { label: 'Amber',   value: '#f59e0b', soft: 'rgba(245,158,11,0.12)' },
    { label: 'Lime',    value: '#84cc16', soft: 'rgba(132,204,22,0.12)' },
    { label: 'Cyan',    value: '#06b6d4', soft: 'rgba(6,182,212,0.12)' },
    { label: 'Red',     value: '#ef4444', soft: 'rgba(239,68,68,0.12)' },
    { label: 'Fuchsia', value: '#d946ef', soft: 'rgba(217,70,239,0.12)' },
  ];

  const applyLayout = (val) => {
    setAppLayout(val);
    window.__TWEAKS__ = { ...(window.__TWEAKS__ || {}), layout: val };
    if (window.App?.setLayout) window.App.setLayout(val);
  };
  const applyCollapsed = (val) => {
    setAppCollapsed(val);
    window.__TWEAKS__ = { ...(window.__TWEAKS__ || {}), sidebarCollapsed: val };
    if (window.App?.setSidebarCollapsed) window.App.setSidebarCollapsed(val);
  };
  const applyFont = (val) => {
    setAppFont(val);
    document.body.className = `font-${val}`;
    window.__TWEAKS__ = { ...(window.__TWEAKS__ || {}), fontFamily: val };
  };
  const applyPrimary = (color) => {
    setPrimaryColor(color.value);
    document.documentElement.style.setProperty('--accent', color.value);
    document.documentElement.style.setProperty('--accent-soft', color.soft);
    document.documentElement.style.setProperty('--ring', color.ring);
  };
  const applySecondary = (color) => {
    setSecondaryColor(color.value);
    document.documentElement.style.setProperty('--success', color.value);
    document.documentElement.style.setProperty('--success-soft', color.soft);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'personalize', label: 'Personalize' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'api', label: 'API keys' },
  ];

  const openPanel = (mode, item = null) => {
    setPanelMode(mode);
    setSelectedItem(item);
    setPanelOpen(true);
  };

  const SidePanelComp = window.SidePanel;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader title="Settings" subtitle="Workspace and account preferences." crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Settings' }]} />

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 14px', fontSize: 13, fontWeight: 500,
              color: tab === t.id ? 'var(--text)' : 'var(--text-soft)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'general' && (
        <Card padding="24px 28px">
          <SettingRow label="Workspace name" hint="The display name across the product and emails.">
            <Input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', maxWidth: 400, display: 'flex' }} />
          </SettingRow>
          <SettingRow label="Workspace domain" hint="Used as your unique workspace URL and for single sign-on.">
            <Input value={domain} onChange={(e) => setDomain(e.target.value)} style={{ width: '100%', maxWidth: 400, display: 'flex' }} />
          </SettingRow>
          <SettingRow label="Default language" hint="Applies to new team members only.">
            <Select style={{ minWidth: 200 }} options={[
              { value: 'en', label: 'English (US)' },
              { value: 'en-gb', label: 'English (UK)' },
              { value: 'fr', label: 'Français' },
              { value: 'de', label: 'Deutsch' },
              { value: 'ja', label: '日本語' },
            ]} />
          </SettingRow>
          <SettingRow label="Time zone" hint="All timestamps will be displayed in this zone.">
            <Select style={{ minWidth: 280 }} options={[
              { value: 'pt', label: '(GMT-08:00) Pacific Time' },
              { value: 'et', label: '(GMT-05:00) Eastern Time' },
              { value: 'utc', label: '(GMT+00:00) UTC' },
              { value: 'cet', label: '(GMT+01:00) Central European' },
              { value: 'jst', label: '(GMT+09:00) Japan Standard' },
            ]} />
          </SettingRow>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, gap: 8 }}>
            <Button variant="ghost">Discard</Button>
            <Button variant="primary">Save changes</Button>
          </div>
        </Card>
      )}

      {tab === 'appearance' && (
        <Card padding="24px 28px">
          <SettingRow label="Theme" hint="Choose your preferred color scheme.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 280 }}>
              {[{ v: 'light', i: 'sun' }, { v: 'dark', i: 'moon' }].map(t => (
                <button key={t.v} onClick={() => document.documentElement.setAttribute('data-theme', t.v)} style={{
                  padding: '12px', borderRadius: 8,
                  border: '1.5px solid var(--border)', background: 'var(--bg-elev)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 14, fontWeight: 500, textTransform: 'capitalize',
                  color: 'var(--text)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.color = 'var(--text)'; }}
                >
                  <Icon name={t.i} size={16} />{t.v}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Primary color" hint="Sets the accent color used across buttons, links, and highlights.">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PRIMARY_COLORS.map(c => (
                <button key={c.value} title={c.label} onClick={() => applyPrimary(c)} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c.value,
                  border: `3px solid ${primaryColor === c.value ? 'var(--bg-elev)' : 'transparent'}`,
                  outline: `2px solid ${primaryColor === c.value ? c.value : 'transparent'}`,
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {primaryColor === c.value && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Secondary color" hint="Sets the success and positive-state highlight color.">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SECONDARY_COLORS.map(c => (
                <button key={c.value} title={c.label} onClick={() => applySecondary(c)} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c.value,
                  border: `3px solid ${secondaryColor === c.value ? 'var(--bg-elev)' : 'transparent'}`,
                  outline: `2px solid ${secondaryColor === c.value ? c.value : 'transparent'}`,
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {secondaryColor === c.value && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Font family" hint="Change the primary typeface across the interface.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 460 }}>
              {ALL_FONTS.map(f => (
                <button key={f.value} onClick={() => applyFont(f.value)} style={{
                  padding: '10px 12px', borderRadius: 8,
                  border: `1.5px solid ${appFont === f.value ? 'var(--accent)' : 'var(--border)'}`,
                  background: appFont === f.value ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                  cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 15, fontWeight: 600, fontFamily: f.family, color: appFont === f.value ? 'var(--accent)' : 'var(--text)', lineHeight: 1.2 }}>Aa</span>
                  <span style={{ fontSize: 11, color: appFont === f.value ? 'var(--accent)' : 'var(--text-soft)', fontWeight: 500, whiteSpace: 'nowrap' }}>{f.label}</span>
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Layout mode" hint="Switch between sidebar and top navigation.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 280 }}>
              {[{ v: 'sidebar', l: 'Sidebar', i: 'sidebar' }, { v: 'topbar', l: 'Topbar', i: 'menu' }].map(o => (
                <button key={o.v} onClick={() => applyLayout(o.v)} style={{
                  padding: '12px', borderRadius: 8,
                  border: `1.5px solid ${appLayout === o.v ? 'var(--accent)' : 'var(--border)'}`,
                  background: appLayout === o.v ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 14, fontWeight: 500,
                  color: appLayout === o.v ? 'var(--accent)' : 'var(--text)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <Icon name={o.i} size={16} />{o.l}
                </button>
              ))}
            </div>
          </SettingRow>
          {appLayout === 'sidebar' && (
            <SettingRow label="Sidebar" hint="Collapse to icon-only view.">
              <Toggle checked={appCollapsed} onChange={applyCollapsed} label={appCollapsed ? 'Collapsed' : 'Expanded'} />
            </SettingRow>
          )}
        </Card>
      )}

      {tab === 'personalize' && (
        <Card padding="24px 28px">
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Advanced customization</div>
            <div style={{ fontSize: 13, color: 'var(--text-soft)' }}>Fine-tune the interface with interactive controls</div>
          </div>
          <PersonalizeTweaksPanel />
        </Card>
      )}

      {tab === 'security' && (
        <Card padding="24px 28px">
          <SettingRow label="Two-factor authentication" hint="Require a second verification step for every sign-in.">
            <Toggle checked={twoFactor} onChange={setTwoFactor} label={twoFactor ? 'Enabled' : 'Disabled'} />
          </SettingRow>
          <SettingRow label="Single sign-on (SSO)" hint="Connect an identity provider like Okta or Google Workspace.">
            <Button variant="secondary" icon="key">Configure SSO</Button>
          </SettingRow>
          <SettingRow label="Session timeout" hint="Sign out inactive sessions automatically.">
            <Select style={{ minWidth: 180 }} options={[
              { value: '1h', label: 'After 1 hour' },
              { value: '8h', label: 'After 8 hours' },
              { value: '24h', label: 'After 24 hours' },
              { value: 'never', label: 'Never' },
            ]} />
          </SettingRow>
          <SettingRow label="Trusted IP ranges" hint="Restrict admin actions to these networks.">
            <Input placeholder="192.168.1.0/24" style={{ width: '100%', maxWidth: 400, display: 'flex' }} />
          </SettingRow>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card padding="24px 28px">
          <SettingRow label="Weekly digest" hint="Summary of workspace activity every Monday at 9am.">
            <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} label={weeklyDigest ? 'On' : 'Off'} />
          </SettingRow>
          <SettingRow label="Product updates" hint="Occasional emails about new features.">
            <Toggle checked={marketing} onChange={setMarketing} label={marketing ? 'On' : 'Off'} />
          </SettingRow>
          <SettingRow label="Billing alerts" hint="Notify me when usage approaches plan limits.">
            <Toggle checked={true} onChange={() => {}} label="On" />
          </SettingRow>
          <SettingRow label="Security alerts" hint="Always on for admin accounts.">
            <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>Required</span>
          </SettingRow>
        </Card>
      )}

      {tab === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {[
            { name: 'Slack', desc: 'Real-time notifications in channels', connected: true, color: '#4A154B' },
            { name: 'GitHub', desc: 'Link commits and pull requests', connected: true, color: '#24292e' },
            { name: 'Stripe', desc: 'Sync billing and customer data', connected: true, color: '#635bff' },
            { name: 'Linear', desc: 'Issue tracking integration', connected: false, color: '#5E6AD2' },
            { name: 'Zapier', desc: 'Connect to 5,000+ apps', connected: false, color: '#FF4A00' },
            { name: 'Webhook', desc: 'Custom HTTP endpoints', connected: false, color: '#6366f1' },
          ].map(int => (
            <Card key={int.name} padding={18}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: int.color,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  flexShrink: 0,
                }}>{int.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{int.name}</div>
                    {int.connected && <Icon name="check2" size={14} style={{ color: 'var(--success)' }} />}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2, lineHeight: 1.4 }}>{int.desc}</div>
                </div>
              </div>
              <Button variant={int.connected ? 'ghost' : 'secondary'} size="sm" style={{ marginTop: 14, width: '100%' }}>
                {int.connected ? 'Configure' : 'Connect'}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'api' && (
        <Card padding={0}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>API keys</div>
              <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 2 }}>Used to authenticate requests from your applications</div>
            </div>
            <Button variant="primary" icon="plus" onClick={() => openPanel('add')}>Create key</Button>
          </div>
          {[
            { name: 'Production', token: 'sc_live_8f4a...e2c9', created: 'Mar 12, 2026', last: '2 minutes ago' },
            { name: 'Staging', token: 'sc_test_aa21...9f0d', created: 'Feb 04, 2026', last: '6 hours ago' },
            { name: 'Mobile app', token: 'sc_live_31bc...48ea', created: 'Dec 18, 2025', last: '3 days ago' },
          ].map((k, i, arr) => (
            <div key={k.name} style={{
              padding: '16px 22px',
              borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{k.name}</div>
                <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-soft)', marginTop: 4 }}>{k.token}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 4 }}>Created {k.created} · Last used {k.last}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <IconButton icon="eye" onClick={() => openPanel('view', k)} />
                <IconButton icon="edit" onClick={() => openPanel('edit', k)} />
                <IconButton icon="trash" />
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Side Panel for view/add/edit */}
      {SidePanelComp && (
        <SidePanelComp
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title={panelMode === 'add' ? 'Create API Key' : panelMode === 'edit' ? 'Edit API Key' : 'API Key Details'}
          footer={
            panelMode !== 'view' && (
              <>
                <Button variant="ghost" onClick={() => setPanelOpen(false)}>Cancel</Button>
                <Button variant="primary">{panelMode === 'add' ? 'Create' : 'Save changes'}</Button>
              </>
            )
          }
        >
          {panelMode === 'add' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Key name</label>
                <Input placeholder="e.g. Production, Mobile App" style={{ width: '100%' }} />
                <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 4 }}>A descriptive name to identify this key</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Permissions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Toggle checked={true} onChange={() => {}} label="Read access" />
                  <Toggle checked={true} onChange={() => {}} label="Write access" />
                  <Toggle checked={false} onChange={() => {}} label="Admin access" />
                </div>
              </div>
              <div style={{ padding: 12, background: 'var(--warn-soft)', border: '1px solid var(--warn)', borderRadius: 8, fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.5 }}>
                <Icon name="alert" size={14} style={{ color: 'var(--warn)', marginRight: 6 }} />
                Make sure to copy your key after creation — you won't be able to see it again.
              </div>
            </div>
          )}
          {panelMode === 'edit' && selectedItem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Key name</label>
                <Input value={selectedItem.name} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Permissions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Toggle checked={true} onChange={() => {}} label="Read access" />
                  <Toggle checked={true} onChange={() => {}} label="Write access" />
                  <Toggle checked={false} onChange={() => {}} label="Admin access" />
                </div>
              </div>
            </div>
          )}
          {panelMode === 'view' && selectedItem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 6 }}>Key name</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{selectedItem.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 6 }}>Token</div>
                <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-soft)', background: 'var(--bg-sunken)', padding: '10px 12px', borderRadius: 8 }}>{selectedItem.token}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 6 }}>Created</div>
                  <div style={{ fontSize: 13 }}>{selectedItem.created}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 6 }}>Last used</div>
                  <div style={{ fontSize: 13 }}>{selectedItem.last}</div>
                </div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-sunken)', borderRadius: 8, fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.5 }}>
                This key has full read and write access to your workspace data. Revoke it immediately if compromised.
              </div>
            </div>
          )}
        </SidePanelComp>
      )}
    </div>
  );
};

// Tweaks panel embedded in settings
const PersonalizeTweaksPanel = () => {
  const TWEAK_DEFAULTS = window.__TWEAKS__ || {
    theme: 'light',
    sidebarCollapsed: false,
    fontFamily: 'grotesk',
    layout: 'sidebar'
  };

  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);

  const setTweak = React.useCallback((keyOrObj, value) => {
    setTweaks(prev => {
      const next = typeof keyOrObj === 'string' 
        ? { ...prev, [keyOrObj]: value }
        : { ...prev, ...keyOrObj };
      
      // Apply changes immediately
      applyTweaks(next);
      
      // Persist to window.__TWEAKS__ and notify parent
      window.__TWEAKS__ = next;
      window.parent.postMessage({type: '__edit_mode_set_keys', edits: next}, '*');
      
      return next;
    });
  }, []);

  const applyTweaks = (t) => {
    // Apply theme
    if (t.theme) {
      document.documentElement.setAttribute('data-theme', t.theme);
    }
    
    // Apply font
    if (t.fontFamily) {
      document.body.className = `font-${t.fontFamily}`;
    }
    
    // Apply layout
    if (t.layout) {
      const app = window.App;
      if (app && app.setLayout) {
        app.setLayout(t.layout);
      }
    }
    
    // Apply sidebar collapsed
    if (typeof t.sidebarCollapsed !== 'undefined') {
      const app = window.App;
      if (app && app.setSidebarCollapsed) {
        app.setSidebarCollapsed(t.sidebarCollapsed);
      }
    }
  };

  React.useEffect(() => {
    applyTweaks(tweaks);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <TweakSection title="Theme" description="Choose your preferred color scheme">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
          {[
            { value: 'light', label: 'Light', icon: 'sun' },
            { value: 'dark', label: 'Dark', icon: 'moon' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTweak('theme', opt.value)}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                border: `2px solid ${tweaks.theme === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                background: tweaks.theme === opt.value ? 'var(--accent-soft)' : 'var(--bg-elev)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                color: tweaks.theme === opt.value ? 'var(--accent)' : 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon name={opt.icon} size={20} />
              {opt.label}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Font family" description="Change the primary typeface">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {[
            { value: 'poppins', label: 'Poppins' },
            { value: 'inter', label: 'Inter' },
            { value: 'grotesk', label: 'Space Grotesk' },
            { value: 'mono', label: 'JetBrains Mono' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTweak('fontFamily', opt.value)}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `2px solid ${tweaks.fontFamily === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                background: tweaks.fontFamily === opt.value ? 'var(--accent-soft)' : 'var(--bg-elev)',
                fontSize: 13,
                fontWeight: 500,
                color: tweaks.fontFamily === opt.value ? 'var(--accent)' : 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Layout mode" description="Switch between sidebar and top navigation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {[
            { value: 'sidebar', label: 'Sidebar', icon: 'sidebar' },
            { value: 'topbar', label: 'Topbar', icon: 'menu' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTweak('layout', opt.value)}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                border: `2px solid ${tweaks.layout === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                background: tweaks.layout === opt.value ? 'var(--accent-soft)' : 'var(--bg-elev)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                color: tweaks.layout === opt.value ? 'var(--accent)' : 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon name={opt.icon} size={20} />
              {opt.label}
            </button>
          ))}
        </div>
      </TweakSection>

      {tweaks.layout === 'sidebar' && (
        <TweakSection title="Sidebar behavior" description="Collapse to icon-only view">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Toggle 
              checked={tweaks.sidebarCollapsed} 
              onChange={(val) => setTweak('sidebarCollapsed', val)} 
              label={tweaks.sidebarCollapsed ? 'Collapsed' : 'Expanded'}
            />
          </div>
        </TweakSection>
      )}

      <div style={{ 
        padding: 16, 
        background: 'var(--accent-soft)', 
        border: '1px solid var(--accent)', 
        borderRadius: 10, 
        fontSize: 13, 
        color: 'var(--text-soft)', 
        lineHeight: 1.6,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}>
        <Icon name="info" size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
        <div>
          <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Live preview</strong> — Changes apply immediately so you can see how they look. These settings are saved to your browser.
        </div>
      </div>
    </div>
  );
};

const TweakSection = ({ title, description, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{description}</div>}
    </div>
    {children}
  </div>
);

window.SettingsScreen = SettingsScreen;
