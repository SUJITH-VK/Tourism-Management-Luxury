import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Award, ShieldCheck, Heart, Luggage, Save, Check } from 'lucide-react';

export const CustomerProfileView: React.FC = () => {
  const { currentUser, updateUserProfile, bookings, wishlist } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [dietary, setDietary] = useState('Vegetarian / Organic');
  const [roomPreference, setRoomPreference] = useState('High Floor / Mountain View');
  const [emergencyContact, setEmergencyContact] = useState('Kavita Rao (+91 98860 12345)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const userBookings = bookings.filter((b) => b.customerId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
          <User className="w-4 h-4" />
          <span>Voyager Account</span>
        </div>
        <h1 className="text-3xl font-bold font-display text-white mt-1">
          Profile & Preferences
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal details, dietary choices, and emergency dispatch contacts
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 rounded-3xl object-cover ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950"
        />

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-white font-display">{currentUser.name}</h2>
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              {currentUser.membershipTier}
            </span>
          </div>
          <p className="text-xs text-slate-400">{currentUser.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-2">
            <span>Member since: <strong className="text-white">{currentUser.memberSince}</strong></span>
            <span>•</span>
            <span>Total Journeys: <strong className="text-emerald-400">{userBookings.length}</strong></span>
            <span>•</span>
            <span>Saved Wishlist: <strong className="text-rose-400">{wishlist.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <form onSubmit={handleSave} className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Personal & Contact Particulars</span>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Emergency Contact Person & Phone</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 pt-2">
          Hospitality Preferences (Applied automatically to bookings)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Dietary Preferences</label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Vegetarian / Organic">Vegetarian / Organic</option>
              <option value="Strict Jain Cuisine">Strict Jain Cuisine</option>
              <option value="Non-Vegetarian Continental">Non-Vegetarian Continental</option>
              <option value="Vegan / Plant-Based">Vegan / Plant-Based</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Room Allocation Preference</label>
            <select
              value={roomPreference}
              onChange={(e) => setRoomPreference(e.target.value)}
              className="w-full bg-[#121c32] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="High Floor / Mountain View">High Floor / Mountain View</option>
              <option value="Ground Floor / Accessible">Ground Floor / Accessible (Senior Citizen Friendly)</option>
              <option value="Colonial Cottage / Private Balcony">Colonial Cottage / Private Balcony</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
};
