import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, Compass, ShieldCheck, CheckCircle, MapPin, Calendar, Users } from 'lucide-react';
import { Booking } from '../types';

export const InvoiceModal: React.FC = () => {
  const { invoiceModalBooking, closeInvoiceModal } = useApp();

  if (!invoiceModalBooking) return null;

  const booking: Booking = invoiceModalBooking;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden invoice-card my-6">
        
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Tax Invoice & Travel Voucher
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-300">{booking.invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              id="close-invoice-modal-btn"
              onClick={closeInvoiceModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 space-y-8 bg-white">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <h1 className="font-display font-bold text-xl text-slate-900 tracking-wider">
                  AURAVOYAGE
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                AuraVoyage Luxury Travel & Tourism Management Ltd.<br />
                Prestige Trade Tower, Palace Road, Bengaluru 560001<br />
                GSTIN: 29AABCA1234F1Z8 • Ministry of Tourism Lic. #TO-2026-IND
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full mb-1">
                {booking.status.toUpperCase()}
              </span>
              <p className="text-xs text-slate-500">Invoice: <strong className="text-slate-800 font-mono">{booking.invoiceNumber}</strong></p>
              <p className="text-xs text-slate-500">Booking Ref: <strong className="text-slate-800 font-mono">{booking.id}</strong></p>
              <p className="text-xs text-slate-500">Date of Issue: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Billed To & Journey Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                Billed To (Primary Traveler)
              </p>
              <h3 className="text-sm font-bold text-slate-900">{booking.customerName}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{booking.customerEmail}</p>
              <p className="text-xs text-slate-600">{booking.customerPhone}</p>
              <p className="text-xs text-slate-600 mt-1">
                Pickup: <strong className="text-slate-800">{booking.pickupLocation}</strong>
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                Journey Particulars
              </p>
              <h3 className="text-sm font-bold text-slate-900">{booking.tourTitle}</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Destination: <strong className="text-slate-800">{booking.destinationName}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Departure Date: <strong className="text-slate-800">{booking.travelDate}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Duration: {booking.durationDays} Days / {booking.durationNights} Nights
              </p>
            </div>
          </div>

          {/* Guest Manifest */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              Registered Guest Manifest ({booking.travelersCount} Travelers)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="py-2 px-3 rounded-l-lg">#</th>
                    <th className="py-2 px-3">Traveler Name</th>
                    <th className="py-2 px-3">Age</th>
                    <th className="py-2 px-3 rounded-r-lg">Gender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(booking.travelerDetails || []).map((t, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{t.name}</td>
                      <td className="py-2 px-3 text-slate-600">{t.age}</td>
                      <td className="py-2 px-3 text-slate-600">{t.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Ledger */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              Financial Summary
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-50 flex justify-between text-xs font-semibold text-slate-600 border-b border-slate-200">
                <span>Description</span>
                <span>Amount (INR)</span>
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Tour Package Base (₹{(booking.pricePerPerson ?? 0).toLocaleString('en-IN')} × {booking.travelersCount} guests)</span>
                  <span className="font-semibold text-slate-900">₹{(booking.basePrice ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Goods & Services Tax (GST @ 5%) + Luxury Tourism Fund</span>
                  <span className="font-semibold text-slate-900">₹{(booking.taxesAndFees ?? 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Complimentary Executive Chauffeur & Welcome Hamper</span>
                  <span>Included</span>
                </div>
              </div>
              <div className="p-4 bg-slate-100 flex justify-between items-center border-t border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total Paid in Full</span>
                  <span className="text-[11px] text-slate-500">Method: {booking.paymentMethod}</span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-display">
                  ₹{(booking.totalAmount ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>
              <p className="text-[11px] leading-relaxed">
                Thank you for traveling with <strong>AuraVoyage</strong>.<br />
                24x7 Traveler Helpline: +91 80 4099 8800 • concierge@auravoyage.com
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-28 h-10 border-b border-slate-400 mx-auto sm:ml-auto mb-1 flex items-end justify-center">
                <span className="font-serif italic text-emerald-700 text-sm font-semibold">Alex Vance</span>
              </div>
              <p className="text-[10px] text-slate-400">Authorized Signatory • AuraVoyage</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
