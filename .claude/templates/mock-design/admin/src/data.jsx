// Mock data for the admin panel
const USERS = [
  { id: 'u_01', name: 'Amelia Chen', email: 'amelia.chen@northwind.io', role: 'Admin', status: 'active', plan: 'Enterprise', lastActive: '2m ago', spend: 12840, joined: '2023-04-12', avatar: '#6366f1' },
  { id: 'u_02', name: 'Marcus Okafor', email: 'marcus@groveworks.com', role: 'Editor', status: 'active', plan: 'Pro', lastActive: '14m ago', spend: 4210, joined: '2023-06-08', avatar: '#10b981' },
  { id: 'u_03', name: 'Sofia Lindqvist', email: 'sofia.l@nord.se', role: 'Viewer', status: 'invited', plan: 'Starter', lastActive: '—', spend: 0, joined: '2024-01-22', avatar: '#f59e0b' },
  { id: 'u_04', name: 'Rahul Mehta', email: 'r.mehta@zinnia.in', role: 'Admin', status: 'active', plan: 'Enterprise', lastActive: '1h ago', spend: 18905, joined: '2022-11-03', avatar: '#ef4444' },
  { id: 'u_05', name: 'Jae-won Park', email: 'jaewon@modulo.kr', role: 'Editor', status: 'active', plan: 'Pro', lastActive: '3h ago', spend: 5620, joined: '2023-09-14', avatar: '#0ea5e9' },
  { id: 'u_06', name: 'Claudia Rossi', email: 'c.rossi@piazza.it', role: 'Viewer', status: 'suspended', plan: 'Pro', lastActive: '2d ago', spend: 2100, joined: '2023-02-28', avatar: '#a855f7' },
  { id: 'u_07', name: 'Olamide Adebayo', email: 'ola@lagosflow.co', role: 'Editor', status: 'active', plan: 'Starter', lastActive: '5m ago', spend: 890, joined: '2024-03-11', avatar: '#f97316' },
  { id: 'u_08', name: 'Yuki Tanaka', email: 'yuki@kaiwa.jp', role: 'Admin', status: 'active', plan: 'Enterprise', lastActive: '40m ago', spend: 24100, joined: '2022-08-17', avatar: '#14b8a6' },
  { id: 'u_09', name: 'Elena Voronova', email: 'elena@borealis.ru', role: 'Viewer', status: 'active', plan: 'Pro', lastActive: '8h ago', spend: 3340, joined: '2023-12-01', avatar: '#eab308' },
  { id: 'u_10', name: 'Noah Bergström', email: 'noah@fjord.no', role: 'Editor', status: 'active', plan: 'Starter', lastActive: '1d ago', spend: 1220, joined: '2024-02-14', avatar: '#06b6d4' },
  { id: 'u_11', name: 'Priya Nair', email: 'priya@vermillion.io', role: 'Admin', status: 'active', plan: 'Enterprise', lastActive: '22m ago', spend: 9640, joined: '2023-05-30', avatar: '#8b5cf6' },
  { id: 'u_12', name: 'Dmitri Volkov', email: 'd.volkov@rostov.ru', role: 'Viewer', status: 'invited', plan: 'Starter', lastActive: '—', spend: 0, joined: '2024-04-02', avatar: '#ec4899' },
];

