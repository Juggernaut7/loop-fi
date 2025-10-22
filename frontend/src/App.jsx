import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationsProvider } from './context/NotificationsContext';

// Pages
import LandingPage from './pages/LandingPage';
import AppLayout from './components/layout/AppLayout';

// App Pages (Protected Routes)
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import EarnPage from './pages/EarnPage';
import SettingsPage from './pages/SettingsPage';
import AIAdvisorPage from './pages/AIAdvisorPage';
import NFTPage from './pages/NFTPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationsPage from './pages/NotificationsPage';
import WalletPage from './pages/WalletPage';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationsProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Protected App Routes */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="earn" element={<EarnPage />} />
                <Route path="ai-advisor" element={<AIAdvisorPage />} />
                <Route path="nft" element={<NFTPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="wallet" element={<WalletPage />} />
              </Route>
              
              {/* Catch all - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;