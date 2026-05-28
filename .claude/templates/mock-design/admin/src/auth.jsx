// Authentication context and screens

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(() => {
    const stored = localStorage.getItem('sc_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = React.useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    const mockUser = {
      id: 'u_01',
      name: 'Amelia Chen',
      email,
      role: 'Admin',
      avatar: '#6366f1',
      permissions: ['users:read', 'users:write', 'billing:read', 'billing:write', 'settings:write'],
    };
    setUser(mockUser);
    localStorage.setItem('sc_user', JSON.stringify(mockUser));
    setLoading(false);
    return { success: true };
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const mockUser = {
      id: 'u_new',
      name,
      email,
      role: 'Editor',
      avatar: '#10b981',
      permissions: ['users:read', 'billing:read'],
    };
    setUser(mockUser);
    localStorage.setItem('sc_user', JSON.stringify(mockUser));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sc_user');
  };

  const resetPassword = async (email) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    return { success: true };
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.role === 'Admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Login Screen
const LoginScreen = ({ onSwitchToSignup, onSwitchToReset }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const result = await login(email, password);
    if (!result.success) setError(result.error || 'Login failed');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 20,
    }}>
      <Card style={{ width: '100%', maxWidth: 420 }} padding={32}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000))',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px var(--ring)',
          }}>
            <Icon name="layers" size={24} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Sign in to Smart Console</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--danger)',
            }}>{error}</div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon="mail"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              icon="key"
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="button"
            onClick={onSwitchToReset}
            style={{
              alignSelf: 'flex-start',
              fontSize: 12,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Forgot password?
          </button>

          <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-soft)' }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            style={{
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Sign up
          </button>
        </div>
      </Card>
    </div>
  );
};

// Signup Screen
const SignupScreen = ({ onSwitchToLogin }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { signup, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    const result = await signup(name, email, password);
    if (!result.success) setError(result.error || 'Signup failed');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 20,
    }}>
      <Card style={{ width: '100%', maxWidth: 420 }} padding={32}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000))',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px var(--ring)',
          }}>
            <Icon name="layers" size={24} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Get started with Smart Console</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--danger)',
            }}>{error}</div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Amelia Chen"
              icon="users"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon="mail"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              icon="key"
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4 }}>
              Must be at least 8 characters
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-soft)' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Sign in
          </button>
        </div>
      </Card>
    </div>
  );
};

// Password Reset Screen
const ResetPasswordScreen = ({ onBack }) => {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 20,
      }}>
        <Card style={{ width: '100%', maxWidth: 420 }} padding={32}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--success-soft)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name="check" size={28} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Check your email</h2>
            <p style={{ fontSize: 14, color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: 24 }}>
              We've sent password reset instructions to <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </p>
            <Button variant="secondary" onClick={onBack} style={{ width: '100%' }}>
              Back to login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 20,
    }}>
      <Card style={{ width: '100%', maxWidth: 420 }} padding={32}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Reset password</h1>
          <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>
            Enter your email and we'll send you reset instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon="mail"
              style={{ width: '100%' }}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>

          <Button variant="ghost" onClick={onBack} style={{ width: '100%' }}>
            Back to login
          </Button>
        </form>
      </Card>
    </div>
  );
};

Object.assign(window, { AuthProvider, useAuth, LoginScreen, SignupScreen, ResetPasswordScreen });
