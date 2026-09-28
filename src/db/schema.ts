import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  doublePrecision, 
  boolean, 
  timestamp, 
  jsonb 
} from 'drizzle-orm/pg-core';
import type { 
  DestinationWeather, 
  ItineraryDay, 
  TourPackageReview, 
  TravelerInfo 
} from '../types.ts';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  phone: text('phone'),
  avatar: text('avatar'),
  role: text('role').default('customer'),
  membershipTier: text('membership_tier').default('Silver'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Destinations Table
export const destinations = pgTable('destinations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  region: text('region').notNull(),
  country: text('country').notNull(),
  state: text('state'),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  heroImage: text('hero_image').notNull(),
  gallery: jsonb('gallery').$type<string[]>().default([]),
  startingPrice: integer('starting_price').notNull(),
  rating: doublePrecision('rating').notNull(),
  reviewsCount: integer('reviews_count').default(0),
  tourCount: integer('tour_count').default(0),
  bestSeason: text('best_season').notNull(),
  bestTimeToVisit: text('best_time_to_visit'),
  climate: text('climate').notNull(),
  weather: jsonb('weather').$type<DestinationWeather>(),
  tags: jsonb('tags').$type<string[]>().default([]),
  highlights: jsonb('highlights').$type<string[]>().default([]),
  altitude: text('altitude'),
  isPopular: boolean('is_popular').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Tour Packages Table
export const tours = pgTable('tours', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  destinationId: text('destination_id')
    .notNull()
    .references(() => destinations.id),
  destinationName: text('destination_name').notNull(),
  region: text('region'),
  durationDays: integer('duration_days').notNull(),
  durationNights: integer('duration_nights').notNull(),
  pricePerPerson: integer('price_per_person').notNull(),
  originalPrice: integer('original_price'),
  rating: doublePrecision('rating').notNull(),
  reviewsCount: integer('reviews_count').default(0),
  availableSeats: integer('available_seats').notNull(),
  totalSeats: integer('total_seats').notNull(),
  coverImage: text('cover_image').notNull(),
  gallery: jsonb('gallery').$type<string[]>().default([]),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  groupSize: text('group_size'),
  bestSeason: text('best_season'),
  overview: text('overview'),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  highlights: jsonb('highlights').$type<string[]>().default([]),
  inclusions: jsonb('inclusions').$type<string[]>().default([]),
  exclusions: jsonb('exclusions').$type<string[]>().default([]),
  itinerary: jsonb('itinerary').$type<ItineraryDay[]>().default([]),
  departureDates: jsonb('departure_dates').$type<string[]>().default([]),
  pickupLocations: jsonb('pickup_locations').$type<string[]>().default([]),
  isFeatured: boolean('is_featured').default(false),
  badge: text('badge'),
  reviews: jsonb('reviews').$type<TourPackageReview[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Bookings Table
export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  tourId: text('tour_id')
    .notNull()
    .references(() => tours.id),
  tourTitle: text('tour_title').notNull(),
  destinationName: text('destination_name').notNull(),
  coverImage: text('cover_image').notNull(),
  travelDate: text('travel_date').notNull(),
  durationDays: integer('duration_days').notNull(),
  durationNights: integer('duration_nights').notNull(),
  travelersCount: integer('travelers_count').notNull(),
  travelerDetails: jsonb('traveler_details').$type<TravelerInfo[]>().default([]),
  pickupLocation: text('pickup_location').notNull(),
  specialRequirements: text('special_requirements'),
  pricePerPerson: integer('price_per_person').notNull(),
  basePrice: integer('base_price').notNull(),
  taxesAndFees: integer('taxes_and_fees').notNull(),
  totalAmount: integer('total_amount').notNull(),
  status: text('status').notNull().default('confirmed'),
  paymentStatus: text('payment_status').notNull().default('paid'),
  paymentMethod: text('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Customers Table
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  avatar: text('avatar').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  totalBookings: integer('total_bookings').default(0),
  totalSpent: integer('total_spent').default(0),
  joinedDate: text('joined_date').notNull(),
  status: text('status').notNull().default('active'),
  favoriteDestinations: jsonb('favorite_destinations').$type<string[]>().default([]),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Notifications Table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  timestamp: text('timestamp').notNull(),
  type: text('type').notNull().default('system'),
  read: boolean('read').notNull().default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. Wishlist Items Table
export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  tourId: text('tour_id')
    .notNull()
    .references(() => tours.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const destinationsRelations = relations(destinations, ({ many }) => ({
  tours: many(tours),
}));

export const toursRelations = relations(tours, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [tours.destinationId],
    references: [destinations.id],
  }),
  bookings: many(bookings),
  wishlistItems: many(wishlistItems),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  tour: one(tours, {
    fields: [bookings.tourId],
    references: [tours.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  tour: one(tours, {
    fields: [wishlistItems.tourId],
    references: [tours.id],
  }),
}));
