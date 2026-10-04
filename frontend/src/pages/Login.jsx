import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Lock, Mail, ArrowRight, Shield, Phone, KeyRound, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Reset states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1=enter phone, 2=enter OTP+new password
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPassword, setOtpNewPassword] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(email.trim().toLowerCase(), password);
      toast.success(`Welcome back, ${userData.fullName}!`);

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      if (userData.role === 'ADMIN') navigate('/admin');
      else if (userData.role === 'PHOTOGRAPHER') navigate('/photographer');
      else navigate('/client');
    } catch (err) {
      console.error('Login error:', err);
      const backendMsg = err.response?.data?.error;
      if (backendMsg) toast.error(backendMsg);
      else if (err.response?.status === 401) toast.error('Invalid email or password. Please try again.');
      else if (err.response?.status === 403) toast.error('Your account is pending approval or has been deactivated.');
      else toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otpPhone.trim()) {
      toast.warning('Please enter your registered phone number');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password/send-otp', { phoneNumber: otpPhone.trim() });
      const data = res.data;
      toast.success(data.message || 'OTP sent!');
      if (data.debugOtp) setDebugOtp(data.debugOtp);
      setOtpStep(2);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || !otpNewPassword.trim()) {
      toast.warning('Please enter the OTP and your new password');
      return;
    }
    if (otpNewPassword.length < 6) {
      toast.warning('New password must be at least 6 characters');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password/verify-otp', {
        phoneNumber: otpPhone.trim(),
        otp: otpCode.trim(),
        newPassword: otpNewPassword
      });
      toast.success(res.data.message || 'Password reset successfully! Please sign in.');
      setOtpModalOpen(false);
      setOtpStep(1);
      setOtpPhone('');
      setOtpCode('');
      setOtpNewPassword('');
      setDebugOtp('');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'OTP verification failed';
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const closeOtpModal = () => {
    setOtpModalOpen(false);
    setOtpStep(1);
    setOtpPhone('');
    setOtpCode('');
    setOtpNewPassword('');
    setDebugOtp('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative">
      {/* Ambient glows */}
      <div className="glow-orb-gold w-[600px] h-[360px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="glow-orb-purple w-[350px] h-[350px] bottom-0 right-0 opacity-30" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border border-gold/25 shadow-2xl space-y-7 relative z-10 animate-fade-in-up">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mx-auto shadow-lg shadow-gold/10 border-glow-animate">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-shimmer">
            Welcome to Pixora
          </h2>
          <p className="text-xs text-gray-400">
            Sign in to manage your bookings, invoices, or event galleries.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-gold" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
              required
            />
            <div className="text-right mt-1.5">
              <button
                type="button"
                onClick={() => setOtpModalOpen(true)}
                className="text-[11px] text-gold hover:text-gold/70 underline underline-offset-2"
              >
                Forgot password? Reset via Phone OTP
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl btn-gold text-sm font-bold shadow-xl shadow-gold/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-2 border-t border-gray-800/60 space-y-2.5">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center">
            ⚡ Quick Demo Access
          </p>
          <button
            type="button"
            onClick={() => fillCredentials('admin@pixora.lk', 'Admin@123')}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-gold/8 to-gold/4 hover:from-gold/15 hover:to-gold/8 border border-gold/25 text-xs text-gold flex items-center justify-between transition-all font-mono group"
          >
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Master Admin</span>
            </span>
            <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">
              admin@pixora.lk / Admin@123
            </span>
          </button>
        </div>

        {/* Register footer */}
        <div className="text-center text-xs text-gray-500">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-gold font-semibold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>

      {/* ── MODAL: Phone OTP Password Reset ─────────────────── */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-gold/40 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <Phone className="w-4 h-4 text-gold" />
                  <span className="text-xs font-mono text-gold uppercase tracking-wider">Password Reset</span>
                </div>
                <h3 className="font-serif-title text-base font-bold text-white">
                  {otpStep === 1 ? 'Verify Your Phone' : 'Enter OTP Code'}
                </h3>
              </div>
              <button onClick={closeOtpModal} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center space-x-2">
              <div className={`flex-1 h-1 rounded-full ${otpStep >= 1 ? 'bg-gold' : 'bg-gray-800'}`} />
              <div className={`flex-1 h-1 rounded-full ${otpStep >= 2 ? 'bg-gold' : 'bg-gray-800'}`} />
            </div>

            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-gray-400">
                  Enter your registered phone number. An OTP code will be sent to verify your identity.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Registered Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0712345678 or +94712345678"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-1">
                  <button type="button" onClick={closeOtpModal} className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs text-gray-300">Cancel</button>
                  <button type="submit" disabled={otpLoading} className="px-5 py-2.5 rounded-xl btn-gold text-xs font-semibold disabled:opacity-50">
                    {otpLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-xs text-gray-400">
                  Enter the 6-digit OTP sent to <span className="text-white font-mono">{otpPhone}</span> and your new password.
                </p>
                {debugOtp && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-300">
                    <span className="font-semibold">Demo OTP:</span>{' '}
                    <span className="font-mono text-white">{debugOtp}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1">
                    <KeyRound className="w-3.5 h-3.5 text-gold" />
                    <span>6-Digit OTP Code *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 847291"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono tracking-[0.3em] text-center"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-gold" />
                    <span>New Password * (min. 6 chars)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={otpNewPassword}
                    onChange={(e) => setOtpNewPassword(e.target.value)}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                    minLength={6}
                    required
                  />
                </div>
                <div className="flex justify-between space-x-3 pt-1">
                  <button type="button" onClick={() => { setOtpStep(1); setDebugOtp(''); }} className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs text-gray-300">
                    ← Back
                  </button>
                  <button type="submit" disabled={otpLoading} className="px-5 py-2.5 rounded-xl btn-gold text-xs font-semibold disabled:opacity-50">
                    {otpLoading ? 'Verifying...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
