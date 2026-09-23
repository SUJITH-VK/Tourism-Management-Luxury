import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Users, 
  Heart, 
  ChevronRight,
  Coffee,
  Sun,
  Award,
  Luggage,
  PhoneCall
} from 'lucide-react';
import { TourPackage } from '../types';

export const HomeView: React.FC = () => {
  const {
    tours,
    destinations,
    viewTourDetails,
    viewDestinationDetails,
    openBookingModal,
    setCurrentView,
    setFilterState,
    setAiAssistantOpen,
    isWishlisted,
    toggleWishlist,
  } = useApp();

  // Search widget local state
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetLimit, setBudgetLimit] = useState<number>(50000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterState((prev) => ({
      ...prev,
      destination: selectedDestination,
      category: selectedCategory,
      priceRange: budgetLimit,
    }));
    setCurrentView('tours');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredTours = (tours || []).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[40px] border-b border-slate-800">
        
        {/* Cinematic Backdrop Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=85"
            alt="Misty Mountain Tea Plantation"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[12000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/80 to-[#070b12]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070b12]/60 to-[#070b12]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center pt-8 pb-16 space-y-8">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-md shadow-lg shadow-emerald-900/30 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-200 tracking-wide">
              India's Premier AI-Curated Tourism Experience
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-amber-300">4.96 ★ Rated</span>
          </div>

          {/* Luxury Typography Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.1]">
              Unveil Serenity Across <br className="hidden sm:inline" />
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                Bespoke Hill Stations
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
              Tailored itineraries, verified heritage tea estates, private chauffeured transfers, and instantaneous AI guidance for the discerning voyager.
            </p>
          </div>

          {/* FAST SEARCH & DISCOVERY BAR */}
          <div className="max-w-4xl mx-auto bg-[#0a1122]/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-slate-700/80 shadow-2xl shadow-black/80">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              
              {/* Destination Dropdown */}
              <div className="bg-slate-900/80 rounded-2xl p-2.5 px-3.5 border border-slate-800 text-left">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Destination
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <select
                    id="hero-destination-select"
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-white focus:outline-none w-full cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-300">All Destinations</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                        {d.name} ({d.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="bg-slate-900/80 rounded-2xl p-2.5 px-3.5 border border-slate-800 text-left">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Trip Style
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                  <select
                    id="hero-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-white focus:outline-none w-full cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-300">All Styles</option>
                    <option value="Hill Station" className="bg-slate-900 text-white">Hill Station & Nature</option>
                    <option value="Heritage & Culture" className="bg-slate-900 text-white">Heritage & Palaces</option>
                    <option value="Luxury Wellness" className="bg-slate-900 text-white">Luxury Ayurvedic Retreat</option>
                    <option value="Adventure" className="bg-slate-900 text-white">Himalayan Expeditions</option>
                  </select>
                </div>
              </div>

              {/* Budget Limit Slider */}
              <div className="bg-slate-900/80 rounded-2xl p-2.5 px-3.5 border border-slate-800 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Max Fare
                  </label>
                  <span className="text-xs font-bold text-emerald-400">
                    ₹{budgetLimit.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="2500"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                />
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl px-6 py-3 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all group"
              >
                <span>Find Journeys</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>
          </div>

          {/* Quick AI Assistance Teaser */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
            <span className="text-slate-500">Need inspiration?</span>
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask Aura to plan your customized weekend getaway</span>
            </button>
          </div>

        </div>

      </section>

      {/* 2. STATS & REPUTATION TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#0a1120] border border-slate-800 rounded-3xl shadow-xl">
          {[
            { label: 'Curated Hill Stations', value: '18+', sub: 'Verified estates' },
            { label: 'Voyagers Hosted', value: '12,400+', sub: 'Exceptional satisfaction' },
            { label: 'Average Guest Rating', value: '4.96 ★', sub: 'Across 3,200 reviews' },
            { label: 'Cancellation Guarantee', value: '100% Flex', sub: 'Zero penalty rebooking' },
          ].map((item, idx) => (
            <div key={idx} className="text-center p-3 border-r last:border-r-0 border-slate-800/80">
              <p className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {item.value}
              </p>
              <p className="text-xs font-semibold text-emerald-400 mt-1">{item.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Signature Locales
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Enchanting Destinations
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentView('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View all 8 destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(destinations || []).slice(0, 4).map((dest) => (
            <div
              key={dest.id}
              onClick={() => viewDestinationDetails(dest.id)}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all duration-500 hover:-translate-y-1.5"
            >
              <img
                src={dest.heroImage}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/50 to-transparent" />
              
              {/* Climate Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white">
                <Sun className="w-3 h-3 text-amber-300" />
                <span>{dest.weather?.temp || dest.climate || '18°C Mild'}</span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                    {dest.state || dest.region.split(',')[1]?.trim() || dest.region}
                  </span>
                  <span className="text-xs text-slate-300">
                    From <strong className="text-white font-semibold">₹{dest.startingPrice.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {dest.tagline}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRENDING TOUR PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Curated Itineraries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Trending Tour Packages
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentView('tours');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Browse complete catalog ({tours.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTours.map((tour) => {
            const isFav = isWishlisted(tour.id);
            return (
              <div
                key={tour.id}
                className="bg-[#0b1222] border border-slate-800/90 rounded-3xl overflow-hidden hover:border-emerald-500/40 shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Card Top Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={tour.coverImage}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222] via-transparent to-black/30" />
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-emerald-300">
                    {tour.category}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(tour.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:scale-110 transition-transform"
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                  </button>

                  {/* Rating Pill */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs text-white">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{tour.rating}</span>
                    <span className="text-slate-400 text-[10px]">({tour.reviewCount})</span>
                  </div>

                  {/* Seats Status */}
                  <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md text-[11px] font-semibold text-emerald-300">
                    {tour.availableSeats} seats left
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tour.destinationName}</span>
                    </div>

                    <h3 
                      onClick={() => viewTourDetails(tour.id)}
                      className="text-base font-bold text-white group-hover:text-emerald-300 cursor-pointer transition-colors"
                    >
                      {tour.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {tour.shortDescription}
                    </p>
                  </div>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(tour.highlights || []).slice(0, 2).map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Pricing and Action CTAs */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Fare Per Person
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-emerald-400 font-display">
                          ₹{tour.pricePerPerson.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ₹{Math.round(tour.pricePerPerson * 1.2).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewTourDetails(tour.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => openBookingModal(tour)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 5. LUXURY TOURISM ADVANTAGE (VALUE PROPOSITION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0c1529] via-[#080d1a] to-[#0c1529] border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              The AuraVoyage Distinction
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Why Discerning Travelers Choose AuraVoyage
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We eliminate the chaos of generic tour operators. Every journey is hand-inspected, ensuring privacy, verified heritage stays, and impeccable ground execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 relative z-10">
            {[
              {
                icon: ShieldCheck,
                title: 'Curated & Verified Stays',
                desc: 'Colonial tea bungalows, private boathouses, and boutique forest estates with 100% verified sanitation and service credentials.',
              },
              {
                icon: Sparkles,
                title: '24/7 AI Concierge & Chauffeur',
                desc: 'Real-time multilingual assistance for itinerary tweaks, local dining reservations, and weather advisories on demand.',
              },
              {
                icon: Luggage,
                title: 'Transparent Pricing & GST',
                desc: 'No hidden permits, toll surprises, or mandatory driver tips. Clear itemized invoices ready for instant business or leisure filing.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-[#121c32]/70 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. AI CONCIERGE CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950/70 via-[#0a1426] to-teal-950/70 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>Intelligent Trip Planning</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              Have an exact budget or specific travel dates in mind?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Tell Aura your budget (e.g., <em>"Plan a 3-day trip to Ooty for 2 people under ₹20,000"</em>) and receive an instant personalized schedule with live hotel availability.
            </p>
          </div>

          <button
            onClick={() => setAiAssistantOpen(true)}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 transition-all group"
          >
            <span>Open AI Concierge</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
};
