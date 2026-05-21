// API client and data fetching hooks

const API_BASE = '/api'; // Replace with actual backend URL in production

class ApiClient {
  constructor(baseURL = API_BASE) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if exists
    const token = localStorage.getItem('sc_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint, params) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(endpoint + query, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient();

// Data fetching hook with loading/error states
const useData = (fetchFn, deps = []) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const refetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  React.useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
};

// Specific resource hooks
const useUsers = (filters = {}) => {
  const fetchFn = React.useCallback(async () => {
    // In production: return await api.get('/users', filters);
    // Mock for now
    await new Promise(r => setTimeout(r, 600));
    return USERS.filter(u => {
      if (filters.status && u.status !== filters.status) return false;
      if (filters.role && u.role !== filters.role) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      }
      return true;
    });
  }, [JSON.stringify(filters)]);

  return useData(fetchFn, [filters]);
};

const useActivity = (filters = {}) => {
  const fetchFn = React.useCallback(async () => {
    await new Promise(r => setTimeout(r, 400));
    return ACTIVITY.filter(a => {
      if (filters.type && a.type !== filters.type) return false;
      return true;
    });
  }, [JSON.stringify(filters)]);

  return useData(fetchFn, [filters]);
};

const useKPIs = () => {
  const fetchFn = React.useCallback(async () => {
    await new Promise(r => setTimeout(r, 500));
    return KPIS;
  }, []);

  return useData(fetchFn, []);
};

// Mutation helper
const useMutation = (mutationFn) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const mutate = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { mutate, loading, error };
};

Object.assign(window, { api, ApiClient, useData, useUsers, useActivity, useKPIs, useMutation });
