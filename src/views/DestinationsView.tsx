import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Sun, 
  Calendar, 
  Compass, 
  ArrowRight, 
  Star, 
  Sparkles,
  Mountain,
  Tag
} from 'lucide-react';
import { Destination } from '../types';

export const DestinationsView: React.FC = () => {
  const {
    destinations,
    tours,
    viewDestinationDetails,
    setFilterState,
    setCurrentView,
    setAiAssistantOpen,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Mountain className="w-4 h-4" />
            <span>Destinations & Sanctuaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
            Curated Hill Stations & Escapes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Hand-inspected sanctuaries across the Western Ghats, Nilgiris, and Himalayan valleys
          </p>
        </div>

        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ask AI to Recommend a Destination</span>
        </button>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {destinations.map((dest) => {
          const destTours = tours.filter((t) => t.destinationId === dest.id);

          return (
            <div
              key={dest.id}
              className="bg-[#0b1222] border border-slate-800/90 rounded-3xl overflow-hidden hover:border-emerald-500/40 shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222] via-[#0b1222]/30 to-black/30" />

                {/* Region Pill */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300">
                  {dest.state ? `${dest.state} • ` : ''}{dest.region}
                </span>

                {/* Weather Pill */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>{dest.weather?.temp || dest.climate || '18°C Mild'}</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white font-display">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-emerald-300 font-medium mt-0.5">
                      {dest.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Starts from</span>
                    <span className="text-lg font-bold text-white font-display">
                      ₹{(dest.startingPrice ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#121c32] rounded-2xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Best Season
                      </span>
                      <span className="text-white font-medium">{dest.bestSeason || dest.bestTimeToVisit || 'All Year'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Altitude
                      </span>
                      <span className="text-white font-medium">{dest.altitude || 'Sea Level to Hills'}</span>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                      Key Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(dest.highlights || dest.tags || []).map((h, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    <strong className="text-white">{destTours.length}</strong> active tour packages
                  </span>

                  <button
                    onClick={() => {
                      setFilterState((prev) => ({ ...prev, destination: dest.id }));
                      setCurrentView('tours');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all group"
                  >
                    <span>View Tours in {dest.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
