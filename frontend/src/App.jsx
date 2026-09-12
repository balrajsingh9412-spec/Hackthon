import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import Character from './pages/Character';
import Shop from './pages/Shop';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';

import LoadingSkeleton from './components/LoadingSkeleton';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B14] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4 animate-bounce">⚔️</div>
        <p className="font-fantasy font-bold text-emerald-500 text-sm">
          ENTERING LIFEQUEST REALM...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#090B14] text-[#F8FAFC] flex flex-col">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full mb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Protected RPG Application Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />

      <Route
        path="/quests"
        element={
          <ProtectedLayout>
            <Quests />
          </ProtectedLayout>
        }
      />
      <Route
        path="/character"
        element={
          <ProtectedLayout>
            <Character />
          </ProtectedLayout>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedLayout>
            <Shop />
          </ProtectedLayout>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedLayout>
            <Inventory />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
