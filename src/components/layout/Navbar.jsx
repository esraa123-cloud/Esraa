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
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5a623" />
                  <stop offset="100%" stopColor="#1de9b6" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="9" fill="url(#logoGradNav)" fillOpacity="0.12" stroke="url(#logoGradNav)" strokeWidth="1.5" />
              <path d="M10 12C10 9.79 11.79 8 14 8H18C20.21 8 22 9.79 22 12V13M22 20C22 22.21 20.21 24 18 24H14C11.79 24 10 22.21 10 20V19" stroke="url(#logoGradNav)" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M19.5 15L22.5 12L19.5 9" stroke="url(#logoGradNav)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.5 17L9.5 20L12.5 23" stroke="url(#logoGradNav)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
              انضم مجاناً
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
