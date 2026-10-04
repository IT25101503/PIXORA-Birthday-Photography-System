import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
  Shield, 
  Calendar, 
  CreditCard, 
  UserCheck, 
  Package as PackageIcon, 
  Camera, 
  Check, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  DollarSign,
  Search,
  UserPlus,
  Star,
  Download,
  Users,
  Tag,
  MessageSquare,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getImageUrl, downloadImage } from '../../utils/imageUrl';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'payments' | 'photographers' | 'clients' | 'packages' | 'photos' | 'reviews' | 'promos' | 'analytics'
  const [loading, setLoading] = useState(true);

  // Data states
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [pendingPhotographers, setPendingPhotographers] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promos, setPromos] = useState([]);
  const [clientSearch, setClientSearch] = useState('');

  // Modals & form states
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState('');
  const [assignConflictError, setAssignConflictError] = useState('');
  
  const [packageModal, setPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [packageDesc, setPackageDesc] = useState('');

  // Promo Code modal state
  const [promoModal, setPromoModal] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountPercent: 10,
    maxDiscountLkr: '',
    minBookingAmountLkr: '',
    expiryDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes, phRes, pphRes, clRes, pkgRes, photoRes, revRes, promoRes] = await Promise.all([
        api.get('/api/admin/bookings'),
        api.get('/api/admin/payments'),
        api.get('/api/admin/users/photographers'),
        api.get('/api/admin/users/photographers/pending'),
        api.get('/api/admin/users/clients'),
        api.get('/api/admin/packages'),
        api.get('/api/admin/photos'),
        api.get('/api/admin/reviews'),
        api.get('/api/admin/promos').catch(() => ({ data: [] }))
      ]);
      setBookings(bRes.data);
      setPayments(pRes.data);
      setPhotographers(phRes.data);
      setPendingPhotographers(pphRes.data);
      setClients(clRes.data);
      setPackages(pkgRes.data);
      setPhotos(photoRes.data);
      setReviews(revRes.data);
      setPromos(promoRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
      toast.error('Failed to load admin management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatLKR = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount).replace('LKR', 'Rs.');
  };

  // ── Bookings Actions ──────────────────────────────────────────
  const handleConfirmBooking = async (id) => {
    try {
      await api.put(`/api/admin/bookings/${id}/confirm`);
      toast.success(`Booking #${id} confirmed`);
      fetchData();
    } catch (err) {
      toast.error('Failed to confirm booking');
    }
  };

  const handleCompleteBooking = async (id) => {
    try {
      await api.put(`/api/admin/bookings/${id}/complete`);
      toast.success(`Booking #${id} marked as completed`);
      fetchData();
    } catch (err) {
      toast.error('Failed to complete booking');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel booking #${id}?`)) return;
    try {
      await api.put(`/api/admin/bookings/${id}/cancel`);
      toast.info(`Booking #${id} cancelled`);
      fetchData();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleAssignPhotographer = async (e) => {
    e.preventDefault();
    if (!selectedPhotographerId) {
      toast.warning('Please select a photographer');
      return;
    }
    setAssignConflictError('');
    try {
      await api.put(`/api/admin/bookings/${assignModalBooking.bookingId}/assign-photographer?photographerId=${selectedPhotographerId}`);
      toast.success('Assignment request sent to photographer (Pending Acceptance)!');
      setAssignModalBooking(null);
      setSelectedPhotographerId('');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to assign photographer';
      setAssignConflictError(msg);
      toast.error(msg);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm(`Permanently delete booking #${id}? All associated payments, photos, and reviews will be removed (CASCADE).`)) return;
    try {
      await api.delete(`/api/admin/bookings/${id}`);
      toast.success(`Booking #${id} permanently deleted.`);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete booking');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Permanently delete user "${name}" (ID #${userId})? All associated bookings, assignments, photos, and reviews will be removed (CASCADE).`)) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success(`User "${name}" deleted successfully.`);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(`Permanently delete review #${reviewId}?`)) return;
    try {
      await api.delete(`/api/admin/reviews/${reviewId}`);
      toast.success(`Review #${reviewId} deleted.`);
      // Immediate local state update:
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  // ── Payments Actions ──────────────────────────────────────────
  const handleApprovePayment = async (id) => {
    try {
      await api.put(`/api/admin/payments/${id}/approve`);
      toast.success(`Payment #${id} approved! Client receipt enabled.`);
      fetchData();
    } catch (err) {
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (id) => {
    if (!window.confirm(`Reject payment record #${id}?`)) return;
    try {
      await api.put(`/api/admin/payments/${id}/reject`);
      toast.warning(`Payment #${id} rejected`);
      fetchData();
    } catch (err) {
      toast.error('Failed to reject payment');
    }
  };

  // ── Photographer Approvals ────────────────────────────────────
  const handleApprovePhotographer = async (userId) => {
    try {
      await api.put(`/api/admin/users/${userId}/approve`);
      toast.success('Photographer application approved!');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve photographer');
    }
  };

  const handleRejectPhotographer = async (userId) => {
    if (!window.confirm('Reject this photographer application?')) return;
    try {
      await api.put(`/api/admin/users/${userId}/reject`);
      toast.info('Photographer application rejected');
      fetchData();
    } catch (err) {
      toast.error('Failed to reject photographer');
    }
  };

  // ── Package Actions ───────────────────────────────────────────
  const handleSavePackage = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(packagePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warning('Package price must be a positive value greater than 0.');
      return;
    }
    try {
      const payload = {
        packageName: packageName.trim(),
        priceLkr: priceNum,
        description: packageDesc.trim(),
        isActive: true,
      };

      if (editingPackage) {
        await api.put(`/api/admin/packages/${editingPackage.packageId}`, payload);
        toast.success('Package updated successfully');
      } else {
        await api.post('/api/admin/packages', payload);
        toast.success('New package created');
      }
      setPackageModal(false);
      setEditingPackage(null);
      setPackageName('');
      setPackagePrice('');
      setPackageDesc('');
      fetchData();
    } catch (err) {
      toast.error('Failed to save package');
    }
  };

  const handleTogglePackage = async (id) => {
    try {
      await api.put(`/api/admin/packages/${id}/toggle`);
      toast.success('Package status toggled');
      fetchData();
    } catch (err) {
      toast.error('Failed to toggle package');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/api/admin/packages/${id}`);
      toast.success('Package deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete package');
    }
  };

  // ── Photo Actions ─────────────────────────────────────────────
  const handleTogglePublish = async (photoId) => {
    try {
      await api.put(`/api/admin/photos/${photoId}/toggle-publish`);
      toast.success('Portfolio visibility updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update photo status');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/api/admin/photos/${photoId}`);
      toast.success('Photo removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  // ── Promo Codes Actions ───────────────────────────────────────
  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!promoForm.code.trim()) {
      toast.warning('Please enter a promo code');
      return;
    }
    try {
      await api.post('/api/admin/promos', {
        code: promoForm.code.trim().toUpperCase(),
        discountPercent: parseInt(promoForm.discountPercent),
        maxDiscountLkr: promoForm.maxDiscountLkr ? parseFloat(promoForm.maxDiscountLkr) : null,
        minBookingAmountLkr: promoForm.minBookingAmountLkr ? parseFloat(promoForm.minBookingAmountLkr) : null,
        expiryDate: promoForm.expiryDate || null,
        isActive: true
      });
      toast.success('Promo code created successfully!');
      setPromoModal(false);
      setPromoForm({ code: '', discountPercent: 10, maxDiscountLkr: '', minBookingAmountLkr: '', expiryDate: '' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create promo code';
      toast.error(msg);
    }
  };

  const handleTogglePromo = async (id) => {
    try {
      await api.put(`/api/admin/promos/${id}/toggle`);
      toast.success('Promo status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to toggle promo code');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await api.delete(`/api/admin/promos/${id}`);
      toast.success('Promo code deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete promo code');
    }
  };


  // Metric computations
  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'APPROVED' || p.paymentStatus === 'PAID')
    .reduce((sum, p) => sum + (Number(p.amountPaidLkr) || 0), 0);
  const pendingPaymentsCount = payments.filter((p) => p.paymentStatus === 'PENDING_APPROVAL').length;
  const pendingApprovalsCount = pendingPhotographers.length + pendingPaymentsCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-gold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Master Administration</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            Pixora Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage birthday bookings, approve bank receipts, supervise photographers, and curate public galleries.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-mono tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif-title text-3xl font-bold text-white">{bookings.length}</p>
          <span className="text-[11px] text-gray-400">Across all celebration packages</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gold/40 space-y-2 bg-gold/5">
          <div className="flex items-center justify-between text-gold">
            <span className="text-xs uppercase font-mono tracking-wider">Verified Revenue</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif-title text-2xl sm:text-3xl font-bold text-gold">
            {formatLKR(totalRevenue)}
          </p>
          <span className="text-[11px] text-gray-400">Card & approved bank receipts</span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-mono tracking-wider">Pending Action</span>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="font-serif-title text-3xl font-bold text-yellow-400">
            {pendingApprovalsCount}
          </p>
          <span className="text-[11px] text-gray-400">
            {pendingPhotographers.length} photographers, {pendingPaymentsCount} slips
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-mono tracking-wider">Active Photographers</span>
            <UserCheck className="w-4 h-4 text-green-400" />
          </div>
          <p className="font-serif-title text-3xl font-bold text-white">{photographers.length}</p>
          <span className="text-[11px] text-gray-400">Ready for event assignments</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-gray-800 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'payments'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payments ({payments.length})</span>
          {pendingPaymentsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-[10px] font-bold">
              {pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('photographers')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'photographers'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Photographers ({photographers.length + pendingPhotographers.length})</span>
          {pendingPhotographers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-[10px] font-bold">
              {pendingPhotographers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'clients'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clients ({clients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'packages'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <PackageIcon className="w-4 h-4" />
          <span>Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'photos'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Gallery Moderation ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Client Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'promos'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Codes ({promos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-3 border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Insights</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          
          {/* ── 1. BOOKINGS TAB ──────────────────────────────────── */}
          {activeTab === 'bookings' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title text-xl font-bold text-white">
                  All Client Event Bookings
                </h3>
              </div>

              {bookings.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No bookings registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Package</th>
                        <th className="py-3 px-3">Date & Time</th>
                        <th className="py-3 px-3">Venue</th>
                        <th className="py-3 px-3">Photographer</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-gray-300">
                      {bookings.map((b) => (
                        <tr key={b.bookingId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-3 font-mono text-gold font-bold">#{b.bookingId}</td>
                          <td className="py-4 px-3 font-medium text-white">{b.clientName}</td>
                          <td className="py-4 px-3">{b.packageName}</td>
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span className="text-white block font-medium">{b.eventDate}</span>
                            <span className="text-gray-500">{b.eventTime}</span>
                          </td>
                          <td className="py-4 px-3 max-w-xs truncate" title={b.venueAddress}>
                            {b.venueAddress}
                          </td>
                          <td className="py-4 px-3">
                            {b.photographerName ? (
                              <div>
                                <span className="text-white block font-medium">{b.photographerName}</span>
                                {b.staffStatus === 'PENDING_ACCEPTANCE' && (
                                  <span className="inline-block text-[10px] text-amber-400 font-mono">⏳ Awaiting Acceptance</span>
                                )}
                                {b.staffStatus === 'STAFFED' && (
                                  <span className="inline-block text-[10px] text-emerald-400 font-mono">● Staffed</span>
                                )}
                                {b.staffStatus === 'DECLINED' && (
                                  <span className="inline-block text-[10px] text-red-400 font-mono">✖ Declined</span>
                                )}
                                {(!b.staffStatus || b.staffStatus === 'UNSTAFFED') && (
                                  <span className="inline-block text-[10px] text-gray-500 font-mono">Unstaffed</span>
                                )}
                              </div>
                            ) : (
                              <div>
                                <button
                                  onClick={() => {
                                    setAssignModalBooking(b);
                                    setSelectedPhotographerId('');
                                    setAssignConflictError('');
                                  }}
                                  className="text-xs text-gold underline underline-offset-2 hover:text-gold-light"
                                >
                                  + Assign Pro
                                </button>
                                <span className="block text-[10px] text-gray-500 font-mono">Unstaffed</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-3 font-mono font-bold text-gold">
                            {formatLKR(b.totalAmountLkr)}
                          </td>
                          <td className="py-4 px-3">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              b.status === 'CONFIRMED' ? 'bg-green-950 text-green-400 border border-green-800' :
                              b.status === 'COMPLETED' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                              b.status === 'CANCELLED' ? 'bg-red-950 text-red-400 border border-red-800' :
                              'bg-yellow-950 text-yellow-400 border border-yellow-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right whitespace-nowrap space-x-1.5">
                            {b.status === 'PENDING_ADMIN_APPROVAL' && (
                              <button
                                onClick={() => handleConfirmBooking(b.bookingId)}
                                className="p-1.5 rounded-lg bg-green-950/60 text-green-400 hover:bg-green-900 border border-green-700/50"
                                title="Confirm Booking"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(b.status === 'CONFIRMED' || b.status === 'PAID') && (
                              <button
                                onClick={() => handleCompleteBooking(b.bookingId)}
                                className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 hover:bg-blue-900 border border-blue-700/50"
                                title="Mark as Completed"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                              <button
                                onClick={() => handleCancelBooking(b.bookingId)}
                                className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-700/50"
                                title="Cancel Booking"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setAssignModalBooking(b);
                                setSelectedPhotographerId(b.photographerId || '');
                                setAssignConflictError('');
                              }}
                              className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 border border-gold/30"
                              title="Assign/Change Photographer"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.bookingId)}
                              className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/40"
                              title="Permanently Delete Booking (Cascade)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {/* ── 2. PAYMENTS TAB ──────────────────────────────────── */}
          {activeTab === 'payments' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Payment Verification & Financial Records
                </h3>
                <p className="text-xs text-gray-400">
                  Monitor online credit/debit card transactions and approve manual bank deposit slips.
                </p>
              </div>

              {payments.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No payment records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
                        <th className="py-3 px-3">Payment ID</th>
                        <th className="py-3 px-3">Booking ID</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Method</th>
                        <th className="py-3 px-3">Transaction Reference</th>
                        <th className="py-3 px-3">Amount Paid (LKR)</th>
                        <th className="py-3 px-3">Verification Status</th>
                        <th className="py-3 px-3 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-gray-300">
                      {payments.map((p) => {
                        const isCard = p.paymentStatus === 'PAID' || (p.transactionRef && p.transactionRef.startsWith('CARD-'));
                        const displayRef = isCard && p.transactionRef?.startsWith('CARD-')
                          ? `•••• •••• •••• ${p.transactionRef.split('-')[1] || '4242'}`
                          : p.transactionRef;

                        return (
                          <tr key={p.paymentId} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-3 font-mono text-gold">#{p.paymentId}</td>
                            <td className="py-4 px-3 font-mono font-semibold">Booking #{p.bookingId}</td>
                            <td className="py-4 px-3 text-white font-medium">{p.clientName}</td>
                            <td className="py-4 px-3">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                isCard
                                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
                                  : 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                              }`}>
                                {isCard ? 'CARD' : 'BANK SLIP'}
                              </span>
                            </td>
                            <td className="py-4 px-3 font-mono font-bold text-white bg-black/30 rounded px-2">
                              {displayRef}
                            </td>
                            <td className="py-4 px-3 font-mono text-gold font-bold">
                              {formatLKR(p.amountPaidLkr)}
                            </td>
                            <td className="py-4 px-3">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                p.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                                p.paymentStatus === 'APPROVED' ? 'bg-green-950 text-green-400 border border-green-800' :
                                p.paymentStatus === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' :
                                'bg-yellow-950 text-yellow-400 border border-yellow-800'
                              }`}>
                                {p.paymentStatus}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-right whitespace-nowrap space-x-2">
                              {p.paymentStatus === 'PENDING_APPROVAL' && (
                                <>
                                  <button
                                    onClick={() => handleApprovePayment(p.paymentId)}
                                    className="px-3 py-1.5 rounded-lg bg-green-950 text-green-400 hover:bg-green-900 border border-green-700/50 font-semibold"
                                  >
                                    Approve Slip
                                  </button>
                                  <button
                                    onClick={() => handleRejectPayment(p.paymentId)}
                                    className="px-3 py-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-700/50 font-semibold"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {p.paymentStatus === 'APPROVED' && (
                                <span className="text-[11px] text-green-400">✓ Verified & PDF Enabled</span>
                              )}
                              {p.paymentStatus === 'PAID' && (
                                <span className="text-[11px] text-emerald-400 font-medium">✓ Authorized via Card</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {/* ── 3. PHOTOGRAPHERS TAB ─────────────────────────────── */}
          {activeTab === 'photographers' && (
            <div className="space-y-8">
              
              {/* Pending Approvals */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-yellow-500/30 space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-serif-title text-xl font-bold text-white">
                    Pending Photographer Applications ({pendingPhotographers.length})
                  </h3>
                </div>

                {pendingPhotographers.length === 0 ? (
                  <p className="text-xs text-gray-400">No pending photographer applications.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
                          <th className="py-3 px-3">Name</th>
                          <th className="py-3 px-3">Email</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-3">Portfolio</th>
                          <th className="py-3 px-3 text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60 text-gray-300">
                        {pendingPhotographers.map((p) => (
                          <tr key={p.userId} className="hover:bg-white/[0.02]">
                            <td className="py-3 px-3 font-semibold text-white">{p.fullName}</td>
                            <td className="py-3 px-3">{p.email}</td>
                            <td className="py-3 px-3">{p.phone || 'N/A'}</td>
                            <td className="py-3 px-3">
                              {p.portfolioUrl ? (
                                <a
                                  href={p.portfolioUrl.startsWith('http') ? p.portfolioUrl : `https://${p.portfolioUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center space-x-1 text-gold hover:underline"
                                >
                                  <span>Inspect Portfolio</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : 'N/A'}
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <button
                                onClick={() => handleApprovePhotographer(p.userId)}
                                className="px-3 py-1.5 rounded-lg bg-green-950 text-green-400 hover:bg-green-900 border border-green-700/50 font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectPhotographer(p.userId)}
                                className="px-3 py-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-700/50 font-semibold"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleDeleteUser(p.userId, p.fullName)}
                                className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/40 inline-flex items-center"
                                title="Delete Photographer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Active Photographers */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-4">
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Active Verified Photographers ({photographers.length})
                </h3>

                {photographers.length === 0 ? (
                  <p className="text-xs text-gray-400">No active photographers.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photographers.map((p) => (
                      <div key={p.userId} className="p-4 rounded-2xl bg-black/40 border border-gray-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-sm">{p.fullName}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-950 text-green-400 border border-green-800">
                              {p.accountStatus}
                            </span>
                            <button
                              onClick={() => handleDeleteUser(p.userId, p.fullName)}
                              className="p-1 text-gray-500 hover:text-red-400"
                              title="Delete Photographer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{p.email}</p>
                        <p className="text-xs text-gray-400">{p.phone || 'No phone recorded'}</p>
                        {p.portfolioUrl && (
                          <a
                            href={p.portfolioUrl.startsWith('http') ? p.portfolioUrl : `https://${p.portfolioUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-gold hover:underline pt-1"
                          >
                            <span>Portfolio Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}


          {/* ── 4. PACKAGES TAB ──────────────────────────────────── */}
          {activeTab === 'packages' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-white">
                    Photography Packages Catalog
                  </h3>
                  <p className="text-xs text-gray-400">Manage rates, descriptions, and active offerings.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPackage(null);
                    setPackageName('');
                    setPackagePrice('');
                    setPackageDesc('');
                    setPackageModal(true);
                  }}
                  className="px-4 py-2 rounded-xl btn-gold text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.packageId}
                    className="p-6 rounded-2xl bg-black/40 border border-gray-800 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-gold">ID #{pkg.packageId}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          pkg.isActive ? 'bg-green-950 text-green-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {pkg.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <h4 className="font-serif-title text-lg font-bold text-white">{pkg.packageName}</h4>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">{pkg.description}</p>
                      <div className="mt-4 text-xl font-bold text-gold font-serif-title">
                        {formatLKR(pkg.priceLkr)}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                      <button
                        onClick={() => handleTogglePackage(pkg.packageId)}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        {pkg.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setEditingPackage(pkg);
                            setPackageName(pkg.packageName);
                            setPackagePrice(pkg.priceLkr);
                            setPackageDesc(pkg.description);
                            setPackageModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gold"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.packageId)}
                          className="p-2 text-gray-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ── 5. PHOTO MODERATION TAB ──────────────────────────── */}
          {activeTab === 'photos' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Event Photos & Public Portfolio Moderation
                </h3>
                <p className="text-xs text-gray-400">
                  Select which photos appear on the public homepage portfolio showcase.
                </p>
              </div>

              {photos.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No photos uploaded by photographers yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.photoId}
                      className="group relative rounded-2xl overflow-hidden border border-gray-800 aspect-square bg-black"
                    >
                      <img
                        src={getImageUrl(photo.photoUrl)}
                        alt="Uploaded photo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        {photo.isPublishedPortfolio && (
                          <span className="px-2 py-0.5 rounded-full bg-gold text-black text-[10px] font-bold shadow">
                            Public
                          </span>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-xs">
                        <div>
                          <p className="text-gold font-mono text-[10px]">Photo #{photo.photoId}</p>
                          <p className="text-white text-[11px]">Booking #{photo.bookingId}</p>
                          <p className="text-gray-400 text-[10px]">By {photo.photographerName}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                          <button
                            onClick={() => handleTogglePublish(photo.photoId)}
                            className="text-[11px] text-gold hover:underline font-semibold"
                          >
                            {photo.isPublishedPortfolio ? 'Unpublish' : 'Publish to Portfolio'}
                          </button>
                          <div className="flex items-center space-x-1.5">
                            <a
                              href={getImageUrl(photo.photoUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-gray-300 hover:text-gold"
                              title="View Full Resolution"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => downloadImage(photo.photoUrl, `Pixora-Photo-${photo.photoId}.jpg`)}
                              className="p-1 text-gray-300 hover:text-gold"
                              title="Download High-Res"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.photoId)}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── 6. REVIEWS TAB ──────────────────────────────────── */}
          {activeTab === 'reviews' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-white">
                    Client Reviews & Testimonials
                  </h3>
                  <p className="text-xs text-gray-400">Moderation and permanent removal of verified event feedback.</p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No reviews submitted yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Booking</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Photographer</th>
                        <th className="py-3 px-3">Rating</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Comment</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-gray-300">
                      {reviews.map((r) => (
                        <tr key={r.reviewId} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-3 font-mono text-gold font-bold">#{r.reviewId}</td>
                          <td className="py-3 px-3 font-mono text-gray-400">Booking #{r.bookingId}</td>
                          <td className="py-3 px-3 font-medium text-white">{r.clientName}</td>
                          <td className="py-3 px-3 text-gray-300">{r.photographerName}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center text-gold font-mono font-bold">
                              ★ {r.starRating}.0
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </td>
                          <td className="py-3 px-3 max-w-sm text-gray-300 italic truncate" title={r.reviewComment}>
                            "{r.reviewComment}"
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteReview(r.reviewId)}
                              className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/40"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── 7. CLIENTS MANAGEMENT TAB ───────────────────────── */}
          {activeTab === 'clients' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-white">
                    Client Accounts Management
                  </h3>
                  <p className="text-xs text-gray-400">
                    Registered client accounts. Deleting a client safely cascades to remove associated bookings, payments, and reviews.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {clients.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No clients registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
                        <th className="py-3 px-3">User ID</th>
                        <th className="py-3 px-3">Full Name</th>
                        <th className="py-3 px-3">Email Address</th>
                        <th className="py-3 px-3">Phone Number</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-gray-300">
                      {clients
                        .filter((c) => {
                          if (!clientSearch) return true;
                          const q = clientSearch.toLowerCase();
                          return (
                            c.fullName?.toLowerCase().includes(q) ||
                            c.email?.toLowerCase().includes(q) ||
                            c.phoneNumber?.toLowerCase().includes(q) ||
                            String(c.userId).includes(q)
                          );
                        })
                        .map((c) => (
                          <tr key={c.userId} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-3 font-mono text-gold font-bold">#{c.userId}</td>
                            <td className="py-4 px-3 font-medium text-white">
                              <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-[11px] font-bold text-gold">
                                  {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <span>{c.fullName}</span>
                              </div>
                            </td>
                            <td className="py-4 px-3 font-mono text-gray-300">{c.email}</td>
                            <td className="py-4 px-3 font-mono text-gray-300">
                              {c.phoneNumber || <span className="text-gray-600 italic">Not provided</span>}
                            </td>
                            <td className="py-4 px-3">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                                {c.role || 'CLIENT'}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-right">
                              <button
                                onClick={() => handleDeleteUser(c.userId, c.fullName)}
                                className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/40 inline-flex items-center space-x-1"
                                title="Permanently Delete Client (Cascade)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── 8. PROMO CODES TAB ──────────────────────────────── */}
          {activeTab === 'promos' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-white flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-gold" />
                    <span>Promo Codes Management</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Create discount voucher codes for client birthday packages with custom percentage limits and expiry dates.
                  </p>
                </div>
                <button
                  onClick={() => setPromoModal(true)}
                  className="px-4 py-2.5 rounded-xl btn-gold text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              {promos.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No promo codes registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
                        <th className="py-3 px-3">Code</th>
                        <th className="py-3 px-3">Discount</th>
                        <th className="py-3 px-3">Max Cap</th>
                        <th className="py-3 px-3">Min Order</th>
                        <th className="py-3 px-3">Expiry</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 text-gray-300">
                      {promos.map((p) => (
                        <tr key={p.promoId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-3 font-mono font-bold text-gold text-sm tracking-wider">{p.code}</td>
                          <td className="py-4 px-3 font-bold text-white">{p.discountPercent}% OFF</td>
                          <td className="py-4 px-3 font-mono">{p.maxDiscountLkr ? formatLKR(p.maxDiscountLkr) : 'No Limit'}</td>
                          <td className="py-4 px-3 font-mono">{p.minBookingAmountLkr ? formatLKR(p.minBookingAmountLkr) : 'None'}</td>
                          <td className="py-4 px-3 font-mono text-gray-400">{p.expiryDate || 'Never'}</td>
                          <td className="py-4 px-3">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              p.isActive ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-red-950 text-red-400 border border-red-800'
                            }`}>
                              {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right space-x-2">
                            <button
                              onClick={() => handleTogglePromo(p.promoId)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                p.isActive
                                  ? 'bg-yellow-950/40 text-yellow-400 border-yellow-700/50 hover:bg-yellow-900/50'
                                  : 'bg-green-950/40 text-green-400 border-green-700/50 hover:bg-green-900/50'
                              }`}
                            >
                              {p.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeletePromo(p.promoId)}
                              className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-800/40 inline-flex items-center"
                              title="Delete Promo Code"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {/* ── 10. ANALYTICS & INSIGHTS TAB ─────────────────────── */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Analytics Header Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-gold/40 bg-gold/5 space-y-2">
                  <div className="flex items-center justify-between text-gold">
                    <span className="text-xs uppercase font-mono tracking-wider">Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-gold" />
                  </div>
                  <p className="font-serif-title text-3xl font-bold text-gold">
                    {formatLKR(totalRevenue)}
                  </p>
                  <span className="text-[11px] text-gray-400">From {payments.filter(p => p.paymentStatus === 'APPROVED' || p.paymentStatus === 'PAID').length} verified transactions</span>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs uppercase font-mono tracking-wider">Avg. Booking Value</span>
                    <TrendingUp className="w-4 h-4 text-gold" />
                  </div>
                  <p className="font-serif-title text-3xl font-bold text-white">
                    {formatLKR(bookings.length > 0 ? (bookings.reduce((sum, b) => sum + (Number(b.totalAmountLkr) || 0), 0) / bookings.length) : 0)}
                  </p>
                  <span className="text-[11px] text-gray-400">Across all bookings</span>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs uppercase font-mono tracking-wider">Completion Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="font-serif-title text-3xl font-bold text-white">
                    {bookings.length > 0 ? `${Math.round((bookings.filter(b => b.status === 'COMPLETED').length / bookings.length) * 100)}%` : '0%'}
                  </p>
                  <span className="text-[11px] text-gray-400">{bookings.filter(b => b.status === 'COMPLETED').length} celebrations fulfilled</span>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs uppercase font-mono tracking-wider">Client Base</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="font-serif-title text-3xl font-bold text-white">{clients.length}</p>
                  <span className="text-[11px] text-gray-400">Active registered users</span>
                </div>
              </div>

              {/* Package Popularity Breakdown & Status Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Packages */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5">
                  <h4 className="font-serif-title text-lg font-bold text-white flex items-center space-x-2">
                    <PackageIcon className="w-4 h-4 text-gold" />
                    <span>Popular Packages by Demand</span>
                  </h4>
                  <div className="space-y-4">
                    {packages.map((pkg) => {
                      const count = bookings.filter(b => b.packageId === pkg.packageId).length;
                      const percent = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
                      return (
                        <div key={pkg.packageId} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-white">{pkg.packageName}</span>
                            <span className="text-gold font-mono">{count} bookings ({percent}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Booking Statuses Breakdown */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-5">
                  <h4 className="font-serif-title text-lg font-bold text-white flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-gold" />
                    <span>Booking Lifecycle Statuses</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Pending Approval', count: bookings.filter(b => b.status === 'PENDING_ADMIN_APPROVAL').length, color: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-800/40' },
                      { label: 'Confirmed', count: bookings.filter(b => b.status === 'CONFIRMED').length, color: 'text-green-400', bg: 'bg-green-950/40 border-green-800/40' },
                      { label: 'Paid in Full', count: bookings.filter(b => b.status === 'PAID').length, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' },
                      { label: 'Completed', count: bookings.filter(b => b.status === 'COMPLETED').length, color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-800/40' },
                      { label: 'Cancelled', count: bookings.filter(b => b.status === 'CANCELLED').length, color: 'text-red-400', bg: 'bg-red-950/40 border-red-800/40' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${stat.bg} space-y-1`}>
                        <span className="text-[11px] text-gray-400 block">{stat.label}</span>
                        <p className={`font-serif-title text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ── MODAL: Assign Photographer ───────────────────────────── */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-serif-title text-lg font-bold text-white">
                Assign Photographer
              </h3>
              <button
                onClick={() => setAssignModalBooking(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-gray-800 text-xs text-gray-300 space-y-1">
              <p><span className="text-gray-500">Booking:</span> #{assignModalBooking.bookingId} - {assignModalBooking.packageName}</p>
              <p><span className="text-gray-500">Date:</span> {assignModalBooking.eventDate} at {assignModalBooking.eventTime}</p>
              <p><span className="text-gray-500">Venue:</span> {assignModalBooking.venueAddress}</p>
            </div>

            {assignConflictError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{assignConflictError}</span>
              </div>
            )}

            <form onSubmit={handleAssignPhotographer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Select Active Photographer *
                </label>
                <select
                  value={selectedPhotographerId}
                  onChange={(e) => setSelectedPhotographerId(e.target.value)}
                  className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                  required
                >
                  <option value="">-- Choose Photographer --</option>
                  {photographers.map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {p.fullName} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold"
                >
                  Assign to Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ── MODAL: Create / Edit Package ─────────────────────────── */}
      {packageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-serif-title text-lg font-bold text-white">
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </h3>
              <button
                onClick={() => setPackageModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Package Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Milestone Celebration"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Price (LKR) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 18000"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description *</label>
                <textarea
                  rows={4}
                  placeholder="Detailed inclusions, hours of coverage, photo count..."
                  value={packageDesc}
                  onChange={(e) => setPackageDesc(e.target.value)}
                  className="w-full bg-[#151515] border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPackageModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Create Promo Code ──────────────────────────────── */}
      {promoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-serif-title text-lg font-bold text-white flex items-center space-x-2">
                <Tag className="w-5 h-5 text-gold" />
                <span>Create Promo Code</span>
              </h3>
              <button onClick={() => setPromoModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Promo Code (e.g. LUXURY20) *</label>
                <input
                  type="text"
                  placeholder="e.g. CELEBRATE15"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="15"
                    value={promoForm.discountPercent}
                    onChange={(e) => setPromoForm(f => ({ ...f, discountPercent: e.target.value }))}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Max Cap (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={promoForm.maxDiscountLkr}
                    onChange={(e) => setPromoForm(f => ({ ...f, maxDiscountLkr: e.target.value }))}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Min Order (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 15000"
                    value={promoForm.minBookingAmountLkr}
                    onChange={(e) => setPromoForm(f => ({ ...f, minBookingAmountLkr: e.target.value }))}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={promoForm.expiryDate}
                    onChange={(e) => setPromoForm(f => ({ ...f, expiryDate: e.target.value }))}
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPromoModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold"
                >
                  Create Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;
