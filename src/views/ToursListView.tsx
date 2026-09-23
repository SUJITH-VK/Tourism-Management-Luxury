import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Users, 
  Sparkles, 
  ArrowUpDown, 
  RotateCcw,
  Compass,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { TourPackage } from '../types';

export const ToursListView: React.FC = () => {
  const {
    tours,
    destinations,
    filterState,
    setFilterState,
    resetFilters,
    viewTourDetails,
    openBookingModal,
    isWishlisted,
    toggleWishlist,
    setAiAssistantOpen,
  } = useApp();

  const categories = ['All', 'Hill Station', 'Heritage & Culture', 'Luxury Wellness', 'Adventure'];
  const durations = [
    { label: 'Any Duration', value: '' },
    { label: 'Weekend (2-3 Days)', value: 'weekend' },
    { label: 'Standard (4-5 Days)', value: 'standard' },
    { label: 'Extended (6+ Days)', value: 'extended' },
  ];

  // Filtered and sorted tours
  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        // Search query
        if (filterState.searchQuery) {
          const q = filterState.searchQuery.toLowerCase();
          const match =
            tour.title.toLowerCase().includes(q) ||
            tour.destinationName.toLowerCase().includes(q) ||
            tour.shortDescription.toLowerCase().includes(q) ||
            tour.highlights.some((h) => h.toLowerCase().includes(q));
          if (!match) return false;
        }

        // Destination
        if (filterState.destination && tour.destinationId !== filterState.destination) {
          return false;
        }

        // Category
        if (filterState.category && filterState.category !== 'All' && tour.category !== filterState.category) {
          return false;
        }

        // Duration
        if (filterState.duration === 'weekend' && tour.durationDays > 3) return false;
        if (filterState.duration === 'standard' && (tour.durationDays < 4 || tour.durationDays > 5)) return false;
        if (filterState.duration === 'extended' && tour.durationDays < 6) return false;

        // Price
        if (tour.pricePerPerson > filterState.priceRange) return false;

        // Difficulty
        if (filterState.difficulty && tour.difficulty !== filterState.difficulty) return false;

        // Available seats
        if (filterState.availableOnly && tour.availableSeats <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'price-asc':
            return a.pricePerPerson - b.pricePerPerson;
          case 'price-desc':
            return b.pricePerPerson - a.pricePerPerson;
          case 'rating':
            return b.rating - a.rating;
          case 'duration':
            return a.durationDays - b.durationDays;
          default:
            return b.rating * b.reviewCount - a.rating * a.reviewCount;
        }
      });
  }, [tours, filterState]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Compass className="w-4 h-4" />
            <span>Curated Expedition Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
            Explore Tour Packages
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Showing <strong className="text-emerald-400">{filteredTours.length}</strong> luxury escapes across pristine hill stations and cultural sanctuaries
          </p>
        </div>

        {/* AI Prompt Button */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 shadow-lg shadow-emerald-950/40 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Need help choosing? Ask AI Concierge</span>
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        
        {/* Row 1: Search, Destination, Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Keyword Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by keywords, activities, tea estates..."
              className="w-full bg-[#121c32] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Destination Selector */}
          <div className="sm:col-span-3">
            <select
              value={filterState.destination}
              onChange={(e) => setFilterState((prev) => ({ ...prev, destination: e.target.value }))}
              className="w-full bg-[#121c32] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-3">
            <select
              value={filterState.sortBy}
              onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full bg-[#121c32] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Trip Duration</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="sm:col-span-1 flex items-center justify-center">
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Row 2: Category Pills, Duration & Price Range */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = (filterState.category === '' && cat === 'All') || filterState.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterState((prev) => ({ ...prev, category: cat === 'All' ? '' : cat }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="text-slate-400">Under:</span>
            <input
              type="range"
              min="6000"
              max="60000"
              step="2000"
              value={filterState.priceRange}
              onChange={(e) => setFilterState((prev) => ({ ...prev, priceRange: Number(e.target.value) }))}
              className="w-28 sm:w-36 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="font-bold text-emerald-400 font-mono">
              ₹{filterState.priceRange.toLocaleString('en-IN')}
            </span>
          </div>

        </div>

      </div>

      {/* TOURS GRID */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-20 bg-[#0b1222] border border-slate-800 rounded-3xl p-8 space-y-4">
          <Compass className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Tour Packages Match Your Filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your price limit, clearing the destination selection, or asking our AI Concierge for recommendations.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => {
            const isFav = isWishlisted(tour.id);
            return (
              <div
                key={tour.id}
                className="bg-[#0b1222] border border-slate-800/90 rounded-3xl overflow-hidden hover:border-emerald-500/40 shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={tour.coverImage}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222] via-transparent to-black/30" />

                  {/* Category Pill */}
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

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tour.durationDays}D / {tour.durationNights}N</span>
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

                  {/* Highlight Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {(tour.highlights || []).slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 truncate max-w-[160px]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Price & Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Per Traveler
                      </span>
                      <span className="text-lg font-bold text-emerald-400 font-display">
                        ₹{tour.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewTourDetails(tour.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Itinerary
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
      )}

    </div>
  );
};
