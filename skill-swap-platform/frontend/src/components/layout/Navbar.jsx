import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Sparkles, RefreshCw, MessageSquare, User, LogIn, LogOut, Zap } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  const navItem = (tab, label, Icon) => (
    <button
      className={`nav-link ${activeTab === tab ? 'active' : ''}`}
      onClick={() => setActiveTab(tab)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: activeTab === tab ? 'var(--accent)' : 'var(--text)',
        fontWeight: activeTab === tab ? '700' : '500',
        fontSize: '0.95rem',
        padding: '0.4rem 0.2rem'
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  const handleLogout = async () => {
    await logout();
    setActiveTab('home');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 2.5rem',
        background: 'var(--bg, #0e1420)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '800', fontSize: '1.2rem' }}
        onClick={() => setActiveTab('home')}
      >
        <Zap size={22} color="var(--accent)" />
        <span>مهارة</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
        {navItem('home', 'الرئيسية', Home)}
        {navItem('skills', 'المهارات', Sparkles)}
        {isAuthenticated && navItem('swaps', 'التبادلات', RefreshCw)}
        {isAuthenticated && navItem('messages', 'الرسائل', MessageSquare)}
        {isAuthenticated && navItem('profile', 'ملفي الشخصي', User)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              أهلاً، {currentUser?.fname || currentUser?.name}
            </span>
            <button className="btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={handleLogout}>
              <LogOut size={14} />
              <span>خروج</span>
            </button>
          </>
        ) : (
          <>
            <button className="btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('login')}>
              <LogIn size={14} />
              <span>دخول</span>
            </button>
            <button className="btn-solid" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('register')}>
              إنشاء حساب
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
