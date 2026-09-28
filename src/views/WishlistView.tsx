import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Trash2, ArrowRight, Clock, Star, MapPin, Compass } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    tours,
    toggleWishlist,
    viewTourDetails,
    openBookingModal,
    setCurrentView,
  } = useApp();

  const savedTours = tours.filter((t) => wishlist.includes(t.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
            <span>Saved Itineraries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
            My Travel Wishlist
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {savedTours.length} curated experiences saved for future voyage planning
          </p>
        </div>

        <button
          onClick={() => setCurrentView('tours')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          Explore More Tours
        </button>
      </div>

      {savedTours.length === 0 ? (
        <div className="text-center py-20 bg-[#0b1222] border border-slate-800 rounded-3xl p-8 space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the heart icon on any tour package to save it here for future planning and comparison.
          </p>
          <button
            onClick={() => setCurrentView('tours')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Explore Tours Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/40 shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative h-52">
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(tour.id)}
                  title="Remove from wishlist"
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-rose-400 hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-4 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-semibold text-emerald-300">
                  {tour.category}
                </span>
              </div>

              <div className="p-5 space-y-4">
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
                    className="text-base font-bold text-white hover:text-emerald-300 cursor-pointer"
                  >
                    {tour.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
                    <span className="text-lg font-bold text-emerald-400 font-display">
                      ₹{(tour.pricePerPerson ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewTourDetails(tour.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => openBookingModal(tour)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/30"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
