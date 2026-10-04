import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import Portfolio from './pages/Portfolio';
import Photographers from './pages/Photographers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import ClientDashboard from './pages/client/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PhotographerDashboard from './pages/photographer/PhotographerDashboard';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070709] text-gray-100 font-sans selection:bg-gold selection:text-black">
      {/* Ambient animated dark/gold background */}
      <div className="ambient-bg">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="ambient-orb-3" />
        <div className="ambient-grid" />
      </div>
      {/* Persistent cinematic background */}
      <div className="page-bg" />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/photographers" element={<Photographers />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Client Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Photographer Routes */}
          <Route
            path="/photographer"
            element={
              <ProtectedRoute allowedRoles={['PHOTOGRAPHER']}>
                <PhotographerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Toast Notifications Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#111111',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          color: '#ffffff',
          borderRadius: '12px',
        }}
      />
    </div>
  );
}

export default App;
