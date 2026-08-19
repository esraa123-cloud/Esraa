import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mahara_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('mahara_token'));
  });

  const [loading, setLoading] = useState(true);

  // Helper to format user object to ensure fallback fields exist for the UI
  const formatUser = (user) => {
    if (!user) return null;
    return {
      ...user,
      id: user._id || user.id,
      name: user.name || `${user.fname || ''} ${user.lname || ''}`.trim() || 'مستخدم',
      avatar: user.avatar || (user.fname ? user.fname.charAt(0) : 'ع') + (user.lname ? user.lname.charAt(0) : ''),
      skillsTeach: Array.isArray(user.skillsTeach) ? user.skillsTeach : [],
      skillsLearn: Array.isArray(user.skillsLearn) ? user.skillsLearn : [],
      rating: user.rating ?? 5.0,
      swapsCompleted: user.swapsCompleted ?? 0
    };
  };

  const persistUserData = (user, token) => {
    if (token) {
      localStorage.setItem('mahara_token', token);
    }
    if (user) {
      const formatted = formatUser(user);
      localStorage.setItem('mahara_user', JSON.stringify(formatted));
      setCurrentUser(formatted);
      setIsLoggedIn(true);
      return formatted;
    }
    return null;
  };

  const clearUserData = () => {
    localStorage.removeItem('mahara_token');
    localStorage.removeItem('mahara_user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // Restore & verify session on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('mahara_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          persistUserData(data.user);
        } else {
          clearUserData();
        }
      } catch (err) {
        console.error('Session restore error:', err);
        // Only clear if 401 Unauthorized (token invalid/expired)
        if (err.response?.status === 401) {
          clearUserData();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        const formatted = persistUserData(data.user, data.token);
        return { success: true, message: data.message || 'تم تسجيل الدخول بنجاح', user: formatted };
      }
      return { success: false, message: data.message || 'فشل تسجيل الدخول' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        const formatted = persistUserData(data.user, data.token);
        return { success: true, message: data.message || 'تم إنشاء الحساب بنجاح', user: formatted };
      }
      return { success: false, message: data.message || 'فشل إنشاء الحساب' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'تعذر إنشاء الحساب، يرجى التحقق من البيانات';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API warning:', err);
    } finally {
      clearUserData();
    }
  };

  const updateProfile = async (updatedFields) => {
    try {
      const { data } = await api.put('/users/profile', updatedFields);
      if (data.success && data.user) {
        const formatted = persistUserData(data.user);
        return { success: true, message: data.message || 'تم تحديث البيانات', user: formatted };
      }
      return { success: false, message: data.message || 'فشل تحديث البيانات' };
    } catch (err) {
      const message = err.response?.data?.message || 'تعذر تحديث البيانات';
      return { success: false, message };
    }
  };

  const addTeachSkill = async (skill) => {
    try {
      const { data } = await api.post('/users/profile/skills-teach', { skill });
      if (data.success && data.user) {
        const formatted = persistUserData(data.user);
        return { success: true, user: formatted };
      }
      return { success: false };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'تعذر إضافة المهارة' };
    }
  };

  const addLearnSkill = async (skill) => {
    try {
      const { data } = await api.post('/users/profile/skills-learn', { skill });
      if (data.success && data.user) {
        const formatted = persistUserData(data.user);
        return { success: true, user: formatted };
      }
      return { success: false };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'تعذر إضافة المهارة' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addTeachSkill,
        addLearnSkill
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
