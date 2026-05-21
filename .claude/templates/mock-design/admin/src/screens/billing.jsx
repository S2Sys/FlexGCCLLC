const BillingScreen = () => {
  const [cancelOpen, setCancelOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader title="Billing" subtitle="Plan, payment method, and invoice history." crumbs={[{ icon: 'home', label: 'Home', href: '#dashboard' }, { label: 'Billing' }]} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }} className="dash-grid">
        <Card padding={24} dataAos="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <Badge tone="accent">Current plan</Badge>
              <div style={{ fontSize: 22, fontWeight: 600, marginTop: 10, letterSpacing: '-0.02em' }}>Enterprise</div>
              <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 4 }}>
                $52/seat/month · renews May 15, 2026
              </div>
            </div>
            <Button variant="secondary" icon="edit">Change plan</Button>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { label: 'Seats used', value: '48', cap: 'of 60' },
              { label: 'API calls', value: '820k', cap: 'of 1M' },
              { label: 'Storage', value: '142 GB', cap: 'of 500 GB' },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-mute)', fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, marginTop: 6 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>{m.cap}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={24} dataAos="fade-left" aosDelay={100}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Payment method</div>
          <div style={{
            padding: 16, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--bg-sunken), var(--bg))',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 44, height: 30, borderRadius: 4,
              background: 'var(--text)', color: 'var(--bg-elev)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            }}>VISA</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>•••• •••• •••• 4242</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>Expires 08 / 2028</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" icon="plus" style={{ marginTop: 10 }}>Add method</Button>
        </Card>
      </div>

      <Card padding={0} dataAos="fade-up" aosDelay={150}>
        <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Invoice history</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 2 }}>Past billing cycles</div>
          </div>
          <Button variant="secondary" size="sm" icon="download">Download all</Button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-sunken)' }}>
            <tr>
              {['Invoice', 'Date', 'Plan', 'Amount', 'Status', ''].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-soft)', padding: '10px 16px', textAlign: h === 'Amount' ? 'right' : 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv, i) => (
              <tr key={inv.id} style={{ borderBottom: i === INVOICES.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{inv.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-soft)' }}>{inv.date}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-soft)' }}>{inv.plan}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${inv.amount.toFixed(2)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge tone={inv.status === 'paid' ? 'success' : 'danger'}>{inv.status}</Badge>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Button variant="ghost" size="sm" icon="download">PDF</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card padding={24} style={{ borderColor: 'var(--danger-soft)' }} dataAos="fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger)' }}>Cancel subscription</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 4 }}>
              Your workspace will remain active until the end of the current billing cycle.
            </div>
          </div>
          <Button variant="danger" onClick={() => setCancelOpen(true)}>Cancel plan</Button>
        </div>
      </Card>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel subscription?"
        footer={<><Button variant="ghost" onClick={() => setCancelOpen(false)}>Keep plan</Button><Button variant="danger" onClick={() => setCancelOpen(false)}>Confirm cancellation</Button></>}>
        <div style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.6 }}>
          You'll lose access to Enterprise features on <strong style={{ color: 'var(--text)' }}>May 15, 2026</strong>. Team members will be downgraded to the Free plan. Invoices and exports will remain available.
        </div>
      </Modal>
    </div>
  );
};

window.BillingScreen = BillingScreen;
