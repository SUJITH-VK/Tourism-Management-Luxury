import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserRole, 
  UserSession, 
  Destination, 
  TourPackage, 
  Booking, 
  CustomerProfile, 
  AppNotification, 
  SearchFilterState, 
  BookingStatus 
} from '../types.ts';
import { 
  INITIAL_USER, 
  ADMIN_USER, 
  INITIAL_DESTINATIONS, 
  INITIAL_TOURS, 
  INITIAL_BOOKINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData.ts';

interface AppContextType {
  currentUser: UserSession;
  role: UserRole;
  switchUser: (newRole: UserRole) => void;
  setCurrentUserDirectly: (user: UserSession) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedTour: TourPackage | null;
  viewTourDetails: (tourId: string) => void;
  selectedDestination: Destination | null;
  viewDestinationDetails: (destId: string) => void;
  tours: TourPackage[];
  destinations: Destination[];
  bookings: Booking[];
  customers: CustomerProfile[];
  wishlist: string[];
  notifications: AppNotification[];
  toggleWishlist: (tourOrDestId: string) => void;
  isWishlisted: (id: string) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  
  // Modals & Drawers
  bookingModalTour: TourPackage | null;
  openBookingModal: (tour: TourPackage) => void;
  closeBookingModal: () => void;
  
  invoiceModalBooking: Booking | null;
  openInvoiceModal: (booking: Booking) => void;
  closeInvoiceModal: () => void;

  isAiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;

  isGlobalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;

  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;

  // Booking actions
  createBooking: (newBooking: Omit<Booking, 'id' | 'invoiceNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;

  // Tour management (Admin)
  addTour: (tourData: Omit<TourPackage, 'id'>) => TourPackage;
  updateTour: (tourId: string, updatedData: Partial<TourPackage>) => void;
  deleteTour: (tourId: string) => void;

  // Filter state
  filterState: SearchFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  resetFilters: () => void;

  // User Profile
  updateUserProfile: (profileData: Partial<UserSession>) => void;

  // Cloud SQL Database synchronization
  isDbConnected: boolean;
  refreshFromDatabase: () => Promise<void>;
}

const defaultFilterState: SearchFilterState = {
  searchQuery: '',
  destination: '',
  category: '',
  duration: '',
  priceRange: 60000,
  difficulty: '',
  sortBy: 'recommended',
  availableOnly: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & role
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    const saved = localStorage.getItem('auravoyage_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const role: UserRole = currentUser.role;

  // Views & Routing
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  // Collections (initialized with fallbacks, synced live with Cloud SQL)
  const [tours, setTours] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem('auravoyage_tours');
    return saved ? JSON.parse(saved) : INITIAL_TOURS;
  });

  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('auravoyage_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('auravoyage_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('auravoyage_wishlist');
    return saved ? JSON.parse(saved) : ['tour-ooty-01', 'tour-kerala-01'];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('auravoyage_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Modal states
  const [bookingModalTour, setBookingModalTour] = useState<TourPackage | null>(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<Booking | null>(null);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isGlobalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Search and filters
  const [filterState, setFilterState] = useState<SearchFilterState>(defaultFilterState);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('auravoyage_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('auravoyage_tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('auravoyage_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('auravoyage_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('auravoyage_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('auravoyage_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize with Cloud SQL PostgreSQL Database
  const refreshFromDatabase = useCallback(async () => {
    try {
      // 1. Destinations
      const destRes = await fetch('/api/destinations');
      if (destRes.ok) {
        const data = await destRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      }

      // 2. Tours
      const toursRes = await fetch('/api/tours');
      if (toursRes.ok) {
        const data = await toursRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setTours(data);
        }
      }

      // 3. Bookings
      const bkgRes = await fetch('/api/bookings');
      if (bkgRes.ok) {
        const data = await bkgRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data);
        }
      }

      // 4. Customers
      const custRes = await fetch('/api/customers');
      if (custRes.ok) {
        const data = await custRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      }

      // 5. Notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const data = await notifRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        }
      }

      // 6. User Wishlist
      if (currentUser?.id) {
        const wishRes = await fetch(`/api/wishlist/${encodeURIComponent(currentUser.id)}`);
        if (wishRes.ok) {
          const data = await wishRes.json();
          if (Array.isArray(data)) {
            setWishlist(data);
          }
        }
      }

      setIsDbConnected(true);
    } catch (err) {
      console.warn('Database live sync warning (using cached data):', err);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    refreshFromDatabase();
  }, [refreshFromDatabase]);

  // Derived selected items
  const selectedTour = tours.find((t) => t.id === selectedTourId) || null;
  const selectedDestination = destinations.find((d) => d.id === selectedDestinationId) || null;

  const viewTourDetails = (tourId: string) => {
    setSelectedTourId(tourId);
    setCurrentView('tour-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewDestinationDetails = (destId: string) => {
    setSelectedDestinationId(destId);
    setFilterState((prev) => ({ ...prev, destination: destId }));
    setCurrentView('tours');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchUser = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setCurrentUser(ADMIN_USER);
      setCurrentView('admin-dashboard');
    } else {
      setCurrentUser(INITIAL_USER);
      setCurrentView('home');
    }
  };

  const setCurrentUserDirectly = (user: UserSession) => {
    setCurrentUser(user);
    // sync with backend
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      }),
    }).catch((e) => console.error('Failed to sync user to database:', e));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (currentUser?.id) {
      fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, tourId: id }),
      }).catch((e) => console.error('Failed to toggle wishlist in database:', e));
    }
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => 
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    fetch(`/api/notifications/${id}/read`, { method: 'PATCH' }).catch((e) =>
      console.error('Failed to mark notification read in database:', e)
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch('/api/notifications/read-all', { method: 'POST' }).catch((e) =>
      console.error('Failed to mark all notifications read in database:', e)
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const openBookingModal = (tour: TourPackage) => {
    setBookingModalTour(tour);
  };

  const closeBookingModal = () => {
    setBookingModalTour(null);
  };

  const openInvoiceModal = (booking: Booking) => {
    setInvoiceModalBooking(booking);
  };

  const closeInvoiceModal = () => {
    setInvoiceModalBooking(null);
  };

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  // Create booking (persists to PostgreSQL)
  const createBooking = (data: Omit<Booking, 'id' | 'invoiceNumber' | 'createdAt'>): Booking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `AV-${randomNum}`;
    const invoiceNum = `INV-2026-${randomNum}`;
    const newBooking: Booking = {
      ...data,
      id: newId,
      invoiceNumber: invoiceNum,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update tour available seats
    setTours((prev) =>
      prev.map((t) => {
        if (t.id === data.tourId) {
          const updated = {
            ...t,
            availableSeats: Math.max(0, t.availableSeats - data.travelersCount),
          };
          // Persist tour seat update
          fetch(`/api/tours/${t.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch((err) => console.error('Failed to sync seat update:', err));
          return updated;
        }
        return t;
      })
    );

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Booking Confirmed • ${newBooking.tourTitle}`,
      message: `Your reservation for ${newBooking.travelersCount} guest(s) on ${newBooking.travelDate} has been confirmed. Booking ID: ${newId}.`,
      timestamp: 'Just now',
      type: 'booking',
      read: false,
      link: 'my-bookings',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === data.customerId) {
          const updated = {
            ...c,
            totalBookings: c.totalBookings + 1,
            totalSpent: c.totalSpent + data.totalAmount,
          };
          fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch((err) => console.error('Failed to sync customer stats:', err));
          return updated;
        }
        return c;
      })
    );

    // Persist booking to PostgreSQL
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch((err) => console.error('Failed to save booking to database:', err));

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update booking status in database:', err));
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: 'cancelled' as BookingStatus, paymentStatus: 'refunded' as const };
        }
        return b;
      })
    );

    fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    }).catch((err) => console.error('Failed to cancel booking in database:', err));

    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      // restore seats
      setTours((prev) =>
        prev.map((t) => {
          if (t.id === booking.tourId) {
            const restored = {
              ...t,
              availableSeats: Math.min(t.totalSeats, t.availableSeats + booking.travelersCount),
            };
            fetch(`/api/tours/${t.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(restored),
            }).catch((err) => console.error('Failed to restore seats:', err));
            return restored;
          }
          return t;
        })
      );

      // add notification
      const cancelNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Booking Cancelled • ${booking.id}`,
        message: `Booking ${booking.id} for ${booking.tourTitle} has been cancelled and refund initiated.`,
        timestamp: 'Just now',
        type: 'alert',
        read: false,
      };
      setNotifications((prev) => [cancelNotif, ...prev]);
    }
  };

  // Tour management (Admin)
  const addTour = (tourData: Omit<TourPackage, 'id'>): TourPackage => {
    const newId = `tour-custom-${Date.now()}`;
    const newTour: TourPackage = {
      ...tourData,
      id: newId,
    };
    setTours((prev) => [newTour, ...prev]);

    fetch('/api/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTour),
    }).catch((err) => console.error('Failed to add tour to database:', err));

    return newTour;
  };

  const updateTour = (tourId: string, updatedData: Partial<TourPackage>) => {
    setTours((prev) =>
      prev.map((t) => (t.id === tourId ? { ...t, ...updatedData } : t))
    );

    fetch(`/api/tours/${tourId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    }).catch((err) => console.error('Failed to update tour in database:', err));
  };

  const deleteTour = (tourId: string) => {
    setTours((prev) => prev.filter((t) => t.id !== tourId));

    fetch(`/api/tours/${tourId}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete tour from database:', err));
  };

  const updateUserProfile = (data: Partial<UserSession>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: updated.id,
          email: updated.email,
          name: updated.name,
          phone: updated.phone,
          avatar: updated.avatar,
          role: updated.role,
        }),
      }).catch((err) => console.error('Failed to sync profile update:', err));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        switchUser,
        setCurrentUserDirectly,
        currentView,
        setCurrentView,
        selectedTour,
        viewTourDetails,
        selectedDestination,
        viewDestinationDetails,
        tours,
        destinations,
        bookings,
        customers,
        wishlist,
        notifications,
        toggleWishlist,
        isWishlisted,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        bookingModalTour,
        openBookingModal,
        closeBookingModal,
        invoiceModalBooking,
        openInvoiceModal,
        closeInvoiceModal,
        isAiAssistantOpen,
        setAiAssistantOpen,
        isGlobalSearchOpen,
        setGlobalSearchOpen,
        isNotificationsOpen,
        setNotificationsOpen,
        isAuthModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        addTour,
        updateTour,
        deleteTour,
        filterState,
        setFilterState,
        resetFilters,
        updateUserProfile,
        isDbConnected,
        refreshFromDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
