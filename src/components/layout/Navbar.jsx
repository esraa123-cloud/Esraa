import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setActiveTab('home');
  };

  return (
    <nav>
      <div className="nav-brand-group">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="قائمة الملاحة"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="logo" onClick={() => handleNavClick('home')}>
          مهارة<span>.</span>
        </div>
      </div>

      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        <li>
          <button
            className={activeTab === 'home' ? 'active' : ''}
            onClick={() => handleNavClick('home')}
          >
            الرئيسية
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'skills' ? 'active' : ''}
            onClick={() => handleNavClick('skills')}
          >
            المهارات والطلبات
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'swaps' ? 'active' : ''}
            onClick={() => handleNavClick('swaps')}
          >
            طلبات التبادل
          </button>
        </li>
        <li>
          <button
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => handleNavClick('messages')}
          >
            الرسائل
          </button>
        </li>
      </ul>

      <div className="nav-btns">
        {isLoggedIn && currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div
              className="nav-user-profile"
              onClick={() => handleNavClick('profile')}
              title="الملف الشخصي"
            >
              <div className="user-avatar-sm">{currentUser.avatar || 'ع'}</div>
              <span className="nav-username">{currentUser.name}</span>
            </div>
            <button
              className="btn-outline logout-btn"
              onClick={handleLogout}
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
              <span>خروج</span>
            </button>
          </div>
        ) : (
          <>
            <button className="btn-outline" onClick={() => handleNavClick('login')}>
              تسجيل الدخول
            </button>
            <button className="btn-solid" onClick={() => handleNavClick('register')}>
              انضم مجاناً
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
