import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const formatUser = (user) => {
    if (!user) return null;
    return {
      ...user,
      id: user._id || user.id || 'u1',
      name: user.name || `${user.fname || ''} ${user.lname || ''}`.trim() || 'إسراء صلاح',
      avatar: user.avatar || 'إ ص',
      skillsTeach: Array.isArray(user.skillsTeach) ? user.skillsTeach : [],
      skillsLearn: Array.isArray(user.skillsLearn) ? user.skillsLearn : [],
      rating: user.rating ?? 5.0,
      swapsCompleted: user.swapsCompleted ?? 18
    };
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mahara_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved user:', e);
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('mahara_token') && localStorage.getItem('mahara_user'));
  });

  const [loading, setLoading] = useState(false);

  const persistUserData = (user, token = 'demo_token_12345') => {
    const formatted = formatUser(user);
    localStorage.setItem('mahara_token', token);
    localStorage.setItem('mahara_user', JSON.stringify(formatted));
    setCurrentUser(formatted);
    setIsLoggedIn(true);
    return formatted;
  };

  const clearUserData = () => {
    localStorage.removeItem('mahara_token');
    localStorage.removeItem('mahara_user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const found = INITIAL_USERS.find(u => u.email === email) || {
        id: 'u_' + Date.now(),
        name: email.split('@')[0],
        fname: email.split('@')[0],
        lname: '',
        email,
        skillsTeach: ['تطوير React', 'JavaScript'],
        skillsLearn: ['تصميم UI/UX'],
        rating: 5.0,
        swapsCompleted: 0
      };
      const formatted = persistUserData(found);
      return { success: true, message: 'تم تسجيل الدخول بنجاح', user: formatted };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = {
        id: 'u_' + Date.now(),
        name: `${userData.fname || ''} ${userData.lname || ''}`.trim() || userData.username || 'مستخدم جديد',
        fname: userData.fname || '',
        lname: userData.lname || '',
        email: userData.email,
        username: userData.username,
        country: userData.country || 'مصر',
        skillsTeach: userData.skillsTeach || [],
        skillsLearn: userData.skillsLearn || [],
        rating: 5.0,
        swapsCompleted: 0
      };
      const formatted = persistUserData(newUser);
      return { success: true, message: 'تم إنشاء الحساب بنجاح', user: formatted };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    clearUserData();
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return { success: false, message: 'غير مسجل الدخول' };
    const updated = formatUser({ ...currentUser, ...updatedFields });
    persistUserData(updated);
    return { success: true, message: 'تم تحديث البيانات بنجاح', user: updated };
  };

  const addTeachSkill = async (skill) => {
    if (!currentUser) return { success: false };
    const teach = currentUser.skillsTeach.includes(skill)
      ? currentUser.skillsTeach
      : [...currentUser.skillsTeach, skill];
    const updated = formatUser({ ...currentUser, skillsTeach: teach });
    persistUserData(updated);
    return { success: true, user: updated };
  };

  const addLearnSkill = async (skill) => {
    if (!currentUser) return { success: false };
    const learn = currentUser.skillsLearn.includes(skill)
      ? currentUser.skillsLearn
      : [...currentUser.skillsLearn, skill];
    const updated = formatUser({ ...currentUser, skillsLearn: learn });
    persistUserData(updated);
    return { success: true, user: updated };
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
