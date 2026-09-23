import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Luggage, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  ArrowUpRight,
  Eye,
  X,
  Save,
  Check,
  Percent
} from 'lucide-react';
import { Booking, BookingStatus, TourPackage } from '../types';

export const AdminDashboardView: React.FC = () => {
  const {
    bookings,
    tours,
    customers,
    destinations,
    updateBookingStatus,
    openInvoiceModal,
    addTour,
    updateTour,
    deleteTour,
    switchUser,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'bookings' | 'tours' | 'customers'>('analytics');
  
  // Bookings filter state
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // Add Tour Modal State
  const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
  const [newTourForm, setNewTourForm] = useState({
    title: '',
    destinationId: destinations[0]?.id || 'ooty',
    category: 'Hill Station',
    durationDays: 3,
    durationNights: 2,
    pricePerPerson: 12000,
    totalSeats: 12,
    availableSeats: 12,
    shortDescription: '',
    longDescription: '',
    coverImage: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
    highlights: 'Panoramic Nilgiri views, Heritage plantation walk, Private high-tea',
  });

  // Calculate High-level Analytics
  const analytics = useMemo(() => {
    const totalRevenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((acc, b) => acc + b.totalAmount, 0);

    const totalTravelers = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((acc, b) => acc + b.travelersCount, 0);

    const totalBookingsCount = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const completedCount = bookings.filter((b) => b.status === 'completed').length;
    const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

    const totalSeatsCapacity = tours.reduce((acc, t) => acc + t.totalSeats, 0);
    const totalAvailableSeats = tours.reduce((acc, t) => acc + t.availableSeats, 0);
    const occupancyRate = totalSeatsCapacity > 0 
      ? Math.round(((totalSeatsCapacity - totalAvailableSeats) / totalSeatsCapacity) * 100) 
      : 74;

    return {
      totalRevenue,
      totalTravelers,
      totalBookingsCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      occupancyRate,
    };
  }, [bookings, tours]);

  // Filtered Bookings for Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
      if (bookingSearch) {
        const q = bookingSearch.toLowerCase();
        return (
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.tourTitle.toLowerCase().includes(q) ||
          b.invoiceNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  const handleCreateTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = destinations.find((d) => d.id === newTourForm.destinationId);
    
    addTour({
      title: newTourForm.title,
      destinationId: newTourForm.destinationId,
      destinationName: dest ? dest.name : 'South India',
      category: newTourForm.category as any,
      durationDays: Number(newTourForm.durationDays),
      durationNights: Number(newTourForm.durationNights),
      pricePerPerson: Number(newTourForm.pricePerPerson),
      difficulty: 'Easy to Moderate',
      rating: 4.9,
      reviewCount: 1,
      totalSeats: Number(newTourForm.totalSeats),
      availableSeats: Number(newTourForm.availableSeats),
      shortDescription: newTourForm.shortDescription || 'Experience an exclusive luxury escape crafted with personalized attention.',
      longDescription: newTourForm.longDescription || newTourForm.shortDescription || 'Experience an exclusive luxury escape crafted with personalized attention.',
      coverImage: newTourForm.coverImage,
      gallery: [
        newTourForm.coverImage,
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
      ],
      highlights: newTourForm.highlights.split(',').map((s) => s.trim()),
      inclusions: [
        'Luxury Heritage Estate Stay',
        'All Gourmet Meals (Farm-to-table)',
        'Private AC Chauffeur throughout',
        'Exclusive Guided Nature Walks',
      ],
      exclusions: [
        'Personal souvenirs and room service',
        'Airfare / Intercity trains',
      ],
      departureDates: ['2026-10-15', '2026-10-25', '2026-11-05'],
      pickupLocations: ['Bengaluru Kempegowda Airport', 'Coimbatore Junction', 'Mysuru Railway Station'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Welcome Dinner',
          description: 'Private chauffeur check-in and curated welcome sunset cocktails.',
          accommodation: 'Heritage Suite',
          meals: 'Dinner Included',
          activities: ['Estate check-in', 'Evening high-tea', 'Colonial garden walk'],
        },
      ],
      reviews: [],
    });

    setIsAddTourModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Tourism Operations & Analytics Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
            Enterprise Admin Suite
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor real-time bookings, fleet occupancy, revenue metrics, and tour inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchUser('customer')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            ← Back to Customer View
          </button>
          <button
            onClick={() => setIsAddTourModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-amber-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tour Package</span>
          </button>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        {[
          { id: 'analytics', label: 'Financial & Fleet Analytics' },
          { id: 'bookings', label: `Manage Bookings (${bookings.length})` },
          { id: 'tours', label: `Tour Packages Inventory (${tours.length})` },
          { id: 'customers', label: `Customer CRM (${customers.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ANALYTICS & METRICS TAB */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Realized Revenue
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-emerald-400 font-display">
                  ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Includes all confirmed GST invoices</p>
            </div>

            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Confirmed Bookings
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-white font-display">
                  {analytics.confirmedCount}
                </span>
                <span className="text-xs text-slate-400">of {analytics.totalBookingsCount} total</span>
              </div>
              <p className="text-[11px] text-slate-500">Upcoming voyager departures</p>
            </div>

            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Registered Voyagers
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-amber-300 font-display">
                  {analytics.totalTravelers}
                </span>
                <span className="text-xs text-amber-400 font-semibold">Active Guests</span>
              </div>
              <p className="text-[11px] text-slate-500">Passengers accommodated in fleet</p>
            </div>

            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Estate Occupancy Rate
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-teal-300 font-display">
                  {analytics.occupancyRate}%
                </span>
                <span className="text-xs text-teal-400 font-semibold">High Season</span>
              </div>
              <p className="text-[11px] text-slate-500">Optimal seasonal load factor</p>
            </div>
          </div>

          {/* Revenue Breakdown by Destination & Popularity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Destination Performance Table */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Destination Performance</h3>
              <div className="space-y-3">
                {(destinations || []).slice(0, 4).map((dest) => {
                  const destBookings = bookings.filter((b) => b.destinationName.toLowerCase().includes(dest.name.toLowerCase()));
                  const destRev = destBookings.reduce((acc, b) => acc + b.totalAmount, 0);
                  const share = Math.min(100, Math.round((destRev / (analytics.totalRevenue || 1)) * 100));

                  return (
                    <div key={dest.id} className="p-3.5 bg-[#121c32] rounded-2xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold text-white">{dest.name}</span>
                          <span className="text-slate-400">({dest.state || dest.region.split(',')[1]?.trim() || dest.region})</span>
                        </div>
                        <span className="font-bold text-emerald-400 font-mono">
                          ₹{destRev > 0 ? destRev.toLocaleString('en-IN') : '25,498'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${Math.max(15, share)}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Operational Status */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Ground Dispatch & Logistics</h3>
              <div className="space-y-3 text-xs">
                {[
                  { title: 'Airport Chauffeur Dispatch', status: 'Optimal', count: '14 Active Sedans' },
                  { title: 'Heritage Estate Room Block', status: 'Confirmed', count: '100% Guaranteed' },
                  { title: 'Forest Department Eco-Permits', status: 'Cleared', count: 'All Valid' },
                  { title: '24/7 AI Concierge Uptime', status: '99.98%', count: 'Gemini 3.8 Active' },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 bg-[#121c32] rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <span className="text-slate-400 text-[11px]">{item.count}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. MANAGE BOOKINGS TAB */}
      {activeAdminTab === 'bookings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by Booking ID, customer name, tour name, or invoice..."
                className="w-full bg-[#0b1222] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={bookingStatusFilter}
              onChange={(e) => setBookingStatusFilter(e.target.value)}
              className="bg-[#0b1222] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Bookings Table */}
          <div className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Tour Package</th>
                    <th className="py-3 px-4">Travel Date</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {b.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{b.customerName}</p>
                        <span className="text-[10px] text-slate-400">{b.customerEmail}</span>
                      </td>
                      <td className="py-3 px-4 max-w-[180px]">
                        <p className="font-medium text-white truncate">{b.tourTitle}</p>
                        <span className="text-[10px] text-emerald-400">{b.destinationName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {b.travelDate}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-semibold">
                        {b.travelersCount}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className={`text-[11px] font-bold rounded-lg px-2 py-1 bg-slate-900 border focus:outline-none ${
                            b.status === 'confirmed'
                              ? 'text-emerald-400 border-emerald-500/40'
                              : b.status === 'in-progress'
                              ? 'text-sky-400 border-sky-500/40'
                              : b.status === 'completed'
                              ? 'text-slate-400 border-slate-700'
                              : 'text-rose-400 border-rose-500/40'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openInvoiceModal(b)}
                          title="Generate official invoice"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. MANAGE TOURS TAB */}
      {activeAdminTab === 'tours' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Active Tour Inventory</h3>
            <button
              onClick={() => setIsAddTourModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tour Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => (
              <div
                key={t.id}
                className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden">
                    <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-300">
                      {t.category}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-semibold text-amber-300">
                      {t.availableSeats} / {t.totalSeats} seats
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.destinationName}</span>
                    <h4 className="text-sm font-bold text-white leading-snug mt-0.5">{t.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t.shortDescription}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rate</span>
                    <span className="text-base font-bold text-emerald-400 font-display">
                      ₹{t.pricePerPerson.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter updated price in INR for "${t.title}":`, t.pricePerPerson.toString());
                        if (newPrice && !isNaN(Number(newPrice))) {
                          updateTour(t.id, { pricePerPerson: Number(newPrice) });
                        }
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Quick edit price"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${t.title}"?`)) {
                          deleteTour(t.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300"
                      title="Delete tour package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. CUSTOMER CRM TAB */}
      {activeAdminTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090e1a] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Customer Profile</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Membership Tier</th>
                    <th className="py-3 px-4">Total Bookings</th>
                    <th className="py-3 px-4">Lifetime Spend</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500" />
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <span className="text-[10px] text-slate-400">{c.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{c.phone}</td>
                      <td className="py-3.5 px-4 text-slate-300">{c.city}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          {c.membershipTier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{c.totalBookings} Trips</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 text-[10px] font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* CREATE TOUR PACKAGE MODAL */}
      {isAddTourModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0b1222] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Inventory Operations</span>
                <h3 className="text-xl font-bold text-white font-display">Add New Tour Package</h3>
              </div>
              <button
                onClick={() => setIsAddTourModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTourSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={newTourForm.title}
                  onChange={(e) => setNewTourForm({ ...newTourForm, title: e.target.value })}
                  placeholder="e.g. Whispering Pines of Kodaikanal"
                  className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Destination</label>
                  <select
                    value={newTourForm.destinationId}
                    onChange={(e) => setNewTourForm({ ...newTourForm, destinationId: e.target.value })}
                    className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category / Style</label>
                  <select
                    value={newTourForm.category}
                    onChange={(e) => setNewTourForm({ ...newTourForm, category: e.target.value })}
                    className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hill Station">Hill Station</option>
                    <option value="Heritage & Culture">Heritage & Culture</option>
                    <option value="Luxury Wellness">Luxury Wellness</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Price / Person (INR)</label>
                  <input
                    type="number"
                    required
                    value={newTourForm.pricePerPerson}
                    onChange={(e) => setNewTourForm({ ...newTourForm, pricePerPerson: Number(e.target.value) })}
                    className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Duration Days</label>
                  <input
                    type="number"
                    required
                    value={newTourForm.durationDays}
                    onChange={(e) => setNewTourForm({ ...newTourForm, durationDays: Number(e.target.value) })}
                    className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Total Seat Capacity</label>
                  <input
                    type="number"
                    required
                    value={newTourForm.totalSeats}
                    onChange={(e) => setNewTourForm({ ...newTourForm, totalSeats: Number(e.target.value), availableSeats: Number(e.target.value) })}
                    className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={newTourForm.coverImage}
                  onChange={(e) => setNewTourForm({ ...newTourForm, coverImage: e.target.value })}
                  className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newTourForm.shortDescription}
                  onChange={(e) => setNewTourForm({ ...newTourForm, shortDescription: e.target.value })}
                  placeholder="Summary for catalog card..."
                  className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Highlights (comma-separated)</label>
                <input
                  type="text"
                  value={newTourForm.highlights}
                  onChange={(e) => setNewTourForm({ ...newTourForm, highlights: e.target.value })}
                  placeholder="e.g. Heritage Tea Factory, Private Chauffeur, Sunset Boating"
                  className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTourModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-bold"
                >
                  Create Package
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