const TEAM = [
  { id: 't_01', name: 'Amelia Chen', role: 'Founder · CEO', dept: 'Leadership', email: 'amelia@smartconsole.co', avatar: '#6366f1', location: 'San Francisco' },
  { id: 't_02', name: 'Marcus Okafor', role: 'Staff Engineer', dept: 'Engineering', email: 'marcus@smartconsole.co', avatar: '#10b981', location: 'Lagos' },
  { id: 't_03', name: 'Sofia Lindqvist', role: 'Head of Design', dept: 'Design', email: 'sofia@smartconsole.co', avatar: '#f59e0b', location: 'Stockholm' },
  { id: 't_04', name: 'Rahul Mehta', role: 'VP Product', dept: 'Product', email: 'rahul@smartconsole.co', avatar: '#ef4444', location: 'Mumbai' },
  { id: 't_05', name: 'Jae-won Park', role: 'Senior Engineer', dept: 'Engineering', email: 'jaewon@smartconsole.co', avatar: '#0ea5e9', location: 'Seoul' },
  { id: 't_06', name: 'Claudia Rossi', role: 'Product Designer', dept: 'Design', email: 'claudia@smartconsole.co', avatar: '#a855f7', location: 'Milan' },
  { id: 't_07', name: 'Yuki Tanaka', role: 'Data Scientist', dept: 'Analytics', email: 'yuki@smartconsole.co', avatar: '#14b8a6', location: 'Tokyo' },
  { id: 't_08', name: 'Priya Nair', role: 'Engineering Manager', dept: 'Engineering', email: 'priya@smartconsole.co', avatar: '#8b5cf6', location: 'Bengaluru' },
];

const ACTIVITY = [
  { id: 'a_01', actor: 'Amelia Chen', action: 'updated billing settings', target: 'Workspace', time: '2 minutes ago', type: 'settings' },
  { id: 'a_02', actor: 'Marcus Okafor', action: 'invited', target: 'noah@fjord.no', time: '14 minutes ago', type: 'user' },
  { id: 'a_03', actor: 'System', action: 'auto-scaled', target: 'production cluster', time: '32 minutes ago', type: 'system' },
  { id: 'a_04', actor: 'Sofia Lindqvist', action: 'published', target: 'Pricing redesign', time: '1 hour ago', type: 'content' },
  { id: 'a_05', actor: 'Rahul Mehta', action: 'approved', target: 'Q2 budget request', time: '2 hours ago', type: 'approval' },
  { id: 'a_06', actor: 'Jae-won Park', action: 'rotated API keys for', target: 'mobile-prod', time: '3 hours ago', type: 'security' },
  { id: 'a_07', actor: 'Claudia Rossi', action: 'suspended user', target: 'spam-bot-4831', time: '5 hours ago', type: 'moderation' },
  { id: 'a_08', actor: 'Priya Nair', action: 'merged pull request', target: '#2184 sidebar nav', time: '6 hours ago', type: 'content' },
  { id: 'a_09', actor: 'System', action: 'backup completed', target: '24.8 TB', time: '8 hours ago', type: 'system' },
  { id: 'a_10', actor: 'Yuki Tanaka', action: 'exported', target: 'Q1 cohort report', time: '1 day ago', type: 'export' },
  { id: 'a_11', actor: 'Olamide Adebayo', action: 'changed password', target: '', time: '1 day ago', type: 'security' },
  { id: 'a_12', actor: 'Dmitri Volkov', action: 'accepted invite to', target: 'Growth team', time: '2 days ago', type: 'user' },
];

const INVOICES = [
  { id: 'INV-2026-0419', date: 'Apr 15, 2026', amount: 2480.00, status: 'paid', plan: 'Enterprise · 48 seats' },
  { id: 'INV-2026-0318', date: 'Mar 15, 2026', amount: 2480.00, status: 'paid', plan: 'Enterprise · 48 seats' },
  { id: 'INV-2026-0217', date: 'Feb 15, 2026', amount: 2360.00, status: 'paid', plan: 'Enterprise · 46 seats' },
  { id: 'INV-2026-0116', date: 'Jan 15, 2026', amount: 2360.00, status: 'paid', plan: 'Enterprise · 46 seats' },
  { id: 'INV-2025-1215', date: 'Dec 15, 2025', amount: 2240.00, status: 'paid', plan: 'Enterprise · 44 seats' },
  { id: 'INV-2025-1114', date: 'Nov 15, 2025', amount: 2240.00, status: 'failed', plan: 'Enterprise · 44 seats' },
];

