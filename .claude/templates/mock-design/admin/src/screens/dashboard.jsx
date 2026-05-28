const Dashboard = () => {
  const [range, setRange] = React.useState('30d');
  const labels30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const kpiColor = (name) => ({
    accent: 'var(--accent)',
    success: 'var(--success)',
    warn: 'var(--warn)',
    danger: 'var(--danger)',
  }[name] || 'var(--accent)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader
        title="Dashboard"
        subtitle="Overview of workspace activity for the last 30 days."
        crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Dashboard' }]}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last quarter' },
                { value: 'ytd', label: 'Year to date' },
              ]}
            />
            <Button variant="secondary" icon="download">Export</Button>
            <Button variant="primary" icon="plus">New report</Button>
          </div>
        }
      />

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
        {KPIS.map((k, ki) => {
          const up = k.delta > 0;
          const positive = k.inverse ? !up : up;
          return (
            <Card key={k.label} padding={18} dataAos="fade-up" aosDelay={ki * 70}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 500 }}>{k.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6, letterSpacing: '-0.02em' }}>{k.value}</div>
                </div>
                <Sparkline data={k.series} color={kpiColor(k.accent)} width={80} height={34} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  color: positive ? 'var(--success)' : 'var(--danger)',
                  fontWeight: 600,
                }}>
                  <Icon name={up ? 'arrowUp' : 'arrowDown'} size={12} />
                  {Math.abs(k.delta)}%
                </span>
                <span style={{ color: 'var(--text-mute)' }}>{k.deltaLabel}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }} className="dash-grid">
        <Card padding={22} dataAos="fade-up" aosDelay={100}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Revenue</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>Daily net revenue, USD thousands</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-soft)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} /> This period
              </span>
            </div>
          </div>
          <AreaChart data={revenueSeries} labels={labels30} color="var(--accent)" height={260} />
        </Card>

        <Card padding={22} dataAos="fade-left" aosDelay={180}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Traffic sources</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>Last 30 days</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', marginTop: 8 }}>
            <div style={{ position: 'relative' }}>
              <DonutChart data={TRAFFIC_SOURCES} size={150} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>Total</div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>148k</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {TRAFFIC_SOURCES.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.label}
                  </span>
                  <span style={{ color: 'var(--text-soft)', fontWeight: 500 }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Lower row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }} className="dash-grid">
        <Card padding={22} dataAos="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Top pages</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>By total views this month</div>
            </div>
            <Button variant="ghost" size="sm" iconRight="arrowRight">View all</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TOP_PAGES.map(p => {
              const max = Math.max(...TOP_PAGES.map(x => x.views));
              return (
                <div key={p.path}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', fontWeight: 500 }}>{p.path}</span>
                    <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ color: p.delta > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                        {p.delta > 0 ? '+' : ''}{p.delta}%
                      </span>
                      <span style={{ color: 'var(--text-soft)', fontWeight: 500, minWidth: 56, textAlign: 'right' }}>{p.views.toLocaleString()}</span>
                    </span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-sunken)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(p.views / max) * 100}%`, background: 'var(--accent)', borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={22} dataAos="fade-up" aosDelay={100}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Recent activity</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>Workspace-wide events</div>
            </div>
            <Button variant="ghost" size="sm" iconRight="arrowRight">See all</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACTIVITY.slice(0, 6).map((a, i) => (
              <div key={a.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              }}>
                {a.actor === 'System'
                  ? <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-sunken)', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="zap" size={14} /></div>
                  : <Avatar name={a.actor} color={`hsl(${(a.actor.charCodeAt(0) * 37) % 360}, 60%, 55%)`} />
                }
                <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 500 }}>{a.actor}</span>
                  <span style={{ color: 'var(--text-soft)' }}> {a.action} </span>
                  {a.target && <span style={{ fontWeight: 500 }}>{a.target}</span>}
                  <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
