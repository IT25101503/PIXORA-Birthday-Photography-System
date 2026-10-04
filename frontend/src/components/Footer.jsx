import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-t from-[#04030a] to-[#070709] border-t border-transparent text-gray-400 pt-14 pb-8 overflow-hidden">
      {/* Gold top border shimmer */}
      <div className="divider-gold absolute top-0 left-0 right-0" />
      {/* Ambient glow */}
      <div className="glow-orb-gold w-[500px] h-[200px] bottom-0 left-1/2 -translate-x-1/2 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10">
                <Camera className="w-4 h-4 text-gold" />
              </div>
              <span className="font-serif-title text-xl font-bold tracking-widest text-gold-gradient">
                PIXORA
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sri Lanka's dedicated birthday event photography management platform. We connect you with verified master photographers to capture timeless milestone memories.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gold/80 pt-1">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>100% Verified Photographers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-semibold text-gray-200 tracking-wider">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/packages" className="hover:text-gold transition-colors">
                  Birthday Packages
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-gold transition-colors">
                  Client Portfolios
                </Link>
              </li>
              <li>
                <Link to="/photographers" className="hover:text-gold transition-colors">
                  Our Photographers
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gold transition-colors">
                  Cart & Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-semibold text-gray-200 tracking-wider">
              COMMUNITY
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-gold transition-colors">
                  Client Registration
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gold transition-colors">
                  Join as Photographer
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold transition-colors">
                  Admin & Staff Portal
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Fast 48h Photo Delivery Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-sm font-semibold text-gray-200 tracking-wider">
              CONTACT & INQUIRIES
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>admin@pixora.lk</span>
              </p>
              <p className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>+94 11 234 5678</span>
              </p>
              <p className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>Colombo 03, Sri Lanka</span>
              </p>
            </div>
            <div className="pt-2 text-[11px] text-gray-500 bg-[#111] p-2.5 rounded border border-gray-800">
              <span className="font-semibold text-gray-300">Bank Transfer Account:</span><br />
              Commercial Bank PLC · Pixora Events Ltd<br />
              A/C: 1000 8923 4451 (Colombo Branch)
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Pixora Birthday Event Photography. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-gold inline" />
            <span>for magical celebrations</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
