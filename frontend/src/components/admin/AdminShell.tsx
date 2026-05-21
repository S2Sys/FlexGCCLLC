import type { ReactNode } from 'react'

interface AdminShellProps {
  children: ReactNode
  visibleCount: number
}

const navItems = [
  { label: 'Work Requests', meta: 'Active', active: true },
  { label: 'Clients', meta: 'Scope' },
  { label: 'Activity', meta: 'Notes' },
  { label: 'Settings', meta: 'Local' },
]

export function AdminShell({ children, visibleCount }: AdminShellProps) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar" aria-label="Assessment navigation">
        <div className="admin-brand">
          <div className="admin-logo" aria-hidden="true">
            W
          </div>
          <div>
            <strong>Work Console</strong>
            <span>Assessment</span>
          </div>
        </div>

        <nav className="admin-nav">
          <p>Workspace</p>
          {navItems.map((item) => (
            <button
              aria-current={item.active ? 'page' : undefined}
              className={item.active ? 'active' : undefined}
              key={item.label}
              type="button"
            >
              <span>{item.label}</span>
              <small>{item.meta}</small>
            </button>
          ))}
        </nav>

        <div className="admin-user">
          <div className="avatar" aria-hidden="true">
            ST
          </div>
          <div>
            <strong>Senthilvel T</strong>
            <span>Reviewer</span>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search">
            <span aria-hidden="true">Search</span>
            <input aria-label="Global search" placeholder="Search work requests or clients" />
          </div>
          <div className="admin-actions">
            <span className="topbar-pill">{visibleCount} visible</span>
            <span className="topbar-pill">Draft</span>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
