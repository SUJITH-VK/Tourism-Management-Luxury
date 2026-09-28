import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { BookingModal } from './components/BookingModal';
import { InvoiceModal } from './components/InvoiceModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MobileBottomNav } from './components/MobileBottomNav';

// Views
import { HomeView } from './views/HomeView';
import { ToursListView } from './views/ToursListView';
import { TourDetailView } from './views/TourDetailView';
import { DestinationsView } from './views/DestinationsView';
import { MyBookingsView } from './views/MyBookingsView';
import { WishlistView } from './views/WishlistView';
import { CustomerProfileView } from './views/CustomerProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainLayout: React.FC = () => {
  const { currentView, setGlobalSearchOpen } = useApp();

  // Keyboard shortcut: Cmd+K / Ctrl+K opens global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGlobalSearchOpen]);

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'tours':
        return <ToursListView />;
      case 'tour-detail':
        return <TourDetailView />;
      case 'destinations':
        return <DestinationsView />;
      case 'my-bookings':
        return <MyBookingsView />;
      case 'wishlist':
        return <WishlistView />;
      case 'profile':
        return <CustomerProfileView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-emerald-500 selection:text-black pb-16 md:pb-0">
      {/* Top Luxury Navigation */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav />

      {/* PWA In-App Install Prompt Banner */}
      <PWAInstallBanner />

      {/* Global Interactive Modals & Drawers */}
      <BookingModal />
      <InvoiceModal />
      <AiAssistantDrawer />
      <GlobalSearchModal />
      <NotificationDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

