export type UserRole = 'customer' | 'admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  membershipTier: 'Silver' | 'Gold' | 'Platinum' | 'Crown Elite';
  memberSince: string;
}

export interface DestinationWeather {
  temp: string;
  condition?: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  country: string;
  state?: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  tourCount: number;
  bestSeason: string;
  bestTimeToVisit?: string;
  climate: string;
  weather?: DestinationWeather;
  tags: string[];
  highlights?: string[];
  altitude?: string;
  isPopular?: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  stay?: string;
  accommodation?: string;
  activities: string[];
}

export type TourCategory = 
  | 'Hill Station & Nature' 
  | 'Cultural Heritage' 
  | 'Luxury Beach & Coastal' 
  | 'Wilderness & Safari' 
  | 'Honeymoon Romantic' 
  | 'International Explorer'
  | 'Family Luxury'
  | 'Hill Station'
  | 'Heritage & Culture'
  | 'Luxury Wellness'
  | 'Adventure'
  | string;

export type TourDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Easy to Moderate';

export interface TourPackageReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  region?: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  originalPrice?: number;
  rating: number;
  reviewsCount?: number;
  reviewCount?: number;
  availableSeats: number;
  totalSeats: number;
  coverImage: string;
  galleryImages?: string[];
  gallery?: string[];
  category: TourCategory;
  difficulty: TourDifficulty;
  groupSize?: string;
  bestSeason?: string;
  overview?: string;
  shortDescription?: string;
  longDescription?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  departureDates: string[];
  pickupLocations: string[];
  isFeatured?: boolean;
  badge?: string;
  reviews?: TourPackageReview[];
}

export interface TravelerInfo {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourId: string;
  tourTitle: string;
  destinationName: string;
  coverImage: string;
  travelDate: string;
  durationDays: number;
  durationNights: number;
  travelersCount: number;
  travelerDetails: TravelerInfo[];
  pickupLocation: string;
  specialRequirements?: string;
  pricePerPerson: number;
  basePrice: number;
  taxesAndFees: number; // 5% GST + service fee
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  country: string;
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  status: 'active' | 'vip' | 'inactive';
  favoriteDestinations: string[];
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'system' | 'offer' | 'alert';
  read: boolean;
  link?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    tourId?: string;
    view?: string;
  };
}

export interface SearchFilterState {
  searchQuery: string;
  destination: string;
  category: string;
  duration: string;
  priceRange: number;
  difficulty: string;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'duration';
  availableOnly: boolean;
}
