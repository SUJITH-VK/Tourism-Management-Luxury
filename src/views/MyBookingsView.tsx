import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert,
  CreditCard,
  Luggage,
  Award,
  ChevronRight
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';

export const MyBookingsView: React.FC = () => {
  const {
    currentUser,
    bookings,
    openInvoiceModal,
    viewTourDetails,
    cancelBooking,
    setCurrentView,
    setAiAssistantOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Filter bookings for current user (or show all if admin)
  const myBookings = bookings.filter((b) => 
    currentUser.role === 'admin' ? true : b.customerId === currentUser.id
  );

  const filteredBookings = myBookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const totalSpent = myBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Confirmed
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full text-xs font-semibold">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-semibold">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-semibold">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Luggage className="w-4 h-4" />
            <span>Voyager Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
            My Bookings & Expeditions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track departure dates, download official GST tax invoices, and manage guest passes
          </p>
        </div>

        <button
          onClick={() => setCurrentView('tours')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
        >
          <span>Book New Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Loyalty Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Total Bookings</span>
          <p className="text-xl sm:text-2xl font-bold text-white font-display">{myBookings.length}</p>
          <span className="text-[10px] sm:text-xs text-emerald-400 block truncate">{myBookings.filter(b => b.status === 'confirmed').length} upcoming</span>
        </div>

        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Cumulative Spend</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-display">
            ₹{(totalSpent ?? 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] sm:text-xs text-slate-400 block truncate">All GST invoices cleared</span>
        </div>

        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Membership Tier</span>
          <p className="text-lg sm:text-xl font-bold text-amber-300 font-display flex items-center gap-1.5 truncate">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span className="truncate">{currentUser.membershipTier}</span>
          </p>
          <span className="text-[10px] sm:text-xs text-slate-400 block truncate">Complimentary Chauffeur</span>
        </div>

        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">Reward Credits</span>
          <p className="text-xl sm:text-2xl font-bold text-teal-300 font-display">2,850 pts</p>
          <span className="text-[10px] sm:text-xs text-slate-400 block truncate">Redeemable on next booking</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        {[
          { id: 'all', label: 'All Expeditions' },
          { id: 'confirmed', label: 'Confirmed (Upcoming)' },
          { id: 'completed', label: 'Past Journeys' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#0b1222] border border-slate-800 rounded-3xl p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bookings in this Category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Ready to explore serene tea estates or royal palaces? Browse our curated portfolio today.
          </p>
          <button
            onClick={() => setCurrentView('tours')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Discover Tour Packages
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Tour Cover Image */}
                <div className="md:col-span-4 relative min-h-[220px]">
                  <img
                    src={b.coverImage}
                    alt={b.tourTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0b1222]" />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                {/* Booking Content Details */}
                <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
                  
                  {/* Header Row */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">Ref: {b.id}</span>
                        <span>•</span>
                        <span>Invoice: <strong className="font-mono text-slate-300">{b.invoiceNumber}</strong></span>
                      </div>
                      <span className="text-[11px] text-slate-500">Booked on {new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-display">
                      {b.tourTitle}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {b.destinationName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        Departure: <strong className="text-white ml-1">{b.travelDate}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {b.durationDays}D / {b.durationNights}N
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        {b.travelersCount} Guests
                      </span>
                    </div>
                  </div>

                  {/* Passenger Manifest Snippet */}
                  <div className="p-3 bg-[#121c32] rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Registered Guests & Pickup
                    </span>
                    <p className="text-slate-200">
                      <strong>Lead:</strong> {b.customerName} • <strong>Pickup:</strong> {b.pickupLocation}
                    </p>
                    {b.specialRequirements && (
                      <p className="text-slate-400 text-[11px]">
                        <strong>Special Request:</strong> {b.specialRequirements}
                      </p>
                    )}
                  </div>

                  {/* Financial Total and Actions */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Amount Paid
                      </span>
                      <span className="text-xl font-bold text-emerald-400 font-display">
                        ₹{(b.totalAmount ?? 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        ({b.paymentMethod})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openInvoiceModal(b)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Download Invoice</span>
                      </button>

                      <button
                        onClick={() => viewTourDetails(b.tourId)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <span>Tour Details</span>
                      </button>

                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel booking ${b.id}? Refund will be credited within 48 hours.`)) {
                              cancelBooking(b.id);
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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
