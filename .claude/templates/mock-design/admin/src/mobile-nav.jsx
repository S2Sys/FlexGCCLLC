// Mobile navigation bar

const MobileNav = ({ currentScreen, onNavigate }) => {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return null;

  const items = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="mobile-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-item ${currentScreen === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// Mobile sidebar overlay handler
const useMobileSidebar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileSidebar = () => setMobileOpen(prev => !prev);
  const closeMobileSidebar = () => setMobileOpen(false);

  return { mobileOpen, toggleMobileSidebar, closeMobileSidebar };
};

Object.assign(window, { MobileNav, useMobileSidebar });
