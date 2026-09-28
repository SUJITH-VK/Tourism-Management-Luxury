import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Compass, 
  Search, 
  Heart, 
  Bell, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  Briefcase, 
  LogOut, 
  MapPin,
  Calendar,
  Layers,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    role,
    switchUser,
    currentView,
    setCurrentView,
    wishlist,
    unreadNotificationsCount,
    setGlobalSearchOpen,
    setNotificationsOpen,
    setAiAssistantOpen,
    setAuthModalOpen,
  } = useApp();

  const { isInstalled, isIOS, hasPrompt, triggerInstall } = usePWAInstall();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tours', label: 'Explore Tours' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'my-bookings', label: 'My Bookings', badge: role === 'customer' ? undefined : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b12]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="navbar-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/35 transition-all">
            <div className="w-full h-full bg-[#090e17] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-bold tracking-wider text-white">AURA</span>
              <span className="font-serif italic text-emerald-400 text-xl font-semibold">Voyage</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-medium -mt-1">
              Luxury Tourism Suite
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => {
                  setCurrentView(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all rounded-lg ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 shadow-sm shadow-emerald-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}

          {/* AI Travel Assistant trigger button */}
          <button
            id="nav-btn-ai-assistant"
            onClick={() => setAiAssistantOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg text-emerald-300 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all ml-1 group"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform animate-pulse" />
            <span>AI Concierge</span>
          </button>

          {/* Admin Suite portal link if admin or toggle */}
          {role === 'admin' ? (
            <button
              id="nav-btn-admin-portal"
              onClick={() => {
                setCurrentView('admin-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md uppercase tracking-wider transition-all ${
                currentView === 'admin-dashboard'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/80 text-amber-400 border border-slate-700 hover:border-amber-500/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Suite</span>
            </button>
          ) : null}

          {/* PWA Install Button (desktop/tablet) */}
          {!isInstalled && (
            <button
              id="nav-btn-pwa-install"
              onClick={() => {
                if (hasPrompt) {
                  triggerInstall();
                } else {
                  // Scroll or open install modal if available
                  const banner = document.getElementById('pwa-install-banner');
                  if (banner) banner.scrollIntoView({ behavior: 'smooth' });
                  else triggerInstall();
                }
              }}
              title="Install AuraVoyage PWA on your device"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 shadow-sm transition-all ml-1 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Install App</span>
            </button>
          )}
        </nav>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Role Switcher Pill - 1-Click test Customer vs Admin */}
          <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 rounded-full p-0.5 text-xs">
            <button
              id="role-switch-customer"
              onClick={() => switchUser('customer')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                role === 'customer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Customer
            </button>
            <button
              id="role-switch-admin"
              onClick={() => switchUser('admin')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                role === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin Mode
            </button>
          </div>

          {/* Global Search trigger */}
          <button
            id="nav-btn-search"
            onClick={() => setGlobalSearchOpen(true)}
            aria-label="Search destinations, tours and bookings"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 transition-all"
            title="Search destinations & tours (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Icon */}
          <button
            id="nav-btn-wishlist"
            onClick={() => {
              setCurrentView('wishlist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="View Saved Tours"
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 transition-all"
            title="My Saved Trips"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-400 fill-rose-400/30' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Notifications Center */}
          <button
            id="nav-btn-notifications"
            onClick={() => setNotificationsOpen(true)}
            aria-label="View Notifications"
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              id="nav-profile-menu-button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800/80 transition-all"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
              />
              <div className="hidden sm:block text-left pr-1">
                <p className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </p>
                <span className={`text-[9px] uppercase font-bold tracking-wider ${
                  role === 'admin' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {role === 'admin' ? 'Admin' : currentUser.membershipTier}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div 
                id="profile-dropdown-menu"
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e1626] border border-slate-800/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="px-3 py-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-400"
                    />
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Tier: <strong className="text-emerald-400">{currentUser.membershipTier}</strong></span>
                    <span className="text-slate-500">Since {currentUser.memberSince}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('my-bookings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>My Bookings & Invoices</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('wishlist');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                  >
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span>Saved Wishlist ({wishlist.length})</span>
                  </button>

                  <div className="my-1 border-t border-slate-800/80" />

                  {/* Switch Role Inside Dropdown */}
                  <button
                    onClick={() => {
                      switchUser(role === 'customer' ? 'admin' : 'customer');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Switch to {role === 'customer' ? 'Admin Portal' : 'Customer View'}</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Toggle
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign In to Another Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/50 border border-slate-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between py-2 border-b border-slate-800 mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Role Mode</span>
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => { switchUser('customer'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-md font-medium ${role === 'customer' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Customer
              </button>
              <button
                onClick={() => { switchUser('admin'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-md font-medium ${role === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              >
                Admin Suite
              </button>
            </div>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                currentView === link.id
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => {
              setAiAssistantOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Travel Assistant</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
              Online
            </span>
          </button>

          {role === 'admin' && (
            <button
              onClick={() => {
                setCurrentView('admin-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-amber-950/40 text-amber-300 border border-amber-500/30 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Management Hub</span>
            </button>
          )}

          {/* Mobile Install App Button */}
          {!isInstalled && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (hasPrompt) {
                    triggerInstall();
                  } else {
                    const banner = document.getElementById('pwa-banner-install-action');
                    if (banner) banner.click();
                    else triggerInstall();
                  }
                }}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 min-h-[44px] active:scale-[0.98] transition-transform"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-white" />
                  <span>Install AuraVoyage (PWA)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200">
                  {isIOS ? 'iOS Safari' : 'Android / Web'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
