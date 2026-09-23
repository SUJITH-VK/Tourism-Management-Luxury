import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  Users, 
  Check, 
  X, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Coffee, 
  Car, 
  Home, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { TourPackage, TourPackageReview } from '../types';

export const TourDetailView: React.FC = () => {
  const {
    selectedTour,
    setCurrentView,
    openBookingModal,
    isWishlisted,
    toggleWishlist,
    setAiAssistantOpen,
  } = useApp();

  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [guestCountPreview, setGuestCountPreview] = useState<number>(2);

  if (!selectedTour) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Tour Selected</h2>
        <button
          onClick={() => setCurrentView('tours')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to All Tours
        </button>
      </div>
    );
  }

  const tour: TourPackage = selectedTour;
  const isFav = isWishlisted(tour.id);

  // Safe fallback for gallery
  const rawGallery = (tour.gallery && tour.gallery.length > 0)
    ? tour.gallery
    : (tour.galleryImages && tour.galleryImages.length > 0)
      ? tour.galleryImages
      : [tour.coverImage];

  // Ensure at least 4 items for the mosaic grid
  const tourGallery: string[] = [
    ...rawGallery,
    tour.coverImage,
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  ].slice(0, 4);

  // Safe fallback for verified reviews
  const defaultReviews: TourPackageReview[] = [
    {
      id: 'rev-1',
      author: 'Arun & Divya K.',
      rating: 5,
      date: '2 weeks ago',
      comment: `An exceptional journey in ${tour.destinationName}! The chauffeur was courteous, punctuality was top notch, and the selected boutique heritage resort was world-class.`,
    },
    {
      id: 'rev-2',
      author: 'Meera Nambiar',
      rating: 5,
      date: '1 month ago',
      comment: `Every detail was taken care of seamlessly. The naturalists and local guides brought the culture and landscape to life. We will definitely travel with SouthVoyage again.`,
    },
  ];
  const reviewsList = (tour.reviews && tour.reviews.length > 0) ? tour.reviews : defaultReviews;

  return (
    <div className="space-y-12 pb-24">
      
      {/* Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          id="tour-detail-back-button"
          onClick={() => {
            setCurrentView('tours');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tours</span>
        </button>
      </div>

      {/* 1. CINEMATIC HERO & GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          
          {/* Title & Metadata Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1.5">
                <span>{tour.category}</span>
                <span>•</span>
                <span>{tour.destinationName}</span>
                <span>•</span>
                <span className="text-amber-300">★ {tour.rating} ({tour.reviewCount || tour.reviewsCount || reviewsList.length} reviews)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white">
                {tour.title}
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => toggleWishlist(tour.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                  isFav
                    ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                    : 'bg-[#121c32] border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFav ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => setAiAssistantOpen(true)}
                className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center gap-2 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask AI About This Tour</span>
              </button>
            </div>
          </div>

          {/* Photo Gallery Mosaic */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] rounded-3xl overflow-hidden">
            <div 
              className="md:col-span-2 h-full overflow-hidden"
              onClick={() => setSelectedGalleryImg(tour.coverImage)}
            >
              <img
                src={tour.coverImage}
                alt={tour.title}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
              {tourGallery.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedGalleryImg(img)}
                  className="h-[202px] overflow-hidden rounded-xl cursor-pointer group relative"
                >
                  <img
                    src={img}
                    alt={`${tour.title} gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAIN CONTENT GRID (ITINERARY vs STICKY BOOKING CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 8 Cols: Overview, Itinerary, Inclusions */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Quick Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0b1222] border border-slate-800 rounded-2xl">
              <div className="text-center p-2 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                <span className="text-sm font-bold text-white">{tour.durationDays}D / {tour.durationNights}N</span>
              </div>
              <div className="text-center p-2 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pace & Terrain</span>
                <span className="text-sm font-bold text-emerald-400">{tour.difficulty}</span>
              </div>
              <div className="text-center p-2 border-r border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Seats</span>
                <span className="text-sm font-bold text-amber-300">{tour.availableSeats} of {tour.totalSeats}</span>
              </div>
              <div className="text-center p-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Available</span>
                <span className="text-sm font-bold text-white">Private Sedan</span>
              </div>
            </div>

            {/* Tour Narrative Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-display text-white">The Experience</h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {tour.longDescription}
              </p>

              {/* Highlights Checklist */}
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                  Signature Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(tour.highlights || []).map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        ✓
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DAY-BY-DAY ITINERARY ACCORDION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display text-white">Day-by-Day Itinerary</h2>
                <span className="text-xs text-slate-400">{(tour.itinerary || []).length} Days Planned</span>
              </div>

              <div className="space-y-3">
                {(tour.itinerary || []).map((day) => {
                  const isExpanded = expandedDay === day.day;
                  return (
                    <div
                      key={day.day}
                      className="bg-[#0b1222] border border-slate-800 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? 0 : day.day)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                            D{day.day}
                          </span>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-white">
                              {day.title}
                            </h4>
                            <p className="text-xs text-slate-400">
                              Stay: {day.accommodation || day.stay || 'Heritage Resort / Villa'} • Meals: {day.meals}
                            </p>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-5 pt-0 border-t border-slate-800/60 space-y-3 text-xs text-slate-300">
                          <p className="leading-relaxed text-slate-300">{day.description}</p>
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1.5">
                              Key Experiences
                            </span>
                            <ul className="space-y-1">
                              {(day.activities || []).map((act, actIdx) => (
                                <li key={actIdx} className="flex items-center gap-2 text-slate-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INCLUSIONS & EXCLUSIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Inclusions */}
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Complimentary Inclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(tour.inclusions || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Exclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {(tour.exclusions || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* REVIEWS & RATINGS */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Voyager Reviews</h3>
                  <p className="text-xs text-slate-400">Verified guests who completed this journey</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-400 font-display">{tour.rating}</span>
                  <div className="text-left">
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                    <span className="text-[10px] text-slate-400">{tour.reviewCount || tour.reviewsCount || reviewsList.length} reviews</span>
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-[#121c32] rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-900 text-emerald-300 font-bold text-xs flex items-center justify-center">
                          {rev.author[0]}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{rev.author}</p>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Sticky Reservation Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="bg-[#0e1629] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                  All-Inclusive Package Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-display text-white">
                    ₹{tour.pricePerPerson.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400">/ person</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Includes private chauffeur, verified heritage stays, guided permits & breakfast
                </p>
              </div>

              {/* Live Availability Badge */}
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-300">Live Status:</span>
                <strong className="text-emerald-300">{tour.availableSeats} Seats Available</strong>
              </div>

              {/* Guest Count Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Number of Guests
                </label>
                <div className="flex items-center justify-between p-2 bg-[#14203a] rounded-xl border border-slate-700">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCountPreview(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        guestCountPreview === num
                          ? 'bg-emerald-500 text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Departure Dates */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Upcoming Departure Dates
                </label>
                <div className="space-y-1.5">
                  {(tour.departureDates || []).map((dateStr) => (
                    <div
                      key={dateStr}
                      className="p-2.5 rounded-lg bg-[#14203a] border border-slate-700 text-xs flex items-center justify-between text-slate-300"
                    >
                      <span className="font-semibold text-white">
                        {new Date(dateStr).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] text-emerald-400">Guaranteed</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Preview */}
              <div className="pt-4 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Fare ({guestCountPreview} Guests)</span>
                  <span>₹{(tour.pricePerPerson * guestCountPreview).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5%)</span>
                  <span>₹{Math.round(tour.pricePerPerson * guestCountPreview * 0.05).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Payable</span>
                  <span className="text-emerald-400 font-display">
                    ₹{Math.round(tour.pricePerPerson * guestCountPreview * 1.05).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Book Now CTA */}
              <button
                id="tour-detail-reserve-btn"
                onClick={() => openBookingModal(tour)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Reserve My Experience</span>
              </button>

              <p className="text-[10px] text-center text-slate-500">
                Guaranteed Instant Confirmation • 100% Refundable up to 7 days prior
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedGalleryImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white bg-slate-800/80 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedGalleryImg}
              alt="Gallery Preview"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
};
