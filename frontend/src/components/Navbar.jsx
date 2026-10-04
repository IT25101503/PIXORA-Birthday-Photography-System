import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Camera, ShoppingBag, Menu, X, LogOut, Shield, Calendar, Bell } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isPhotographer, isClient } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Notification bell state
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      let endpoint = '/api/client/notifications';
      if (isAdmin) endpoint = '/api/admin/notifications';
      else if (isPhotographer) endpoint = '/api/photographer/notifications';
      const res = await api.get(endpoint);
      const data = res.data || [];
      setNotifications(data.slice(0, 10));
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 25000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      let endpoint = '/api/client/notifications/read-all';
      if (isAdmin) endpoint = '/api/admin/notifications/read-all';
      else if (isPhotographer) endpoint = '/api/photographer/notifications/read-all';
      await api.put(endpoint);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      // silently fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isPhotographer) return '/photographer';
    return '/client';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Portal';
    if (isPhotographer) return 'Photographer Studio';
    return 'My Bookings';
  };

  const isActive = (path) => location.pathname === path;

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-gold/12 transition-all"
      style={{ background: 'linear-gradient(180deg, rgba(7,6,10,0.95) 0%, rgba(10,9,14,0.90) 100%)' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5 group-hover:border-gold group-hover:bg-gold/15 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Camera className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-serif-title text-2xl font-bold tracking-widest text-gold-gradient">
                PIXORA
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                Birthday Event Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className={`transition-colors hover:text-gold ${isActive('/') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-300'}`}>Home</Link>
            <Link to="/packages" className={`transition-colors hover:text-gold ${isActive('/packages') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-300'}`}>Packages</Link>
            <Link to="/portfolio" className={`transition-colors hover:text-gold ${isActive('/portfolio') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-300'}`}>Portfolio</Link>
            <Link to="/photographers" className={`transition-colors hover:text-gold ${isActive('/photographers') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-300'}`}>Photographers</Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <Link to="/cart" className="relative p-2.5 rounded-full border border-gold/20 text-gray-300 hover:text-gold hover:border-gold/50 bg-[#111] transition-all" title="View Cart / Booking">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(o => !o); if (!notifOpen) fetchNotifications(); }}
                    className="relative p-2.5 rounded-full border border-gold/20 text-gray-300 hover:text-gold hover:border-gold/50 bg-[#111] transition-all"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-[#0e0d12] border border-gold/25 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-[10px] text-gold hover:text-gold/70 font-semibold">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-gray-500 text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.notificationId} className={`px-4 py-3 border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors ${!n.isRead ? 'bg-gold/[0.03]' : ''}`}>
                              <div className="flex items-start space-x-2.5">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-gold' : 'bg-gray-700'}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold truncate ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>{n.title}</p>
                                  <p className="text-[11px] text-gray-500 truncate">{n.message}</p>
                                  <p className="text-[10px] text-gray-600 mt-0.5">{timeAgo(n.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-800">
                        <Link to={getDashboardPath()} onClick={() => setNotifOpen(false)} className="text-[11px] text-gold hover:underline">
                          Go to Dashboard →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Role-Specific Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 text-sm font-medium transition-all"
                >
                  {isAdmin ? <Shield className="w-4 h-4 text-gold" /> : <Calendar className="w-4 h-4 text-gold" />}
                  <span>{getDashboardLabel()}</span>
                </Link>

                {/* User Pill & Logout */}
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-200">{user.fullName}</p>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono">{user.role}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gold transition-colors">Sign In</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold rounded-lg btn-gold shadow-lg">Book Event</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/cart" className="relative p-2 rounded-full border border-gold/20 text-gray-300 hover:text-gold bg-[#111]">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <button onClick={() => { setNotifOpen(o => !o); }} className="relative p-2 rounded-full border border-gold/20 text-gray-300 hover:text-gold bg-[#111]">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-300 hover:text-gold">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d0d] border-b border-gold/20 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-gold">Home</Link>
          <Link to="/packages" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-gold">Packages</Link>
          <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-gold">Portfolio</Link>
          <Link to="/photographers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-gold">Photographers</Link>
          <div className="pt-4 border-t border-gray-800 space-y-3">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 rounded-lg border border-gold text-gold font-medium">
                  {getDashboardLabel()}
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="block w-full text-center py-2 text-sm text-red-400">
                  Sign Out ({user.fullName})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 rounded-lg border border-gray-700 text-gray-300">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 rounded-lg btn-gold font-semibold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
