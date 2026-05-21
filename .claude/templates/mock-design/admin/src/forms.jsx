// Form validation utilities

const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? null : 'Invalid email address';
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Must be at least ${min} characters`;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Must be no more than ${max} characters`;
  },

  pattern: (regex, message) => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  custom: (fn) => fn,
};

// FormField component with validation
const FormField = ({ label, error, hint, required, children }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 6,
        color: error ? 'var(--danger)' : 'var(--text)',
      }}>
        {label}
        {required && <span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>}
      </label>
    )}
    {children}
    {error && (
      <div style={{
        fontSize: 12,
        color: 'var(--danger)',
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <Icon name="alert" size={12} />
        {error}
      </div>
    )}
    {hint && !error && (
      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4 }}>{hint}</div>
    )}
  </div>
);

// useForm hook
const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validate = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    const ruleArray = Array.isArray(rules) ? rules : [rules];
    for (const rule of ruleArray) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validate(name, values[name]);
      if (error) newErrors[name] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    if (Object.keys(newErrors).filter(k => newErrors[k]).length === 0) {
      onSubmit(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
};

Object.assign(window, { validators, FormField, useForm });
