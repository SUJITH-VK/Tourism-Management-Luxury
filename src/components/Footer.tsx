import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setAiAssistantOpen } = useApp();

  return (
    <footer className="bg-[#05080e] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[1.5px]">
                <div className="w-full h-full bg-[#090e17] rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl font-bold tracking-wider text-white">AURA</span>
                  <span className="font-serif italic text-emerald-400 text-xl font-semibold">Voyage</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium -mt-0.5">
                  Luxury Tourism Management System
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India's premier AI-curated travel enterprise. Hand-inspected heritage estates, private AC chauffeur fleets, transparent GST invoicing, and 24x7 concierge assistance.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Ministry of Tourism Lic. #TO-2026-IND • GST Registered</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Expeditions</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setCurrentView('tours'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  All Tour Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Hill Stations & Estates
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('my-bookings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Booking Vouchers & Invoices
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('wishlist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* AI Concierge & Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Intelligence</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setAiAssistantOpen(true)}
                  className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Aura AI Travel Assistant</span>
                </button>
              </li>
              <li><span className="text-slate-400">Personalized Itinerary Engine</span></li>
              <li><span className="text-slate-400">Fleet Dispatch Telemetry</span></li>
              <li><span className="text-slate-400">Corporate & Group Charters</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Concierge Desk</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Prestige Trade Tower, Palace Road, Bengaluru 560001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 80 4099 8800 (24x7)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>concierge@auravoyage.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 AuraVoyage Luxury Tourism Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Carriage</span>
            <span>GST Invoice Guidelines</span>
            <span>Safety Protocols</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
