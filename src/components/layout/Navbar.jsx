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
          <div className="logo-symbol-wrap">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mLogoGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5a623" />
                  <stop offset="50%" stopColor="#ffc142" />
                  <stop offset="100%" stopColor="#1de9b6" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="16.5" fill="url(#mLogoGradNav)" fillOpacity="0.1" stroke="url(#mLogoGradNav)" strokeWidth="1.8" />
              <path d="M11 22V17C11 13.5 13.8 11 17.5 11C21 11 24 13.5 24 17C24 20.5 21 23 17.5 23C15 23 13 21.5 13 19.5" stroke="url(#mLogoGradNav)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="25" cy="11" r="3" fill="#1de9b6" />
            </svg>
          </div>
          <div className="logo-brand-title">
            مهارة
          </div>
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
              <div className="user-avatar-sm">{currentUser.avatar || 'إ'}</div>
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
              أنشئ حساب
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
