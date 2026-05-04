import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>
        <p className="auth-link">
          ليس لديك حساب؟ <Link to="/signup">إنشاء حساب جديد</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
