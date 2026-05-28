const ActivityScreen = () => {
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openMenuId, setOpenMenuId] = React.useState(null);

  const q = searchQuery.trim().toLowerCase();
  const filtered = ACTIVITY
    .filter(a => typeFilter === 'all' || a.type === typeFilter)
    .filter(a => !q || [a.actor, a.action, a.target || ''].some(s => s.toLowerCase().includes(q)));

  const typeIcon = {
    settings: 'settings', user: 'users', system: 'zap', content: 'edit',
    approval: 'check2', security: 'shield', moderation: 'alert', export: 'download',
  };
  const typeTone = {
    settings: 'neutral', user: 'accent', system: 'warn', content: 'success',
    approval: 'success', security: 'danger', moderation: 'warn', export: 'neutral',
  };

  const handleExport = () => {
    const rows = filtered.map(a => ({ id: a.id, type: a.type, actor: a.actor, action: a.action, target: a.target || '', time: a.time }));
    exportToCSV(rows, 'activity-log.csv');
  };

  const handleRowAction = (action, a) => {
    setOpenMenuId(null);
    if (action === 'copy') {
      navigator.clipboard?.writeText(`${a.actor} ${a.action}${a.target ? ' ' + a.target : ''} — ${a.time}`);
    } else if (action === 'export') {
      exportToCSV([{ id: a.id, type: a.type, actor: a.actor, action: a.action, target: a.target || '', time: a.time }], `event-${a.id}.csv`);
    }
  };

  React.useEffect(() => {
    if (!openMenuId) return;
    const close = (e) => {
      if (!e.target.closest('[data-row-menu]')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMenuId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHeader title="Activity log" subtitle="All workspace events, audit-ready and searchable."
        crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Activity log' }]}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              icon="search"
              placeholder="Search events…"
              style={{ width: 220 }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Button variant="secondary" icon="download" onClick={handleExport}>Export</Button>
          </div>
        }
      />

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['all', 'user', 'content', 'security', 'settings', 'system', 'approval', 'moderation', 'export'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 500,
              borderRadius: 999,
              background: typeFilter === t ? 'var(--text)' : 'var(--bg-elev)',
              color: typeFilter === t ? 'var(--bg-elev)' : 'var(--text-soft)',
              border: '1px solid var(--border)',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
          >{t === 'all' ? 'All events' : t}</button>
        ))}
      </div>

      <Card padding={0} dataAos="fade-up">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.length === 0 && <EmptyState icon="activity" title="No events" subtitle="Try a different filter or search." />}
          {filtered.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', gap: 14, padding: '16px 22px',
              borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--border)',
              alignItems: 'flex-start',
              position: 'relative',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `var(--${typeTone[a.type]}-soft)`,
                color: `var(--${typeTone[a.type] === 'neutral' ? 'text-soft' : typeTone[a.type]})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name={typeIcon[a.type] || 'activity'} size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 500 }}>{a.actor}</span>
                  <span style={{ color: 'var(--text-soft)' }}> {a.action} </span>
                  {a.target && <span style={{ fontWeight: 500, fontFamily: a.target.startsWith('#') || a.target.includes('-') ? 'JetBrains Mono, monospace' : 'inherit', fontSize: a.target.startsWith('#') || a.target.includes('-') ? 12 : 13 }}>{a.target}</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><Icon name="clock" size={10} />{a.time}</span>
                  <Badge tone={typeTone[a.type]} size="sm">{a.type}</Badge>
                </div>
              </div>

              {/* Per-row context menu */}
              <div data-row-menu style={{ position: 'relative' }}>
                <IconButton icon="moreV" size={28} onClick={() => setOpenMenuId(openMenuId === a.id ? null : a.id)} />
                {openMenuId === a.id && (
                  <div style={{
                    position: 'absolute', right: 0, top: 32, zIndex: 50,
                    background: 'var(--bg-elev)', border: '1px solid var(--border)',
                    borderRadius: 10, boxShadow: 'var(--shadow-md)',
                    minWidth: 160, overflow: 'hidden',
                    animation: 'slideDown 0.15s ease',
                  }}>
                    {[
                      { label: 'View details', icon: 'eye' },
                      { label: 'Copy event', icon: 'copy', action: 'copy' },
                      { label: 'Export row', icon: 'download', action: 'export' },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => handleRowAction(item.action, a)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 9,
                          width: '100%', padding: '10px 14px',
                          fontSize: 13, fontWeight: 500, color: 'var(--text)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Icon name={item.icon} size={14} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

window.ActivityScreen = ActivityScreen;
