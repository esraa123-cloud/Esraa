import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SwapProvider } from './context/SwapContext';
import { ChatProvider } from './context/ChatContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecoverPage } from './pages/RecoverPage';
import { SkillsPage } from './pages/SkillsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SwapsPage } from './pages/SwapsPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const saved = localStorage.getItem('mahara_active_tab');
    return saved ? saved : 'home';
  });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    localStorage.setItem('mahara_active_tab', tabId);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'skills':
        return <SkillsPage setActiveTab={setActiveTab} />;
      case 'swaps':
        return <SwapsPage setActiveTab={setActiveTab} />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'register':
        return <RegisterPage setActiveTab={setActiveTab} />;
      case 'recover':
        return <RecoverPage setActiveTab={setActiveTab} />;
      case 'home':
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <SwapProvider>
        <ChatProvider>
          <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main style={{ flex: 1 }}>
              {renderActiveTab()}
            </main>
            {activeTab !== 'login' && activeTab !== 'register' && activeTab !== 'recover' && (
              <Footer />
            )}
          </div>
        </ChatProvider>
      </SwapProvider>
    </AuthProvider>
  );
}
