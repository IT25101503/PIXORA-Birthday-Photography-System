import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { 
  Camera, 
  Calendar, 
  CheckCircle2, 
  Award, 
  FileText, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const { selectPackage } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/api/public/packages');
        setPackages(res.data);
      } catch (err) {
        console.error('Could not fetch packages from API, using default showcase', err);
        setPackages([
          {
            packageId: 1,
            packageName: 'Kids Birthday Basic',
            priceLkr: 10000.0,
            description: 'Perfect starter package for intimate kids birthday celebrations. Includes 2-hour coverage, 50 edited digital photos, and private online gallery access.'
          },
          {
            packageId: 2,
            packageName: 'Premium Birthday',
            priceLkr: 15000.0,
            description: 'Comprehensive birthday photography with 4-hour coverage, 100 edited digital photos, printed photo album, and private online gallery access.'
          },
          {
            packageId: 3,
            packageName: 'Deluxe Birthday',
            priceLkr: 25000.0,
            description: 'Our finest birthday experience with full-day coverage, 200+ edited digital photos, premium leather photo album, large canvas print, and priority 48-hour delivery.'
          }
        ]);
      } finally {
        setLoadingPackages(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/public/reviews');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const sorted = [...res.data].sort((a, b) => {
            if (b.starRating !== a.starRating) return b.starRating - a.starRating;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          setReviews(sorted);
        }
      } catch (err) {
        console.error('Could not fetch reviews from API', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchPackages();
    fetchReviews();
  }, []);

  const handleSelectPackage = (pkg) => {
    selectPackage(pkg);
    navigate('/cart');
  };

  const formatLKR = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount).replace('LKR', 'Rs.');
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-28 overflow-hidden text-center">
        {/* Layered cinematic glows */}
        <div className="glow-orb-gold w-[700px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70" />
        <div className="glow-orb-purple w-[500px] h-[300px] top-0 left-0 opacity-50" />
        <div className="glow-orb-gold w-[300px] h-[300px] bottom-0 right-0 opacity-30" />
        {/* Horizontal rule flair */}
        <div className="divider-gold absolute bottom-0 left-0 right-0" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold/35 bg-gradient-to-r from-gold/10 to-gold/5 text-gold text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>Sri Lanka's Premier Birthday Photography Platform</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] mb-6">
            Capturing Every Smile &{' '}
            <br />
            <span className="text-shimmer">Birthday Milestone</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Book top-rated, verified birthday event photographers in minutes. Transparent LKR pricing, official PDF receipts, and exquisite high-resolution digital galleries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/packages"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl btn-gold flex items-center justify-center space-x-2 text-sm font-bold shadow-xl shadow-gold/25"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/portfolio"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gold/35 text-gold hover:bg-gold/10 hover:border-gold/60 flex items-center justify-center space-x-2 text-sm font-semibold transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>View Gallery</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-gray-800/60">
            {[
              { value: '500+', label: 'Birthdays Captured' },
              { value: '100%', label: 'Verified Pros' },
              { value: '48 Hrs', label: 'Photo Delivery' },
              { value: '5.0 ★', label: 'Client Rating' },
            ].map((m) => (
              <div key={m.label}>
                <p className="font-serif-title text-2xl sm:text-3xl font-bold text-gold-gradient">{m.value}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── PACKAGES SHOWCASE ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white mb-3">
            Curated Birthday Packages
          </h2>
          <p className="text-sm text-gray-400">
            Transparent pricing with no hidden charges. Select the package that fits your celebration and reserve your date instantly.
          </p>
        </div>

        {loadingPackages ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => {
              const isPopular = idx === 1;
              return (
                <div
                  key={pkg.packageId}
                  className={`glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between relative ${
                    isPopular ? 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-gold/[0.03]' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-black text-[11px] font-bold uppercase tracking-wider shadow">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase font-mono tracking-widest text-gold">
                        Package #{pkg.packageId}
                      </span>
                      <Award className="w-5 h-5 text-gold/60" />
                    </div>

                    <h3 className="font-serif-title text-2xl font-bold text-white mb-2">
                      {pkg.packageName}
                    </h3>
                    
                    <p className="text-xs text-gray-400 leading-relaxed mb-6 min-h-[50px]">
                      {pkg.description}
                    </p>

                    <div className="p-4 rounded-xl bg-black/40 border border-gray-800 mb-6">
                      <span className="text-xs text-gray-400 block mb-1">Starting from</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gold font-serif-title">
                          {formatLKR(pkg.priceLkr)}
                        </span>
                        <span className="text-xs text-gray-400">/ event</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-xs text-gray-300 mb-8">
                      <li className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span>High-Resolution Digital Edited Photos</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span>Private Online Client Gallery</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span>Instant Official PDF Receipt & Invoice</span>
                      </li>
                      <li className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span>Dedicated Event Coverage Support</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
                      isPopular
                        ? 'btn-gold shadow-lg shadow-gold/20'
                        : 'border border-gold/50 text-gold hover:bg-gold/10'
                    }`}
                  >
                    <span>Select & Book Date</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>


      {/* ── WHY PIXORA ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-gold/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white mb-3">
              Why Families Choose Pixora
            </h2>
            <p className="text-sm text-gray-400">
              Designed from the ground up for seamless birthday celebrations, transparency, and lifelong memories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-black/40 border border-gray-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-base font-bold text-white">Verified Photographers</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every photographer on Pixora is vetted for portfolio excellence, birthday experience, and punctuality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-gray-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-base font-bold text-white">Official PDF Receipts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Automatic PDFBox-generated invoices with booking IDs, breakdown in LKR, and verified payment stamps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-gray-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-base font-bold text-white">Rapid 48h Turnaround</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive sneak peek images quickly and access the complete edited gallery in high resolution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-gray-800/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-base font-bold text-white">Genuine Reviews</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Only verified clients who completed a booking can submit star ratings and feedback for photographers.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── CLIENT TESTIMONIALS ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white mb-3">
          Happy Birthday Celebrations
        </h2>
        <p className="text-sm text-gray-400 mb-12">
          Read what parents and clients say about their experience with Pixora.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {(reviews.length > 0 ? reviews.slice(0, 6) : [
            {
              reviewId: 'f1',
              clientName: 'Kavindi Fernando',
              starRating: 5,
              reviewComment: "Booking our daughter's 1st birthday through Pixora was so easy. The photographer arrived early, was so gentle with the baby, and captured breathtaking candid shots!",
              photographerName: 'Pixora Studio Team'
            },
            {
              reviewId: 'f2',
              clientName: 'Rohan Perera',
              starRating: 5,
              reviewComment: 'The bank payment process and getting an immediate PDF receipt gave us complete peace of mind. The photos were delivered in 2 days as promised.',
              photographerName: 'Pixora Studio Team'
            },
            {
              reviewId: 'f3',
              clientName: 'Dilrukshi Silva',
              starRating: 5,
              reviewComment: 'Superb quality album and lovely digital gallery that our family in the UK could open and download easily. Highly recommend Pixora!',
              photographerName: 'Pixora Studio Team'
            }
          ]).map((r, idx) => (
            <div
              key={r.reviewId || idx}
              className="glass-card rounded-2xl p-6 border border-gray-800 hover:border-gold/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (r.starRating || 5) ? 'fill-gold text-gold' : 'text-gray-700'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-mono font-bold text-gold">
                    {r.starRating}.0
                  </span>
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{r.reviewComment}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800/80 text-xs">
                <p className="font-semibold text-white">{r.clientName || 'Verified Parent'}</p>
                <p className="text-[11px] text-gold font-medium">
                  {r.photographerName ? `Photographer: ${r.photographerName}` : 'Pixora Birthday Celebration'}
                </p>
                {r.createdAt && (
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ── CALL TO ACTION ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-[#18150c] via-[#111] to-[#18150c] border border-gold/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            Ready to Capture Your Next Celebration?
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Reserve your preferred date today. Choose your package, select your photographer, and create memories that last forever.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/packages"
              className="px-8 py-3.5 rounded-xl btn-gold text-sm font-semibold shadow-xl shadow-gold/20"
            >
              Choose Your Package
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gold/40 text-sm font-medium transition-colors"
            >
              Join as Photographer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
