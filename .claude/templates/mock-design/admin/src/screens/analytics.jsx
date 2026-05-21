const AnalyticsScreen = () => {
  const labels30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = [124, 156, 142, 178, 165, 98, 84];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader
        title="Analytics"
        subtitle="Deep-dive on engagement, cohorts, and funnels."
        crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Analytics' }]}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Select defaultValue="30d" options={[{ value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }]} />
            <Button variant="secondary" icon="filter">Segment</Button>
            <Button variant="primary" icon="download">Export</Button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { k: 'Page views', v: '248,920', d: 18.4 },
          { k: 'Unique visitors', v: '89,140', d: 12.1 },
          { k: 'Avg session', v: '4m 12s', d: 3.2 },
          { k: 'Bounce rate', v: '34.2%', d: -2.8, inv: true },
          { k: 'Conversion', v: '3.8%', d: 0.6 },
        ].map((m, i) => {
          const up = m.d > 0;
          const positive = m.inv ? !up : up;
          return (
            <Card key={m.k} padding={16} dataAos="fade-up" aosDelay={i * 60}>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{m.k}</div>
              <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: '-0.02em' }}>{m.v}</div>
              <div style={{ fontSize: 12, color: positive ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Icon name={up ? 'arrowUp' : 'arrowDown'} size={11} />{Math.abs(m.d)}%
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding={22} dataAos="fade-up" aosDelay={200}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Active users over time</div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>Daily unique active users, last 30 days</div>
        </div>
        <AreaChart data={activeUsersSeries} labels={labels30} color="var(--accent)" height={280} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }} className="dash-grid">
        <Card padding={22} dataAos="fade-right">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Signups by day of week</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>Averaged over the last 12 weeks</div>
          </div>
          <BarChart data={weekData} labels={weekLabels} color="var(--accent)" height={220} />
        </Card>
        <Card padding={22} dataAos="fade-left">
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Conversion funnel</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>From first visit to paid plan</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { s: 'Visited landing', v: 89140, pct: 100 },
              { s: 'Started signup', v: 18340, pct: 20.6 },
              { s: 'Verified email', v: 14820, pct: 16.6 },
              { s: 'Completed onboarding', v: 9640, pct: 10.8 },
              { s: 'Paid plan', v: 3380, pct: 3.8 },
            ].map((r, i, arr) => (
              <div key={r.s}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>{r.s}</span>
                  <span style={{ color: 'var(--text-soft)', fontVariantNumeric: 'tabular-nums' }}>{r.v.toLocaleString()} · {r.pct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-sunken)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${r.pct}%`,
                    background: `color-mix(in srgb, var(--accent) ${100 - i * 12}%, var(--bg-sunken))`,
                    borderRadius: 99, transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

window.AnalyticsScreen = AnalyticsScreen;
