import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AlertsPanel from './components/AlertsPanel';
import HistoryPanel from './components/HistoryPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import CamerasPanel from './components/CamerasPanel';
import SettingsPanel from './components/SettingsPanel';
import LoginPage from './components/auth/LoginPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'alerts':
        return <AlertsPanel />;
      case 'history':
        return <HistoryPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'cameras':
        return <CamerasPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route
          path="/*"
          element={
            user ? (
              <div className="min-h-screen bg-gray-100">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="flex">
                  <Sidebar 
                    isOpen={isSidebarOpen} 
                    setActiveTab={setActiveTab} 
                    activeTab={activeTab} 
                  />
                  <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
                    {renderContent()}
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;