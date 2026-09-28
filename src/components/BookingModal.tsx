import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Users, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Luggage,
  Clock,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { TravelerInfo, TourPackage } from '../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModalTour,
    closeBookingModal,
    currentUser,
    createBooking,
    openInvoiceModal,
    setCurrentView,
  } = useApp();

  if (!bookingModalTour) return null;

  const tour: TourPackage = bookingModalTour;

  const departureDates = (tour.departureDates && tour.departureDates.length > 0)
    ? tour.departureDates
    : ['2026-10-15', '2026-11-01', '2026-12-10'];
  const pickupLocations = (tour.pickupLocations && tour.pickupLocations.length > 0)
    ? tour.pickupLocations
    : ['Airport / Railway Station Welcome Lounge', 'City Center Hub', 'Major Hotel Lobby'];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [numTravelers, setNumTravelers] = useState<number>(2);
  const [primaryContact, setPrimaryContact] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });

  const [travelers, setTravelers] = useState<TravelerInfo[]>([
    { name: currentUser.name, age: 29, gender: 'Female' },
    { name: 'Guest 2', age: 31, gender: 'Male' },
  ]);

  const [selectedDate, setSelectedDate] = useState<string>(departureDates[0]);
  const [selectedPickup, setSelectedPickup] = useState<string>(pickupLocations[0]);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('HDFC Infinia Credit Card');
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Synchronize travelers array when numTravelers changes
  const handleTravelerCountChange = (count: number) => {
    setNumTravelers(count);
    const updated = [...travelers];
    while (updated.length < count) {
      updated.push({ name: `Guest ${updated.length + 1}`, age: 30, gender: 'Female' });
    }
    setTravelers(updated.slice(0, count));
  };

  const updateTravelerInfo = (index: number, field: keyof TravelerInfo, value: any) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  // Financial calculations
  const basePrice = tour.pricePerPerson * numTravelers;
  const taxesAndFees = Math.round(basePrice * 0.05); // 5% GST
  const totalAmount = basePrice + taxesAndFees;

  const handleConfirmBooking = () => {
    const newBooking = createBooking({
      customerId: currentUser.id,
      customerName: primaryContact.name,
      customerEmail: primaryContact.email,
      customerPhone: primaryContact.phone,
      tourId: tour.id,
      tourTitle: tour.title,
      destinationName: tour.destinationName,
      coverImage: tour.coverImage,
      travelDate: selectedDate,
      durationDays: tour.durationDays,
      durationNights: tour.durationNights,
      travelersCount: numTravelers,
      travelerDetails: travelers,
      pickupLocation: selectedPickup,
      specialRequirements,
      pricePerPerson: tour.pricePerPerson,
      basePrice,
      taxesAndFees,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod,
    });

    setConfirmedBookingData(newBooking);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0d1527] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]"
        id="booking-modal-container"
      >
        
        {/* Header with Step Indicator */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 bg-[#09101f] border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              Luxury Booking Engine
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug truncate max-w-[240px] sm:max-w-md">
              {step === 4 ? 'Booking Confirmed' : tour.title}
            </h2>
          </div>
          
          <button
            id="close-booking-modal-button"
            onClick={closeBookingModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (1 to 4) */}
        {step < 4 && (
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0a1122] border-b border-slate-800/80 flex items-center justify-between text-xs">
            {[
              { num: 1, label: 'Guests', fullLabel: 'Traveler Details' },
              { num: 2, label: 'Date', fullLabel: 'Travel Schedule' },
              { num: 3, label: 'Payment', fullLabel: 'Cost & Summary' },
            ].map((s) => (
              <div 
                key={s.num} 
                className={`flex items-center gap-1.5 sm:gap-2 font-medium ${
                  step === s.num
                    ? 'text-emerald-400'
                    : step > s.num
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold ${
                  step === s.num
                    ? 'bg-emerald-500 text-black'
                    : step > s.num
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {s.num}
                </span>
                <span className="text-[11px] sm:text-xs">
                  <span className="sm:hidden">{s.label}</span>
                  <span className="hidden sm:inline">{s.fullLabel}</span>
                </span>
                {s.num < 3 && <span className="text-slate-700 mx-1 sm:mx-2">→</span>}
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[68vh] space-y-4 sm:space-y-6 scroll-touch">
          
          {/* STEP 1: Traveler Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Primary Contact Info */}
              <div className="bg-[#121c32] rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <UserCheck className="w-4 h-4" />
                  <span>Primary Booking Contact</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={primaryContact.name}
                      onChange={(e) => setPrimaryContact({ ...primaryContact, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={primaryContact.email}
                      onChange={(e) => setPrimaryContact({ ...primaryContact, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={primaryContact.phone}
                      onChange={(e) => setPrimaryContact({ ...primaryContact, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Travelers Selector */}
              <div className="flex items-center justify-between p-4 bg-[#121c32] rounded-2xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Number of Travelers</h4>
                  <p className="text-xs text-slate-400">Available seats on this departure: {tour.availableSeats}</p>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleTravelerCountChange(num)}
                      className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${
                        numTravelers === num
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Co-Travelers Form list */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300">Guest Pass Details</h4>
                {travelers.map((traveler, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-[#0e172a] rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Traveler {idx + 1} {idx === 0 && '(Lead Traveler)'}
                      </label>
                      <input
                        type="text"
                        value={traveler.name}
                        onChange={(e) => updateTravelerInfo(idx, 'name', e.target.value)}
                        placeholder="Legal Name as per ID"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={traveler.age}
                        onChange={(e) => updateTravelerInfo(idx, 'age', parseInt(e.target.value) || 25)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Gender</label>
                      <select
                        value={traveler.gender}
                        onChange={(e) => updateTravelerInfo(idx, 'gender', e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Travel Schedule & Logistics */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Departure Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Select Departure Date</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {departureDates.map((dateStr) => {
                    const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                            : 'bg-[#121c32] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm">{formattedDate}</p>
                          <span className="text-[11px] text-slate-400">Guaranteed Departure</span>
                        </div>
                        <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-700'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pickup Location Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Complimentary Pickup Location</span>
                </label>
                <select
                  value={selectedPickup}
                  onChange={(e) => setSelectedPickup(e.target.value)}
                  className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5">
                  A private air-conditioned chauffeur will meet you with an AuraVoyage welcome placard.
                </p>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Special Requirements or Celebrations (Optional)
                </label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Vegetarian/Jain cuisine, anniversary cake arrangement, ground-floor room for senior citizen..."
                  className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Cost Breakdown & Payment Summary */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Tour Overview Snippet */}
              <div className="flex gap-4 p-4 bg-[#121c32] rounded-2xl border border-slate-800">
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {tour.destinationName} • {tour.durationDays}D / {tour.durationNights}N
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{tour.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Departure: <strong className="text-slate-200">{selectedDate}</strong> • Pickup: {selectedPickup}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Travelers: <strong className="text-slate-200">{numTravelers} Guests</strong>
                  </p>
                </div>
              </div>

              {/* Transparent Price Breakdown */}
              <div className="bg-[#0e172a] rounded-2xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  Fare & Tax Breakdown
                </h4>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Package Base Price (₹{(tour.pricePerPerson ?? 0).toLocaleString('en-IN')} × {numTravelers})</span>
                  <span className="font-semibold text-white">₹{(basePrice ?? 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-300">
                  <span>Goods & Services Tax (GST 5%) + Luxury Tourism Cess</span>
                  <span className="font-semibold text-white">₹{(taxesAndFees ?? 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Complimentary Private Chauffeur & Welcome Kit</span>
                  <span className="font-semibold">₹0 (Included)</span>
                </div>

                <div className="pt-3 border-t border-slate-700 flex justify-between items-baseline">
                  <div>
                    <p className="text-xs text-slate-400">Total Payable</p>
                    <p className="text-xl font-bold text-emerald-400 font-display">
                      ₹{(totalAmount ?? 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400">All taxes & permits included</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'HDFC Infinia Credit Card',
                    'UPI Instant Payment',
                    'Corporate NetBanking',
                  ].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                        paymentMethod === method
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-[#121c32] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1 text-emerald-400" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Screen */}
          {step === 4 && confirmedBookingData && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Payment Verified • Vouchers Issued
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Your Journey Awaits!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                  Confirmation and travel itinerary sent to <strong className="text-white">{confirmedBookingData.customerEmail}</strong>.
                </p>
              </div>

              {/* Booking Reference Card */}
              <div className="max-w-md mx-auto bg-[#121c32] rounded-2xl p-5 border border-slate-800 text-left space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-xs">Booking ID</span>
                  <span className="font-mono font-bold text-emerald-400">{confirmedBookingData.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-xs">Primary Guest</span>
                  <span className="font-medium text-white">{confirmedBookingData.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-xs">Tour Package</span>
                  <span className="font-medium text-white truncate max-w-[220px]">{confirmedBookingData.tourTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-xs">Departure Date</span>
                  <span className="font-medium text-white">{confirmedBookingData.travelDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 text-xs">Guests</span>
                  <span className="font-medium text-white">{confirmedBookingData.travelersCount} Travelers</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400 text-xs">Total Amount Paid</span>
                  <span className="font-bold text-emerald-400 text-base">₹{(confirmedBookingData.totalAmount ?? 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="booking-confirm-view-invoice-btn"
                  onClick={() => {
                    closeBookingModal();
                    openInvoiceModal(confirmedBookingData);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download Invoice</span>
                </button>

                <button
                  id="booking-confirm-view-my-booking-btn"
                  onClick={() => {
                    closeBookingModal();
                    setCurrentView('my-bookings');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span>View My Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#09101f] border-t border-slate-800 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs sm:text-sm font-semibold transition-colors min-h-[44px] active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                id="booking-step-next-button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/30 transition-all min-h-[44px] active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="booking-step-pay-confirm-button"
                onClick={handleConfirmBooking}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all min-h-[44px] active:scale-95 text-center"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">Authorize ₹{(totalAmount ?? 0).toLocaleString('en-IN')}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
