import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, User, Mail, Lock, Phone, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, applyPhotographer } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('client'); // 'client' | 'photographer'
  const [loading, setLoading] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }

    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      toast.warning('Phone number must contain exactly 10 digits (numbers only).');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'client') {
        await register({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || null,
        });
        toast.success(`Welcome to Pixora, ${fullName.trim()}! Account created.`);
        navigate('/packages');
      } else {
        // Photographer Application - portfolio is optional
        await applyPhotographer({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || null,
          portfolioUrl: portfolioUrl.trim() || null,
        });
        setApplicationSubmitted(true);
        toast.success('Photographer application submitted successfully!');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Show the exact backend message if available; avoid misleading defaults
      const backendMsg = err.response?.data?.error;
      const httpStatus = err.response?.status;

      if (backendMsg) {
        toast.error(backendMsg);
      } else if (httpStatus === 400) {
        toast.error('Registration failed: Please check your details and try again.');
      } else if (httpStatus === 409 || (backendMsg && backendMsg.toLowerCase().includes('email'))) {
        toast.error('This email is already registered. Please sign in or use a different email.');
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative">
      {/* Ambient background glows */}
      <div className="glow-orb-gold w-[700px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <div className="glow-orb-purple w-[400px] h-[400px] -top-20 -left-20 opacity-40" />

      <div className="w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 border border-gold/25 shadow-2xl space-y-7 relative z-10 animate-fade-in-up">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold mx-auto shadow-lg shadow-gold/10 border-glow-animate">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-shimmer">
            Join the Pixora Network
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Create an account to book celebrations or apply as a professional photographer.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-black/50 border border-gray-800/80 text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('client');
              setApplicationSubmitted(false);
            }}
            className={`py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'client'
                ? 'bg-gradient-to-r from-gold to-gold/80 text-black shadow-md shadow-gold/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Client / Family
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('photographer');
              setApplicationSubmitted(false);
            }}
            className={`py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'photographer'
                ? 'bg-gradient-to-r from-gold to-gold/80 text-black shadow-md shadow-gold/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Photographer Partner
          </button>
        </div>

        {/* Success screen for photographer application */}
        {applicationSubmitted ? (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-950/40 to-emerald-950/20 border border-green-500/30 text-center space-y-4">
            <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
            <h3 className="font-serif-title text-xl font-bold text-white">
              Application Under Review
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Thank you for applying to Pixora! Your profile has been sent to our admin team. Once approved, you will be able to sign in and accept birthday bookings.
            </p>
            <div className="pt-2">
              <Link to="/login" className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold inline-block">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-gold" />
                <span>Full Name <span className="text-red-400">*</span></span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Jayawardena"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>Email Address <span className="text-red-400">*</span></span>
              </label>
              <input
                type="email"
                placeholder="e.g. kasun@example.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-gold" />
                <span>Password <span className="text-red-400">*</span></span>
              </label>
              <input
                type="password"
                placeholder="••••••••  (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
                required
                minLength={6}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 text-gold text-[10px] font-bold">📞</span>
                <span>Phone Number <span className="text-gray-500 font-normal">(optional)</span></span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 0771234567 (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
              />
            </div>

            {/* Photographer-specific Portfolio Field — FULLY OPTIONAL */}
            {activeTab === 'photographer' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-gold" />
                  <span>Portfolio URL <span className="text-gray-500 font-normal">(optional)</span></span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://instagram.com/yourphotography"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full bg-[#0e0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/60 transition-all"
                />
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Sharing your portfolio helps admin approve your account faster, but it's not required.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl btn-gold text-sm font-bold shadow-xl shadow-gold/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'client' ? 'Create Client Account' : 'Submit Application'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-800/60">
          <span>Already have an account? </span>
          <Link to="/login" className="text-gold font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
