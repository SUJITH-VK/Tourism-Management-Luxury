import React from 'react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Briefcase, 
  ShieldCheck, 
  Heart,
  Download,
  User
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, role, wishlist, setAiAssistantOpen } = useApp();
  const { isInstalled, hasPrompt, triggerInstall } = usePWAInstall();

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#070b12]/95 backdrop-blur-xl border-t border-slate-800/90 pb-[calc(env(safe-area-inset-bottom,0px)+0.25rem)] pt-1 px-2 select-none shadow-2xl shadow-black"
    >
      <div className="grid grid-cols-5 items-center justify-items-center h-14">
        
        {/* 1. Home */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors ${
            currentView === 'home'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'text-emerald-400 scale-110' : ''} transition-transform`} />
          <span>Home</span>
        </button>

        {/* 2. Explore Tours */}
        <button
          onClick={() => {
            setCurrentView('tours');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors ${
            currentView === 'tours' || currentView === 'tour-detail' || currentView === 'destinations'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className={`w-5 h-5 mb-0.5 ${currentView === 'tours' ? 'text-emerald-400 scale-110' : ''} transition-transform`} />
          <span>Tours</span>
        </button>

        {/* 3. AI Concierge (Center Promoted Button) */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex flex-col items-center justify-center -mt-3.5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[1.5px] shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#0a1220] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 mt-1 tracking-tight">AI Agent</span>
        </button>

        {/* 4. Bookings */}
        <button
          onClick={() => {
            setCurrentView('my-bookings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors ${
            currentView === 'my-bookings'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className={`w-5 h-5 mb-0.5 ${currentView === 'my-bookings' ? 'text-emerald-400 scale-110' : ''} transition-transform`} />
          <span>Bookings</span>
        </button>

        {/* 5. Admin Hub or Profile/Wishlist */}
        {role === 'admin' ? (
          <button
            onClick={() => {
              setCurrentView('admin-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors ${
              currentView === 'admin-dashboard'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mb-0.5 ${currentView === 'admin-dashboard' ? 'text-amber-400 scale-110' : ''} transition-transform`} />
            <span>Admin</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentView('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors relative ${
              currentView === 'profile'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className={`w-5 h-5 mb-0.5 ${currentView === 'profile' ? 'text-emerald-400 scale-110' : ''} transition-transform`} />
            <span>Profile</span>
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        )}

      </div>
    </nav>
  );
};
