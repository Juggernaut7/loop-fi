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
import SettingsPage from './pages/SettingsPage';
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
