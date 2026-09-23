import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, MapPin, Compass, Calendar, ArrowRight, Sparkles, Tag } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setGlobalSearchOpen,
    tours,
    destinations,
    bookings,
    viewTourDetails,
    viewDestinationDetails,
    setCurrentView,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        tours: (tours || []).slice(0, 3),
        destinations: (destinations || []).slice(0, 4),
        isDefault: true,
      };
    }

    const matchedTours = (tours || []).filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.destinationName.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.highlights || []).some((h) => h.toLowerCase().includes(q))
    );

    const matchedDestinations = (destinations || []).filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        (d.tags || []).some((t) => t.toLowerCase().includes(q))
    );

    return {
      tours: matchedTours,
      destinations: matchedDestinations,
      isDefault: false,
    };
  }, [query, tours, destinations]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0b1222] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        id="global-search-container"
      >
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-[#090e1a]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, tour packages, hill stations, budget..."
            autoFocus
            className="flex-1 bg-transparent text-white text-base placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-[#090f1d] border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider shrink-0">
            Popular:
          </span>
          {['Ooty', 'Kodaikanal', 'Kerala Houseboat', 'Under ₹10,000', 'Rajasthan', 'Family'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700/60 transition-all shrink-0"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Destinations Category */}
          {searchResults.destinations.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destinations ({searchResults.destinations.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {searchResults.destinations.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => {
                      viewDestinationDetails(dest.id);
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#121c32] hover:bg-[#182542] border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
                  >
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {dest.name}
                        </h4>
                        <span className="text-xs text-emerald-400 font-semibold">
                          From ₹{dest.startingPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{dest.region}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tour Packages Category */}
          {searchResults.tours.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tour Packages ({searchResults.tours.length})</span>
              </h3>
              <div className="space-y-2.5">
                {searchResults.tours.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      viewTourDetails(t.id);
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-[#121c32] hover:bg-[#182542] border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
                  >
                    <img
                      src={t.coverImage}
                      alt={t.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                          {t.destinationName} • {t.durationDays}D/{t.durationNights}N
                        </span>
                        <span className="text-[10px] text-slate-400">★ {t.rating}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 truncate">
                        {t.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {t.highlights[0]}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-emerald-400 block font-display">
                        ₹{t.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500">per traveler</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {searchResults.tours.length === 0 && searchResults.destinations.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <Compass className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
              <h4 className="text-base font-bold text-white">No exact tourism matches</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                We couldn't find matches for "{query}". Try searching for popular hill stations like "Ooty", "Coorg", "Manali", or ask our AI Concierge!
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
