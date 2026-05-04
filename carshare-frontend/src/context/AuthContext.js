import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // نحفظو المستخدم في localStorage باش يبقى مسجل حتى بعد إغلاق المتصفح
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // إنشاء حساب جديد - يتصل بـ API ويحفظ في قاعدة البيانات
  const signup = async (name, email, password, role) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'فشل إنشاء الحساب' };
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'تعذر الاتصال بالسيرفر، تأكد أن السيرفر شغال' };
    }
  };

  // تسجيل الدخول - يتحقق من قاعدة البيانات
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'البريد أو كلمة المرور غلط' };
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'تعذر الاتصال بالسيرفر، تأكد أن السيرفر شغال' };
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
