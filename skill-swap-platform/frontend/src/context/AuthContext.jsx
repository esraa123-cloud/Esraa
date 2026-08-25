import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerRequest, loginRequest, logoutRequest, getMeRequest, updateProfileRequest } from '../api/authAPI';

const AuthContext = createContext(null);

const TOKEN_KEY = 'mahara_token';

// Adapts a backend user document to the shape the existing pages expect
// (ProfilePage/Navbar read currentUser.name, .avatar, .skillsTeach, etc).
const toViewUser = (user) => ({
  ...user,
  name: user.name || `${user.fname} ${user.lname}`.trim(),
  avatar: user.avatar || (user.fname ? user.fname.charAt(0) : 'ع'),
  location: user.location || user.country || '',
  skillsTeach: user.skillsTeach || [],
  skillsLearn: user.skillsLearn || []
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMeRequest()
      .then((res) => setCurrentUser(toViewUser(res.data.user)))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginRequest(email, password);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      setCurrentUser(toViewUser(res.data.user));
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await registerRequest(formData);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      setCurrentUser(toViewUser(res.data.user));
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Even if the server call fails, clear the local session.
    }
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await updateProfileRequest(updates);
      setCurrentUser(toViewUser(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
