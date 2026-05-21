const UsersScreen = () => {
  const [query, setQuery] = React.useState('');
  const [sortKey, setSortKey] = React.useState('lastActive');
  const [sortDir, setSortDir] = React.useState('asc');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(new Set());
  const [panelMode, setPanelMode] = React.useState(null); // 'view' | 'add' | 'edit'
  const [panelUser, setPanelUser] = React.useState(null);
  const [menuUser, setMenuUser] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const openPanel = (mode, user = null) => {
    setPanelMode(mode);
    setPanelUser(user);
    setMenuUser(null);
  };

  const closePanel = () => {
    setPanelMode(null);
    setPanelUser(null);
  };

  React.useEffect(() => {
    if (!menuUser) return;
    const close = () => setMenuUser(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuUser]);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const doAction = (label, user) => {
    setMenuUser(null);
    setToast(`${label} — ${user.name}`);
  };

  const filtered = React.useMemo(() => {
    let rows = [...USERS];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') rows = rows.filter(u => u.status === statusFilter);
    if (roleFilter !== 'all') rows = rows.filter(u => u.role === roleFilter);
    rows.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [query, sortKey, sortDir, statusFilter, roleFilter]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const allSelected = filtered.length > 0 && filtered.every(u => selected.has(u.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(u => u.id)));
  };

  const Th = ({ k, children, align = 'left' }) => (
    <th
      onClick={() => toggleSort(k)}
      style={{
        fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em',
        color: 'var(--text-soft)', padding: '10px 16px', textAlign: align,
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        {sortKey === k && <Icon name={sortDir === 'asc' ? 'chevronUp' : 'chevronDown'} size={12} />}
      </span>
    </th>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHeader
        title="Users"
        subtitle={`${USERS.length} total · ${USERS.filter(u => u.status === 'active').length} active`}
        crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Users' }]}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon="download">Export CSV</Button>
            <Button variant="primary" icon="plus" onClick={() => openPanel('add')}>Add user</Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            icon="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            style={{ width: 280 }}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'invited', label: 'Invited' },
              { value: 'suspended', label: 'Suspended' },
            ]}
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All roles' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Editor', label: 'Editor' },
              { value: 'Viewer', label: 'Viewer' },
            ]}
          />
        </div>
        {selected.size > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>{selected.size} selected</span>
            <Button variant="secondary" size="sm" icon="mail">Email</Button>
            <Button variant="danger" size="sm" icon="trash">Remove</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }} dataAos="fade-up">
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead style={{ background: 'var(--bg-sunken)' }}>
              <tr>
                <th style={{ width: 40, padding: '10px 0 10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer', accentColor: 'var(--accent)' }} />
                </th>
                <Th k="name">User</Th>
                <Th k="role">Role</Th>
                <Th k="status">Status</Th>
                <Th k="plan">Plan</Th>
                <Th k="spend" align="right">Spend</Th>
                <Th k="lastActive">Last active</Th>
                <th style={{ width: 40, borderBottom: '1px solid var(--border)' }} />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8}><EmptyState icon="search" title="No users match" subtitle="Try clearing filters or a different search term." /></td></tr>
              )}
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  onClick={() => openPanel('view', u)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--border)',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 0 12px 16px' }} onClick={(e) => { e.stopPropagation(); toggleSelect(u.id); }}>
                    <input type="checkbox" checked={selected.has(u.id)} onChange={() => {}} style={{ cursor: 'pointer', accentColor: 'var(--accent)' }} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar name={u.name} color={u.avatar} size={32} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-soft)' }}>{u.role}</td>
                  <td style={{ padding: '12px 16px' }}><StatusDot status={u.status} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge tone={u.plan === 'Enterprise' ? 'accent' : u.plan === 'Pro' ? 'success' : 'neutral'}>{u.plan}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    ${u.spend.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-soft)' }}>{u.lastActive}</td>
                  <td style={{ padding: '12px 16px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <IconButton icon="moreV" size={28} onClick={(e) => { e.stopPropagation(); setMenuUser(menuUser?.id === u.id ? null : u); }} active={menuUser?.id === u.id} />
                    {menuUser?.id === u.id && (
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute', top: 'calc(100% - 2px)', right: 12, zIndex: 30,
                          minWidth: 180,
                          background: 'var(--bg-elev)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          boxShadow: 'var(--shadow-lg)',
                          padding: 6,
                          animation: 'fadeIn 0.12s ease',
                        }}
                      >
                        {[
                          { icon: 'eye', label: 'View profile', fn: () => openPanel('view', u) },
                          { icon: 'edit', label: 'Edit user', fn: () => openPanel('edit', u) },
                          { icon: 'mail', label: 'Send email', fn: () => doAction('Email sent', u) },
                          { icon: 'key', label: 'Reset password', fn: () => doAction('Password reset sent', u) },
                        ].map(a => (
                          <button key={a.label} onClick={a.fn} style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '8px 10px', fontSize: 13, color: 'var(--text)',
                            borderRadius: 6, textAlign: 'left',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <Icon name={a.icon} size={14} style={{ color: 'var(--text-soft)' }} />{a.label}
                          </button>
                        ))}
                        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                        {u.status === 'suspended' ? (
                          <button onClick={() => doAction('Reactivated', u)} style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '8px 10px', fontSize: 13, color: 'var(--success)', borderRadius: 6, textAlign: 'left',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--success-soft)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          ><Icon name="check2" size={14} />Reactivate</button>
                        ) : (
                          <button onClick={() => doAction('Suspended', u)} style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '8px 10px', fontSize: 13, color: 'var(--warn)', borderRadius: 6, textAlign: 'left',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--warn-soft)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          ><Icon name="alert" size={14} />Suspend</button>
                        )}
                        <button onClick={() => doAction('Removed', u)} style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '8px 10px', fontSize: 13, color: 'var(--danger)', borderRadius: 6, textAlign: 'left',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        ><Icon name="trash" size={14} />Remove user</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-soft)' }}>
            <span>Showing {filtered.length} of {USERS.length}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="secondary" size="sm" icon="chevronLeft" disabled>Prev</Button>
              <Button variant="secondary" size="sm" iconRight="chevronRight">Next</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Side Panel for View/Add/Edit */}
      <SidePanel 
        open={!!panelMode} 
        onClose={closePanel}
        title={panelMode === 'add' ? 'Add User' : panelMode === 'edit' ? 'Edit User' : 'User Details'}
        footer={
          panelMode === 'view' ? (
            <>
              <Button variant="ghost" onClick={closePanel}>Close</Button>
              <Button variant="primary" icon="edit" onClick={() => setPanelMode('edit')}>Edit user</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={closePanel}>Cancel</Button>
              <Button variant="primary" onClick={() => { setToast(panelMode === 'add' ? 'User added' : 'User updated'); closePanel(); }}>
                {panelMode === 'add' ? 'Add user' : 'Save changes'}
              </Button>
            </>
          )
        }
      >
        {panelMode === 'view' && panelUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Profile header */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
              <Avatar name={panelUser.name} color={panelUser.avatar} size={64} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{panelUser.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-soft)', marginBottom: 8 }}>{panelUser.email}</div>
                <StatusDot status={panelUser.status} />
              </div>
            </div>

            {/* Details grid */}
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 16 }}>Account Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['Role', panelUser.role],
                  ['Plan', panelUser.plan],
                  ['Total Spend', `$${panelUser.spend.toLocaleString()}`],
                  ['Joined', panelUser.joined],
                  ['Last Active', panelUser.lastActive],
                  ['User ID', panelUser.id],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity section */}
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-mute)', fontWeight: 600, marginBottom: 12 }}>Recent Activity</div>
              <div style={{ fontSize: 13, color: 'var(--text-soft)', fontStyle: 'italic' }}>No recent activity</div>
            </div>
          </div>
        )}

        {(panelMode === 'add' || panelMode === 'edit') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FormField label="Full name" required>
              <Input placeholder="John Doe" style={{ width: '100%', display: 'flex' }} value={panelUser?.name || ''} />
            </FormField>

            <FormField label="Email address" required>
              <Input type="email" placeholder="john@company.com" icon="mail" style={{ width: '100%', display: 'flex' }} value={panelUser?.email || ''} />
            </FormField>

            <FormField label="Role" required>
              <Select style={{ width: '100%' }} value={panelUser?.role.toLowerCase() || 'viewer'} options={[
                { value: 'viewer', label: 'Viewer — Read only' },
                { value: 'editor', label: 'Editor — Can create and edit' },
                { value: 'admin', label: 'Admin — Full access' },
              ]} />
            </FormField>

            <FormField label="Plan">
              <Select style={{ width: '100%' }} value={panelUser?.plan || 'Starter'} options={[
                { value: 'Starter', label: 'Starter' },
                { value: 'Pro', label: 'Pro' },
                { value: 'Enterprise', label: 'Enterprise' },
              ]} />
            </FormField>

            {panelMode === 'edit' && (
              <>
                <FormField label="Status">
                  <Select style={{ width: '100%' }} value={panelUser?.status || 'active'} options={[
                    { value: 'active', label: 'Active' },
                    { value: 'invited', label: 'Invited' },
                    { value: 'suspended', label: 'Suspended' },
                  ]} />
                </FormField>

                <div style={{ 
                  padding: 16, 
                  background: 'var(--danger-soft)', 
                  border: '1px solid var(--danger)', 
                  borderRadius: 10,
                  marginTop: 24,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 8 }}>Danger Zone</div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 12 }}>
                    Permanently delete this user and all associated data.
                  </div>
                  <Button variant="danger" size="sm" icon="trash">Delete user</Button>
                </div>
              </>
            )}

            {panelMode === 'add' && (
              <FormField label="Welcome message" hint="Optional message included in invitation email">
                <textarea placeholder="Welcome to the team!" style={{
                  width: '100%', minHeight: 100, padding: '12px 14px',
                  borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-elev)', color: 'var(--text)',
                  fontSize: 13, resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                }} />
              </FormField>
            )}
          </div>
        )}
      </SidePanel>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
          background: 'var(--text)', color: 'var(--bg-elev)',
          padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'fadeIn 0.2s ease',
        }}>
          <Icon name="check" size={14} />{toast}
        </div>
      )}
    </div>
  );
};

window.UsersScreen = UsersScreen;
