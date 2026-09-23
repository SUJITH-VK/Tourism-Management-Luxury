import React, { createContext, useContext, useState, useEffect } from 'react';
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
} from '../types';
import { 
  INITIAL_USER, 
  ADMIN_USER, 
  INITIAL_DESTINATIONS, 
  INITIAL_TOURS, 
  INITIAL_BOOKINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

interface AppContextType {
  currentUser: UserSession;
  role: UserRole;
  switchUser: (newRole: UserRole) => void;
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

  // Collections
  const [tours, setTours] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem('auravoyage_tours');
    return saved ? JSON.parse(saved) : INITIAL_TOURS;
  });

  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);

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

  // Sync to local storage
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

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => 
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

  // Create booking
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
          return {
            ...t,
            availableSeats: Math.max(0, t.availableSeats - data.travelersCount),
          };
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
          return {
            ...c,
            totalBookings: c.totalBookings + 1,
            totalSpent: c.totalSpent + data.totalAmount,
          };
        }
        return c;
      })
    );

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
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

    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      // restore seats
      setTours((prev) =>
        prev.map((t) => {
          if (t.id === booking.tourId) {
            return {
              ...t,
              availableSeats: Math.min(t.totalSeats, t.availableSeats + booking.travelersCount),
            };
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

  // Tour management
  const addTour = (tourData: Omit<TourPackage, 'id'>): TourPackage => {
    const newId = `tour-custom-${Date.now()}`;
    const newTour: TourPackage = {
      ...tourData,
      id: newId,
    };
    setTours((prev) => [newTour, ...prev]);
    return newTour;
  };

  const updateTour = (tourId: string, updatedData: Partial<TourPackage>) => {
    setTours((prev) =>
      prev.map((t) => (t.id === tourId ? { ...t, ...updatedData } : t))
    );
  };

  const deleteTour = (tourId: string) => {
    setTours((prev) => prev.filter((t) => t.id !== tourId));
  };

  const updateUserProfile = (data: Partial<UserSession>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        switchUser,
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