// Chart time series — 30 days of values (realistic noisy growth)
const revenueSeries = [
  42, 48, 45, 52, 58, 61, 55, 68, 72, 69, 74, 81, 78, 85, 91, 88, 94, 102, 98, 108, 115, 112, 120, 128, 124, 131, 138, 142, 149, 156
];
const signupsSeries = [
  18, 22, 19, 25, 28, 31, 27, 35, 32, 29, 38, 42, 40, 37, 44, 48, 51, 47, 54, 59, 56, 62, 68, 64, 71, 76, 72, 79, 84, 88
];
const activeUsersSeries = [
  820, 850, 870, 890, 920, 950, 940, 980, 1010, 995, 1040, 1080, 1070, 1110, 1150, 1140, 1190, 1230, 1220, 1270, 1310, 1300, 1350, 1390, 1380, 1430, 1480, 1470, 1510, 1560
];

const KPIS = [
  { label: 'Monthly Revenue', value: '$156,420', delta: 12.4, deltaLabel: 'vs last month', series: revenueSeries, accent: 'accent' },
  { label: 'Active Users', value: '1,562', delta: 8.2, deltaLabel: 'vs last month', series: activeUsersSeries, accent: 'success' },
  { label: 'New Signups', value: '88', delta: 24.1, deltaLabel: 'this week', series: signupsSeries, accent: 'warn' },
  { label: 'Churn Rate', value: '2.1%', delta: -0.4, deltaLabel: 'vs last month', series: [3.1, 3.0, 2.9, 2.8, 2.7, 2.7, 2.8, 2.6, 2.5, 2.4, 2.5, 2.3, 2.4, 2.3, 2.2, 2.3, 2.2, 2.2, 2.1, 2.1, 2.2, 2.1, 2.0, 2.1, 2.0, 2.0, 2.1, 2.0, 2.1, 2.1], accent: 'danger', inverse: true },
];

const TRAFFIC_SOURCES = [
  { label: 'Direct', value: 34, color: '#6366f1' },
  { label: 'Organic Search', value: 28, color: '#10b981' },
  { label: 'Referral', value: 18, color: '#f59e0b' },
  { label: 'Social', value: 12, color: '#ef4444' },
  { label: 'Email', value: 8, color: '#0ea5e9' },
];

const TOP_PAGES = [
  { path: '/dashboard', views: 48210, delta: 14.2 },
  { path: '/pricing', views: 31480, delta: 8.1 },
  { path: '/features/automation', views: 22140, delta: 22.5 },
  { path: '/docs/quickstart', views: 18920, delta: -3.2 },
  { path: '/blog/spring-release', views: 15840, delta: 41.8 },
  { path: '/changelog', views: 9240, delta: 5.6 },
];

const NOTIFICATIONS = [
  { id: 'n_01', title: 'New enterprise signup', detail: 'Borealis Inc. started a trial', time: '4m ago', unread: true, icon: 'sparkles' },
  { id: 'n_02', title: 'Invoice paid', detail: 'INV-2026-0419 · $2,480.00', time: '1h ago', unread: true, icon: 'creditCard' },
  { id: 'n_03', title: 'Usage alert', detail: 'API calls at 82% of plan limit', time: '3h ago', unread: true, icon: 'alert' },
  { id: 'n_04', title: 'Team invite accepted', detail: 'Dmitri Volkov joined Growth', time: '1d ago', unread: false, icon: 'users' },
  { id: 'n_05', title: 'Weekly report ready', detail: 'Apr 12 – Apr 19 summary', time: '2d ago', unread: false, icon: 'analytics' },
];

Object.assign(window, {
  USERS, TEAM, ACTIVITY, INVOICES, KPIS,
  TRAFFIC_SOURCES, TOP_PAGES, NOTIFICATIONS,
  revenueSeries, signupsSeries, activeUsersSeries,
});
