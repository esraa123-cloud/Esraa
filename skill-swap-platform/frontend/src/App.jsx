import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Tabs that require a logged-in user. Kept outside the component so the
// array identity doesn't change across renders.
const PROTECTED_TABS = ['swaps', 'messages', 'profile'];

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { isAuthenticated, loading } = useAuth();

  const goToTab = (tab) => {
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
  };

  const renderActiveTab = () => {
    // Avoid flashing a protected page before the initial session check resolves.
    if (loading && PROTECTED_TABS.includes(activeTab)) {
      return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--muted)' }}>...جاري التحميل</div>;
    }

    if (PROTECTED_TABS.includes(activeTab) && !isAuthenticated) {
      return <LoginPage setActiveTab={goToTab} />;
    }

    switch (activeTab) {
      case 'skills':
        return <SkillsPage setActiveTab={goToTab} />;
      case 'swaps':
        return <SwapsPage setActiveTab={goToTab} />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'login':
        return <LoginPage setActiveTab={goToTab} />;
      case 'register':
        return <RegisterPage setActiveTab={goToTab} />;
      case 'recover':
        return <RecoverPage setActiveTab={goToTab} />;
      case 'home':
      default:
        return <HomePage setActiveTab={goToTab} />;
    }
  };

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={goToTab} />
      <main style={{ flex: 1 }}>
        {renderActiveTab()}
      </main>
      {activeTab !== 'login' && activeTab !== 'register' && activeTab !== 'recover' && (
        <Footer />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SwapProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </SwapProvider>
    </AuthProvider>
  );
}
