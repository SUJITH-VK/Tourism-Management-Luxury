import fs from 'fs';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_TOURS, 
  INITIAL_BOOKINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER, 
  ADMIN_USER 
} from '../src/data/initialData.ts';

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function jsonSql(obj: any): string {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

let sql = `-- ====================================================================
-- SUPABASE POSTGRESQL MIGRATION SCHEMA & COMPLETE SEED DATA
-- Project: AuraVoyage - AI Tourism Management System
-- Generated for Supabase SQL Editor / Supabase CLI Migrations
-- Run this in your Supabase Dashboard -> SQL Editor -> Click "RUN"
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar TEXT,
  role TEXT DEFAULT 'customer',
  membership_tier TEXT DEFAULT 'Silver',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Destinations Table
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
  starting_price INTEGER NOT NULL,
  rating DOUBLE PRECISION NOT NULL,
  reviews_count INTEGER DEFAULT 0,
  tour_count INTEGER DEFAULT 0,
  best_season TEXT NOT NULL,
  best_time_to_visit TEXT,
  climate TEXT NOT NULL,
  weather JSONB,
  tags JSONB DEFAULT '[]'::jsonb NOT NULL,
  highlights JSONB DEFAULT '[]'::jsonb NOT NULL,
  altitude TEXT,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tour Packages Table
CREATE TABLE IF NOT EXISTS public.tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  destination_id TEXT NOT NULL REFERENCES public.destinations(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  destination_name TEXT NOT NULL,
  region TEXT,
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price_per_person INTEGER NOT NULL,
  original_price INTEGER,
  rating DOUBLE PRECISION NOT NULL,
  reviews_count INTEGER DEFAULT 0,
  available_seats INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  cover_image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  group_size TEXT,
  best_season TEXT,
  overview TEXT,
  short_description TEXT,
  long_description TEXT,
  highlights JSONB DEFAULT '[]'::jsonb NOT NULL,
  inclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  exclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  itinerary JSONB DEFAULT '[]'::jsonb NOT NULL,
  departure_dates JSONB DEFAULT '[]'::jsonb NOT NULL,
  pickup_locations JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  badge TEXT,
  reviews JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  tour_id TEXT NOT NULL REFERENCES public.tours(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  tour_title TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  travel_date TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  travelers_count INTEGER NOT NULL,
  traveler_details JSONB DEFAULT '[]'::jsonb NOT NULL,
  pickup_location TEXT NOT NULL,
  special_requirements TEXT,
  price_per_person INTEGER NOT NULL,
  base_price INTEGER NOT NULL,
  taxes_and_fees INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'confirmed' NOT NULL,
  payment_status TEXT DEFAULT 'paid' NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  avatar TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  joined_date TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  favorite_destinations JSONB DEFAULT '[]'::jsonb NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT DEFAULT 'system' NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Wishlist Items Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  tour_id TEXT NOT NULL REFERENCES public.tours(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tours_destination_id ON public.tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Row Level Security (RLS)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Permissive RLS policies for demo/application usage
DROP POLICY IF EXISTS "Public select destinations" ON public.destinations;
CREATE POLICY "Public select destinations" ON public.destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select tours" ON public.tours;
CREATE POLICY "Public select tours" ON public.tours FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select bookings" ON public.bookings;
CREATE POLICY "Public select bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select customers" ON public.customers;
CREATE POLICY "Public select customers" ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select notifications" ON public.notifications;
CREATE POLICY "Public select notifications" ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select wishlist" ON public.wishlist_items;
CREATE POLICY "Public select wishlist" ON public.wishlist_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access to bookings" ON public.bookings;
CREATE POLICY "Full access to bookings" ON public.bookings FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access to tours" ON public.tours;
CREATE POLICY "Full access to tours" ON public.tours FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access to destinations" ON public.destinations;
CREATE POLICY "Full access to destinations" ON public.destinations FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access to customers" ON public.customers;
CREATE POLICY "Full access to customers" ON public.customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access to notifications" ON public.notifications;
CREATE POLICY "Full access to notifications" ON public.notifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access to wishlist" ON public.wishlist_items;
CREATE POLICY "Full access to wishlist" ON public.wishlist_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Full access to users" ON public.users;
CREATE POLICY "Full access to users" ON public.users FOR ALL USING (true);

-- ====================================================================
-- SEED DATA INSERTION
-- ====================================================================

-- 1. Initial Users
INSERT INTO public.users (uid, email, name, phone, avatar, role, membership_tier)
VALUES
(${escapeSql(INITIAL_USER.id)}, ${escapeSql(INITIAL_USER.email)}, ${escapeSql(INITIAL_USER.name)}, ${escapeSql(INITIAL_USER.phone)}, ${escapeSql(INITIAL_USER.avatar)}, ${escapeSql(INITIAL_USER.role)}, 'Gold'),
(${escapeSql(ADMIN_USER.id)}, ${escapeSql(ADMIN_USER.email)}, ${escapeSql(ADMIN_USER.name)}, ${escapeSql(ADMIN_USER.phone)}, ${escapeSql(ADMIN_USER.avatar)}, ${escapeSql(ADMIN_USER.role)}, 'Platinum')
ON CONFLICT (uid) DO NOTHING;

-- 2. Initial Destinations
`;

for (const d of INITIAL_DESTINATIONS) {
  sql += `INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  ${escapeSql(d.id)},
  ${escapeSql(d.name)},
  ${escapeSql(d.region)},
  ${escapeSql(d.country)},
  ${escapeSql(d.state || null)},
  ${escapeSql(d.tagline)},
  ${escapeSql(d.description)},
  ${escapeSql(d.heroImage)},
  ${jsonSql(d.gallery || [])},
  ${d.startingPrice},
  ${d.rating},
  ${d.reviewsCount || 0},
  ${d.tourCount || 0},
  ${escapeSql(d.bestSeason)},
  ${escapeSql(d.bestTimeToVisit || null)},
  ${escapeSql(d.climate)},
  ${jsonSql(d.weather || null)},
  ${jsonSql(d.tags || [])},
  ${jsonSql(d.highlights || [])},
  ${escapeSql(d.altitude || null)},
  ${d.isPopular ? 'true' : 'false'}
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
`;
}

sql += `\n-- 3. Initial Tours\n`;
for (const t of INITIAL_TOURS) {
  sql += `INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  ${escapeSql(t.id)},
  ${escapeSql(t.title)},
  ${escapeSql(t.destinationId)},
  ${escapeSql(t.destinationName)},
  ${escapeSql(t.region || null)},
  ${t.durationDays},
  ${t.durationNights},
  ${t.pricePerPerson},
  ${t.originalPrice || 'NULL'},
  ${t.rating},
  ${t.reviewsCount || 0},
  ${t.availableSeats},
  ${t.totalSeats},
  ${escapeSql(t.coverImage)},
  ${jsonSql(t.gallery || [])},
  ${escapeSql(t.category)},
  ${escapeSql(t.difficulty)},
  ${escapeSql(t.groupSize || null)},
  ${escapeSql(t.bestSeason || null)},
  ${escapeSql(t.overview || null)},
  ${escapeSql(t.shortDescription || null)},
  ${escapeSql(t.longDescription || null)},
  ${jsonSql(t.highlights || [])},
  ${jsonSql(t.inclusions || [])},
  ${jsonSql(t.exclusions || [])},
  ${jsonSql(t.itinerary || [])},
  ${jsonSql(t.departureDates || [])},
  ${jsonSql(t.pickupLocations || [])},
  ${t.isFeatured ? 'true' : 'false'},
  ${escapeSql(t.badge || null)},
  ${jsonSql(t.reviews || [])}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
`;
}

sql += `\n-- 4. Initial Bookings\n`;
for (const b of INITIAL_BOOKINGS) {
  sql += `INSERT INTO public.bookings (id, invoice_number, customer_id, customer_name, customer_email, customer_phone, tour_id, tour_title, destination_name, cover_image, travel_date, duration_days, duration_nights, travelers_count, traveler_details, pickup_location, special_requirements, price_per_person, base_price, taxes_and_fees, total_amount, status, payment_status, payment_method)
VALUES (
  ${escapeSql(b.id)},
  ${escapeSql(b.invoiceNumber)},
  ${escapeSql(b.customerId)},
  ${escapeSql(b.customerName)},
  ${escapeSql(b.customerEmail)},
  ${escapeSql(b.customerPhone)},
  ${escapeSql(b.tourId)},
  ${escapeSql(b.tourTitle)},
  ${escapeSql(b.destinationName)},
  ${escapeSql(b.coverImage)},
  ${escapeSql(b.travelDate)},
  ${b.durationDays},
  ${b.durationNights},
  ${b.travelersCount},
  ${jsonSql(b.travelerDetails || [])},
  ${escapeSql(b.pickupLocation)},
  ${escapeSql(b.specialRequirements || null)},
  ${b.pricePerPerson},
  ${b.basePrice},
  ${b.taxesAndFees},
  ${b.totalAmount},
  ${escapeSql(b.status)},
  ${escapeSql(b.paymentStatus)},
  ${escapeSql(b.paymentMethod)}
) ON CONFLICT (id) DO NOTHING;
`;
}

sql += `\n-- 5. Initial Customers\n`;
for (const c of INITIAL_CUSTOMERS) {
  sql += `INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  ${escapeSql(c.id)},
  ${escapeSql(c.name)},
  ${escapeSql(c.email)},
  ${escapeSql(c.phone)},
  ${escapeSql(c.avatar)},
  ${escapeSql(c.city)},
  ${escapeSql(c.country)},
  ${c.totalBookings || 0},
  ${c.totalSpent || 0},
  ${escapeSql(c.joinedDate)},
  ${escapeSql(c.status || 'active')},
  ${jsonSql(c.favoriteDestinations || [])},
  ${escapeSql(c.notes || null)}
) ON CONFLICT (email) DO NOTHING;
`;
}

sql += `\n-- 6. Initial Notifications\n`;
for (const n of INITIAL_NOTIFICATIONS) {
  sql += `INSERT INTO public.notifications (id, title, message, timestamp, type, read, link)
VALUES (
  ${escapeSql(n.id)},
  ${escapeSql(n.title)},
  ${escapeSql(n.message)},
  ${escapeSql(n.timestamp)},
  ${escapeSql(n.type)},
  ${n.read ? 'true' : 'false'},
  ${escapeSql(n.link || null)}
) ON CONFLICT (id) DO NOTHING;
`;
}

sql += `\n-- 7. Initial Wishlist Items\n`;
sql += `INSERT INTO public.wishlist_items (user_id, tour_id)
VALUES 
('usr-101', 'tour-ooty-01'),
('usr-101', 'tour-kerala-01')
ON CONFLICT DO NOTHING;
`;

fs.writeFileSync('./supabase/schema.sql', sql, 'utf8');
console.log('✓ Successfully generated /supabase/schema.sql with schema + complete seed data!');
