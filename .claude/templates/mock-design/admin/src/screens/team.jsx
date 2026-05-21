const TeamScreen = () => {
  const depts = [...new Set(TEAM.map(t => t.dept))];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader title="Team" subtitle={`${TEAM.length} members across ${depts.length} departments.`}
        crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Team' }]}
        action={<Button variant="primary" icon="plus">Add member</Button>} />

      {depts.map(dept => (
        <div key={dept}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{dept}</h3>
            <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>· {TEAM.filter(t => t.dept === dept).length}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {TEAM.filter(t => t.dept === dept).map((m, i) => (
              <Card key={m.id} padding={18} interactive dataAos="fade-up" aosDelay={i * 40} style={{
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Avatar name={m.name} color={m.avatar} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>{m.role}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="globe" size={11} />{m.location}
                    </div>
                  </div>
                  <IconButton icon="moreV" size={26} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Roles section */}
      <Card padding={0} dataAos="fade-up">
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Roles & permissions</div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>What each role can do in your workspace</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-sunken)' }}>
            <tr>
              {['Permission', 'Viewer', 'Editor', 'Admin'].map((h, i) => (
                <th key={h} style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-soft)', padding: '10px 16px', textAlign: i === 0 ? 'left' : 'center', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = [
                ['View content', true, true, true],
                ['Create & edit', false, true, true],
                ['Delete content', false, true, true],
                ['Invite members', false, false, true],
                ['Manage billing', false, false, true],
                ['Workspace settings', false, false, true],
              ];
              return rows.map((row, idx) => {
                const perm = row[0], v = row[1], e = row[2], a = row[3];
                return (
                  <tr key={perm} style={{ borderBottom: idx === rows.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{perm}</td>
                    {[v, e, a].map((has, j) => (
                      <td key={j} style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {has
                          ? <Icon name="check" size={16} style={{ color: 'var(--success)' }} />
                          : <span style={{ color: 'var(--text-mute)' }}>—</span>}
                      </td>
                    ))}
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

window.TeamScreen = TeamScreen;
