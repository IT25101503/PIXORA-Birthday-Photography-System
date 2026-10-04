import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { Check, Sparkles, Award, ArrowRight, Clock, Image, Shield } from 'lucide-react';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectPackage } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/api/public/packages');
        setPackages(res.data);
      } catch (err) {
        console.error('Error fetching packages', err);
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
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBook = (pkg) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Birthday Collections</span>
        </div>
        <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-white">
          Choose Your Birthday Package
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          From intimate cake smashes to grand celebrations, select a photography collection crafted to preserve every moment. All packages include high-resolution files, verified photographers, and official receipts.
        </p>
      </div>

      {/* Package Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => {
            const isFeatured = idx === 1;
            return (
              <div
                key={pkg.packageId}
                className={`glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-300 ${
                  isFeatured
                    ? 'border-gold shadow-[0_0_35px_rgba(212,175,55,0.2)] bg-gradient-to-b from-[#18160f] to-[#0f0f0f]'
                    : 'hover:border-gold/40'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-black text-xs font-bold uppercase tracking-wider shadow-lg">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase font-mono tracking-widest text-gold">
                      Tier 0{idx + 1}
                    </span>
                    <Award className="w-5 h-5 text-gold/70" />
                  </div>

                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white mb-3">
                    {pkg.packageName}
                  </h2>

                  <p className="text-xs text-gray-400 leading-relaxed min-h-[50px] mb-6">
                    {pkg.description}
                  </p>

                  <div className="p-5 rounded-2xl bg-black/60 border border-gray-800 mb-8">
                    <span className="text-xs text-gray-400 block mb-1">Fixed Package Price</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="font-serif-title text-3xl sm:text-4xl font-bold text-gold">
                        {formatLKR(pkg.priceLkr)}
                      </span>
                      <span className="text-xs text-gray-500">/ celebration</span>
                    </div>
                  </div>

                  <h4 className="text-xs uppercase font-semibold tracking-wider text-gray-300 mb-4">
                    Package Inclusions:
                  </h4>
                  <ul className="space-y-3.5 text-xs text-gray-300 mb-8">
                    <li className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{idx === 0 ? '2 Hours' : idx === 1 ? '4 Hours' : 'Full Day'} Event Coverage</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{idx === 0 ? '50+' : idx === 1 ? '100+' : '200+'} Retouched High-Res Photos</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{idx === 0 ? 'Digital Download Gallery' : idx === 1 ? 'Standard Hardcover Printed Album' : 'Custom Handcrafted Leather Album'}</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{idx === 2 ? 'Large Premium Canvas Print (16x24)' : 'Digital Shareable Web Gallery'}</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{idx === 2 ? 'Priority 48-Hour Gallery Turnaround' : 'Standard 4-day Delivery'}</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>Instant Official PDF Receipt & Payment Verification</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleBook(pkg)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
                    isFeatured
                      ? 'btn-gold shadow-lg shadow-gold/20'
                      : 'border border-gold/50 text-gold hover:bg-gold/10'
                  }`}
                >
                  <span>Book This Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Table */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 overflow-x-auto">
        <h3 className="font-serif-title text-2xl font-bold text-white mb-6">
          Detailed Feature Comparison
        </h3>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gold uppercase tracking-wider font-mono">
              <th className="py-3 px-4">Feature</th>
              <th className="py-3 px-4">Kids Basic</th>
              <th className="py-3 px-4">Premium</th>
              <th className="py-3 px-4">Deluxe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Event Duration</td>
              <td className="py-3.5 px-4">Up to 2 Hours</td>
              <td className="py-3.5 px-4">Up to 4 Hours</td>
              <td className="py-3.5 px-4">Full Day (8 Hours)</td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Edited Digital Photos</td>
              <td className="py-3.5 px-4">50 Photos</td>
              <td className="py-3.5 px-4">100 Photos</td>
              <td className="py-3.5 px-4">200+ Photos</td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Printed Photo Album</td>
              <td className="py-3.5 px-4 text-gray-500">—</td>
              <td className="py-3.5 px-4">Standard Hardcover</td>
              <td className="py-3.5 px-4 text-gold">Premium Leather Album</td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Wall Canvas Print</td>
              <td className="py-3.5 px-4 text-gray-500">—</td>
              <td className="py-3.5 px-4 text-gray-500">—</td>
              <td className="py-3.5 px-4 text-gold">Included (16x24)</td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Delivery Speed</td>
              <td className="py-3.5 px-4">5 Days</td>
              <td className="py-3.5 px-4">3 Days</td>
              <td className="py-3.5 px-4 text-gold">Priority 48 Hours</td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Official PDF Invoice</td>
              <td className="py-3.5 px-4 text-green-400">Yes</td>
              <td className="py-3.5 px-4 text-green-400">Yes</td>
              <td className="py-3.5 px-4 text-green-400">Yes</td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-semibold text-white">Price (LKR)</td>
              <td className="py-3.5 px-4 font-bold text-gold">Rs. 10,000</td>
              <td className="py-3.5 px-4 font-bold text-gold">Rs. 15,000</td>
              <td className="py-3.5 px-4 font-bold text-gold">Rs. 25,000</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Packages;
