-- ====================================================================
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
('usr-101', 'aditi.rao@voyage.luxury', 'Aditi Rao', '+91 98450 82194', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'customer', 'Gold'),
('admin-01', 'vikram.m@auravoyage.com', 'Vikram Malhotra', '+91 98110 54321', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'admin', 'Platinum')
ON CONFLICT (uid) DO NOTHING;

-- 2. Initial Destinations
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-ooty',
  'Ooty',
  'Nilgiris, Tamil Nadu',
  'India',
  'Tamil Nadu',
  'The Queen of Hill Stations in British Mist',
  'Perched at 2,240 meters amidst rolling tea gardens and eucalyptus groves, Ooty blends colonial heritage bungalows with crisp mountain breeze and the legendary UNESCO Nilgiri Toy Train.',
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  8499,
  4.85,
  342,
  4,
  'Oct - Jun',
  'Oct - Jun',
  '12°C - 20°C Mild Alpine',
  '{"temp":"15°C","condition":"Crisp Mist"}'::jsonb,
  '["Hill Station","Tea Estates","Heritage Train","Cool Climate"]'::jsonb,
  '["UNESCO Toy Train","Doddabetta Peak","Tea Factory High-Tea","Emerald Lake"]'::jsonb,
  '2,240 m',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-kodaikanal',
  'Kodaikanal',
  'Dindigul, Tamil Nadu',
  'India',
  'Tamil Nadu',
  'Princess of Hills Enveloped in Starry Pine Mist',
  'Set around a tranquil star-shaped lake, Kodaikanal captivates with dense cedar forests, cliffside viewpoints like Pillar Rocks, and serene lakeside cycling routes.',
  'https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  11999,
  4.9,
  289,
  3,
  'Sep - May',
  'Sep - May',
  '10°C - 18°C Pleasant',
  '{"temp":"14°C","condition":"Pine Mist"}'::jsonb,
  '["Honeymoon","Pine Forest","Boating","Waterfalls"]'::jsonb,
  '["Star Lake Boating","Pillar Rocks","Coakers Walk","Silver Cascade"]'::jsonb,
  '2,133 m',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-kerala',
  'Kerala',
  'God’s Own Country',
  'India',
  'Kerala',
  'Emerald Backwaters & High-Altitude Spice Hills',
  'Cruise tranquil palm-fringed canals on private luxury houseboats in Alleppey, breathe in Munnar’s mist-wrapped tea hills, and rejuvenate with ancient Ayurvedic therapies.',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  18999,
  4.95,
  512,
  5,
  'Sep - Mar',
  'Sep - Mar',
  '22°C - 30°C Tropical',
  '{"temp":"24°C","condition":"Tropical Breeze"}'::jsonb,
  '["Backwaters","Houseboat","Ayurveda","Spice Plantations"]'::jsonb,
  '["Private Houseboat","Munnar Tea Hills","Kathakali Performance","Ayurveda"]'::jsonb,
  'Sea Level to 1,600 m',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-coorg',
  'Coorg',
  'Kodagu, Karnataka',
  'India',
  'Karnataka',
  'Scotland of India Amidst Coffee Blossom Valleys',
  'Immerse yourself in verdant coffee estates, misty riverbanks where elephants bathe at Dubare, and royal twilight panoramas from Raja’s Seat.',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  9499,
  4.82,
  198,
  3,
  'Oct - Apr',
  'Oct - Apr',
  '15°C - 24°C Refreshing',
  '{"temp":"18°C","condition":"Coffee Mist"}'::jsonb,
  '["Coffee Trails","Waterfalls","Wildlife","Homestays"]'::jsonb,
  '["Coffee Plantation Safari","Abbey Falls","Dubare Elephant Camp","Rajas Seat"]'::jsonb,
  '1,525 m',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-goa',
  'Goa',
  'Konkan Coast',
  'India',
  'Goa',
  'Golden Sands, Portuguese Palaces & Sunset Catamarans',
  'Experience Goa beyond the ordinary: private luxury yachts cruising the Mandovi river, Portuguese colonial Latin Quarters of Fontainhas, and secluded South Goa luxury coves.',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  14500,
  4.88,
  460,
  4,
  'Nov - Apr',
  'Nov - Apr',
  '24°C - 31°C Coastal Breeze',
  '{"temp":"28°C","condition":"Coastal Sun"}'::jsonb,
  '["Luxury Beach","Yacht Cruises","Nightlife","Portuguese Heritage"]'::jsonb,
  '["Catamaran Sunset Cruise","Fontainhas Heritage Walk","Spice Plantation","Private Beach Lounge"]'::jsonb,
  'Sea Level',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-rajasthan',
  'Rajasthan',
  'Jaipur, Udaipur & Jodhpur',
  'India',
  'Rajasthan',
  'Imperial Fortresses, Desert Starscapes & Royal Havelis',
  'Walk the opulent corridors of Amber Palace, sail across the shimmering waters of Lake Pichola beneath floating palaces, and dine under desert constellations in Thar.',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  29999,
  4.96,
  620,
  5,
  'Oct - Mar',
  'Oct - Mar',
  '14°C - 28°C Desert Sun',
  '{"temp":"22°C","condition":"Desert Sun"}'::jsonb,
  '["Heritage Forts","Palaces","Desert Safari","Royal Dining"]'::jsonb,
  '["Amber Fort Elephant Walk","Lake Pichola Royal Boat","Thar Desert Safari","City Palace"]'::jsonb,
  'Varies',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-manali',
  'Manali',
  'Kullu Valley, Himachal Pradesh',
  'India',
  'Himachal Pradesh',
  'Snow-Crowned Alpine Passes & Himalayan Thrills',
  'Surrounded by towering deodar pine forests and snow-capped Himalayan peaks, Manali invites you to soar above Solang Valley and traverse high-altitude Rohtang Pass.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  16999,
  4.87,
  380,
  4,
  'Oct - Jun',
  'Oct - Jun',
  '-2°C - 18°C Alpine Snow',
  '{"temp":"8°C","condition":"Alpine Chill"}'::jsonb,
  '["Snow Peaks","Paragliding","River Rafting","Rohtang Pass"]'::jsonb,
  '["Solang Valley Gliding","Rohtang Pass Snow","Old Manali Cafes","Hadimba Temple"]'::jsonb,
  '2,050 m',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-kashmir',
  'Kashmir',
  'Srinagar, Gulmarg & Pahalgam',
  'India',
  'Jammu & Kashmir',
  'Heaven on Earth Across Glacial Valleys & Shikaras',
  'Awaken on an ornate carved cedar houseboat on Dal Lake, ride the world’s highest cable car at Gulmarg, and walk through fragrant saffron fields in Pampore.',
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  32500,
  4.98,
  470,
  3,
  'Apr - Oct & Dec - Feb',
  'Apr - Oct & Dec - Feb',
  '2°C - 20°C Crisp Valley',
  '{"temp":"11°C","condition":"Crisp Valley"}'::jsonb,
  '["Shikara Cruises","Gulmarg Gondola","Snow Skiing","Saffron"]'::jsonb,
  '["Dal Lake Shikara","Gulmarg High Gondola","Pahalgam Betaab Valley","Saffron Trail"]'::jsonb,
  '1,585 m - 3,980 m',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-dubai',
  'Dubai',
  'United Arab Emirates',
  'UAE',
  'Dubai',
  'Ultraluxury Oasis of Modern Architecture & Desert Dunes',
  'From VIP access to the world’s tallest tower to private mega-yacht charters and desert champagne safaris over golden dunes, Dubai redefines modern luxury.',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  48999,
  4.92,
  340,
  3,
  'Nov - Mar',
  'Nov - Mar',
  '20°C - 30°C Warm Oasis',
  '{"temp":"26°C","condition":"Warm Sun"}'::jsonb,
  '["Skyscrapers","VIP Desert Safari","Luxury Yachts","Fine Dining"]'::jsonb,
  '["Burj Khalifa At The Top","Red Dunes Desert Safari","Marina Luxury Yacht","Dubai Mall"]'::jsonb,
  'Sea Level',
  false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;
INSERT INTO public.destinations (id, name, region, country, state, tagline, description, hero_image, gallery, starting_price, rating, reviews_count, tour_count, best_season, best_time_to_visit, climate, weather, tags, highlights, altitude, is_popular)
VALUES (
  'dest-singapore',
  'Singapore',
  'Southeast Asia',
  'Singapore',
  'Singapore',
  'Biophilic Metropolis of Future Wonders & Michelin Stars',
  'Marvel at giant Supertrees glowing at twilight, step inside the world’s largest glass greenhouses, and savor world-renowned Michelin culinary experiences.',
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  54000,
  4.94,
  290,
  3,
  'All Year',
  'All Year',
  '26°C - 32°C Tropical Bloom',
  '{"temp":"29°C","condition":"Tropical"}'::jsonb,
  '["Gardens by the Bay","Marina Bay Sands","Universal Studios","Fine Dining"]'::jsonb,
  '["Supertree Grove","Marina Bay Sands SkyPark","Cloud Forest","Changi Jewel"]'::jsonb,
  'Sea Level',
  false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;

-- 3. Initial Tours
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-ooty-01',
  'Misty Nilgiri Serenity & Heritage Train Escape',
  'dest-ooty',
  'Ooty',
  'Nilgiris, Tamil Nadu',
  3,
  2,
  8499,
  10999,
  4.9,
  142,
  8,
  16,
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Hill Station & Nature',
  'Easy',
  '12 - 16 Guests',
  'Sep - May',
  'Escape into the crisp embrace of the Nilgiris. Ride the vintage UNESCO steam toy train as it winds through emerald tea mountains, breathe in pine-scented mist at Pykara Lake, and unwind at a boutique colonial tea planter’s estate.',
  NULL,
  NULL,
  '["First-class seats on the historic Nilgiri Mountain Toy Train","Panoramic sunset from Doddabetta Peak (2,637 m)","Private motorboat excursion on pristine Pykara Lake","Guided artisan tea factory tour with single-estate tastings","Colonial heritage dinner by a crackling hearth"]'::jsonb,
  '["2 Nights stay in a 4-Star colonial heritage estate","Daily farm-to-table gourmet breakfast & chef dinners","All private chauffeur transfers in AC Innova Crysta","UNESCO Toy Train reserved first-class tickets","Certified English/Tamil/Hindi naturalist guide","All national park & monument entry permits"]'::jsonb,
  '["Airfare/Train to Coimbatore arrival station","Personal expenses, laundry, and alcoholic beverages","Optional speedboat or horseback riding fees"]'::jsonb,
  '[{"day":1,"title":"Arrival in the Blue Mountains & Planter’s Twilight","description":"Chauffeured pickup from Coimbatore/Ooty. Check in to your heritage colonial resort with welcome hot cardamom tea. Afternoon stroll through the historic Botanical Gardens followed by sunset tea overlooking Doddabetta Peak. Evening fireside dinner.","meals":"Dinner Included","stay":"Savoy - An IHCL SeleQtions / Similar Heritage Estate","activities":["Scenic mountain drive","Botanical Garden walk","Doddabetta sunset","Fireside welcome dinner"]},{"day":2,"title":"UNESCO Steam Train Journey & Pykara Waterfalls","description":"Board the historic UNESCO Nilgiri Toy Train crossing stone viaducts and lush pine valleys. Afternoon private speedboating at Pykara Lake and tea tasting session at an artisanal tea estate.","meals":"Breakfast & Planter’s Lunch","stay":"Savoy Heritage Estate","activities":["Toy Train ride","Pykara waterfalls & boating","Tea plucking experience","Artisanal chocolate tasting"]},{"day":3,"title":"Rose Garden Sunrise & Gentle Departure","description":"Morning walk through Asia’s largest Rose Garden followed by a lavish breakfast. Leisure shopping for homemade artisan chocolates and Nilgiri eucalyptus oils before a scenic chauffeur transfer back.","meals":"Breakfast Included","stay":"Check-out","activities":["Rose garden stroll","Artisan souvenir curation","Departure transfer"]}]'::jsonb,
  '["2026-10-02","2026-10-09","2026-10-16","2026-10-23","2026-10-30"]'::jsonb,
  '["Coimbatore Airport (CJB)","Coimbatore Junction (CBE)","Ooty Central Station"]'::jsonb,
  true,
  'Bestseller',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-kodai-01',
  'Princess of Hills: Misty Lakes & Pine Forest Trails',
  'dest-kodaikanal',
  'Kodaikanal',
  'Dindigul, Tamil Nadu',
  4,
  3,
  11999,
  14500,
  4.92,
  118,
  6,
  14,
  'https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Honeymoon Romantic',
  'Easy',
  '8 - 14 Guests',
  'Sep - May',
  'Immerse in the poetic silence of Kodaikanal. Stroll through Coaker’s Walk overlooking vast valley cloud cascades, cycle around the iconic star lake, and retreat into luxury timber cottages surrounded by 100-year-old pine groves.',
  NULL,
  NULL,
  '["Private sunset boat cruise on the star-shaped Kodai Lake","Morning mist walk along the edge of Coaker’s Walk cliffside","Exploring the colossal 400-foot Pillar Rocks & Devil’s Kitchen","Forest bathing in the fragrant ancient Pine Groves","Candlelight dinner with mountain-valley vistas"]'::jsonb,
  '["3 Nights in a luxury hill cottage overlooking Kodai valley","Buffet breakfast & 4-course dinners daily","Private dedicated luxury cab for all tours & transfers","All boating and monument entry charges","Complimentary honeymoon / celebration cake & flower arrangement"]'::jsonb,
  '["Personal adventure activities (horse riding/paragliding)","Lunches and items of personal nature","Transit to Madurai Airport/Junction"]'::jsonb,
  '[{"day":1,"title":"Valley Ascent & Serene Lakeside Stroll","description":"Chauffeured pickup from Madurai. Gentle ascent into the Palani Hills. Check-in to your cedar cottage. Late afternoon leisurely stroll and pedal boat cruise along Kodai Star Lake.","meals":"Welcome High Tea & Dinner","stay":"The Carlton Kodaikanal / Luxury Lake Resort","activities":["Madurai to Kodai scenic drive","Kodai Lake boating","Evening town promenade"]},{"day":2,"title":"Cliffs, Caves & Cloud Cascades","description":"Morning visit to Coaker’s Walk for panoramic valley cloud formations. Continue to Pillar Rocks and Guna Caves followed by a picnic lunch in Bryant Park.","meals":"Breakfast & Romantic Dinner","stay":"The Carlton Kodaikanal","activities":["Coaker’s Walk","Pillar Rocks exploration","Guna Caves visit","Bryant Park gardens"]},{"day":3,"title":"Pine Forest Whispers & Silver Cascade Falls","description":"Gentle morning trek beneath towering pine trees. Afternoon visit to Kurinji Andavar Temple and the foaming Silver Cascade waterfalls. Evening candlelit feast.","meals":"Breakfast & Gourmet Dinner","stay":"The Carlton Kodaikanal","activities":["Pine forest trail","Silver Cascade Falls","Artisan shopping for homemade oils"]},{"day":4,"title":"Morning Mist & Pleasant Farewell","description":"Wake up to the birdsong of Nilgiri laughingthrushes. Hearty breakfast before your return transfer to Madurai.","meals":"Breakfast Included","stay":"Check-out","activities":["Morning mist photography","Chauffeured descent transfer"]}]'::jsonb,
  '["2026-10-05","2026-10-12","2026-10-19","2026-10-26"]'::jsonb,
  '["Madurai International Airport (IXM)","Madurai Junction (MDU)","Kodaikanal Bus Terminal"]'::jsonb,
  true,
  'Top Rated Romantic',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-kerala-01',
  'Emerald Backwater Serenade & Munnar Tea Sanctuaries',
  'dest-kerala',
  'Kerala',
  'God’s Own Country',
  5,
  4,
  18999,
  23500,
  4.96,
  310,
  5,
  12,
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Family Luxury',
  'Easy',
  '6 - 12 Guests',
  'Sep - Mar',
  'An iconic voyage combining high-altitude tea carpet hills in Munnar with a night aboard an exclusive, fully staffed air-conditioned luxury houseboat gliding through Alleppey’s serene backwaters.',
  NULL,
  NULL,
  '["Overnight private luxury houseboat cruise in Alleppey backwaters","Freshly cooked Karimeen pollichathu and coastal delicacies by your private chef","Sunrise tea estate walks and visit to Lockhart Tea Factory in Munnar","Spice plantation discovery walk with vanilla, cardamom, and clove tastings","Live classical Kathakali and Kalaripayattu martial arts evening"]'::jsonb,
  '["2 Nights in Munnar luxury hillside resort","1 Night in Thekkady spice garden resort","1 Night in Alleppey Private Premium Houseboat (all meals on boat included)","Dedicated AC Chauffeur throughout the journey","Cultural dance & martial arts show tickets","All toll taxes, parking, and driver allowances"]'::jsonb,
  '["Flight tickets to Kochi (COK)","Personal Ayurvedic treatments outside complimentary session","Tips to boat crew and guides"]'::jsonb,
  '[{"day":1,"title":"Arrival in Kochi & Ascent to Munnar Teahills","description":"Chauffeured pickup from Kochi Airport. Scenic drive past Cheeyappara and Valara waterfalls. Check-in to Munnar tea resort. Evening leisure with panoramic valley view.","meals":"Dinner Included","stay":"Fragrant Nature Munnar / Similar","activities":["Waterfall roadside halts","Hill check-in","Welcome dinner"]},{"day":2,"title":"Munnar Tea Immersion & Eravikulam National Park","description":"Visit Eravikulam National Park to spot endangered Nilgiri Tahr mountain goats. Afternoon tea museum and factory tour. Evening spice garden stroll.","meals":"Breakfast & Dinner","stay":"Fragrant Nature Munnar","activities":["Eravikulam safari","Tea Museum visit","Mattupetty dam viewpoint"]},{"day":3,"title":"Thekkady Spices & Periyar Lake Cruise","description":"Drive through spice routes to Thekkady. Boat safari on Periyar Lake inside the wildlife sanctuary. Evening Kathakali and Kalaripayattu martial arts show.","meals":"Breakfast & Dinner","stay":"Greenwoods Resort Thekkady","activities":["Periyar Lake cruise","Spice garden tour","Live Kathakali show"]},{"day":4,"title":"Alleppey Private Houseboat Cruise & Lagoon Sunset","description":"Board your private handcrafted Kettuvallam houseboat. Cruise through narrow palm-shaded canals while your onboard chef prepares authentic Kerala lunch.","meals":"Breakfast, Lunch & Traditional Kerala Dinner","stay":"Lakes & Lagoons Premium Houseboat","activities":["Backwater cruising","Paddy field canoe ride","Fresh fish culinary demonstration"]},{"day":5,"title":"Kochi Heritage Fort & Homeward Departure","description":"Disembark after morning tea cruise. Transfer to Fort Kochi to see iconic Chinese Fishing Nets and Jew Town before heading to Kochi Airport.","meals":"Breakfast Included","stay":"Check-out","activities":["Chinese fishing nets","Jew town antique shopping","Airport drop"]}]'::jsonb,
  '["2026-10-04","2026-10-11","2026-10-18","2026-10-25","2026-11-01"]'::jsonb,
  '["Cochin International Airport (COK)","Ernakulam Town Station (ERN)","Kochi City Hotels"]'::jsonb,
  true,
  'Curated Signature',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-coorg-01',
  'Coffee Trails, Hidden Cascades & Dubare Wildlife',
  'dest-coorg',
  'Coorg',
  'Kodagu, Karnataka',
  3,
  2,
  9499,
  12000,
  4.88,
  164,
  10,
  16,
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Wilderness & Safari',
  'Easy',
  '10 - 16 Guests',
  'Oct - Apr',
  'Nestled in Karnataka’s Western Ghats, Coorg is an aromatic sanctuary of Arabica coffee blooms, cascading mountain streams at Abbey Falls, and gentle riverbank elephant encounters at Dubare.',
  NULL,
  NULL,
  '["Private guided walking tour through 200-acre organic coffee plantation","Bathing and interacting with rescue elephants at Dubare Camp","Sunset music and royal panorama at Raja’s Seat","Witnessing the roar of Abbey Falls amidst spice trees","Authentic Kodava pandi curry and culinary masterclass"]'::jsonb,
  '["2 Nights in a boutique plantation villa","Daily Kodava & continental gourmet breakfast","Private chauffeur from Bangalore or Mysore","All entry fees and plantation access permits"]'::jsonb,
  '["Optional white-water river rafting (seasonal)","Beverages and personal spending"]'::jsonb,
  '[{"day":1,"title":"Mysore to Madikeri & Sunset at Raja’s Seat","description":"Chauffeured pickup from Mysore/Bangalore. Arrival at coffee estate resort. Evening twilight visit to Raja’s Seat overlooking lush misty valleys.","meals":"Dinner Included","stay":"Evolve Back Kuruba Kothi / Plantation Retreat","activities":["Scenic valley drive","Resort check-in","Raja’s Seat twilight spectacle"]},{"day":2,"title":"Dubare Elephants, Abbey Falls & Plantation Tasting","description":"Morning excursion to Dubare Elephant Camp. Afternoon visit to Abbey Falls followed by a sensory coffee cupping and tasting session.","meals":"Breakfast & Plantation Lunch","stay":"Plantation Retreat","activities":["Dubare Elephant sanctuary","Abbey Falls visit","Coffee brewing masterclass"]},{"day":3,"title":"Namdroling Golden Temple & Departure","description":"Morning visit to Bylakuppe’s ornate Tibetan Monastery (Namdroling Golden Temple) before your return drive to Bangalore/Mysore.","meals":"Breakfast Included","stay":"Check-out","activities":["Tibetan Golden Temple","Local Coorg spices shopping","Return transfer"]}]'::jsonb,
  '["2026-10-03","2026-10-10","2026-10-17","2026-10-24"]'::jsonb,
  '["Kempegowda Bangalore Airport (BLR)","Mysore Junction (MYS)","Madikeri Central"]'::jsonb,
  false,
  'Popular Weekend',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-goa-01',
  'Sun, Sands, Portuguese Quarters & Sunset Catamaran',
  'dest-goa',
  'Goa',
  'Konkan Coast',
  4,
  3,
  14500,
  18000,
  4.89,
  220,
  7,
  15,
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Luxury Beach & Coastal',
  'Easy',
  '8 - 15 Guests',
  'Nov - Apr',
  'Discover the sophisticated side of Goa: colorful 18th-century mansions in Fontainhas, private catamaran sailings at sunset with sparkling wine, and Michelin-style coastal dining by the Arabian Sea.',
  NULL,
  NULL,
  '["Private 2-hour sunset catamaran cruise along the Mandovi coast with wine","Guided heritage walk through Fontainhas Latin Quarter with local historian","VIP seaside dinner at a Michelin-recommended Goan beach lounge","Day trip to Dudhsagar Waterfalls in open-top 4x4 jeeps","Luxury beachfront 5-star resort stay in South Goa"]'::jsonb,
  '["3 Nights in 5-Star Beachfront Resort (Taj Exotica or Alila Diwa)","Daily international champagne breakfast buffet","Private catamaran cruise tickets & onboard refreshments","All luxury AC chauffeur transfers"]'::jsonb,
  '["Flights into Goa Airport (GOI/GOX)","Casino entries and personal expenses"]'::jsonb,
  '[{"day":1,"title":"Arrival in Paradise & Seaside Relaxation","description":"Chauffeured pickup from Mopa or Dabolim airport. Check-in to your 5-star beachfront resort. Evening relaxation by the infinity pool overlooking the Arabian sea.","meals":"Welcome Cocktails & Dinner","stay":"Taj Exotica Resort & Spa / Alila Diwa","activities":["Luxury airport transfer","Seaside check-in","Poolside live jazz"]},{"day":2,"title":"Fontainhas Heritage & Sunset Catamaran Sail","description":"Morning walking exploration of colorful Portuguese homes in Fontainhas. Afternoon boarding of your private catamaran for sunset sailing.","meals":"Breakfast & Sunset Hors d’oeuvres","stay":"Taj Exotica Resort & Spa","activities":["Fontainhas Latin Quarter walk","Catamaran sunset sail","Coastal dinner"]},{"day":3,"title":"Dudhsagar Jeep Safari & Spice Plantation Feast","description":"Exciting morning 4x4 safari through Bhagwan Mahavir Wildlife Sanctuary to Dudhsagar Falls. Traditional Goan buffet on banana leaves at a spice plantation.","meals":"Breakfast & Spice Farm Lunch","stay":"Taj Exotica Resort & Spa","activities":["4x4 Jungle safari","Dudhsagar waterfalls","Organic spice plantation tour"]},{"day":4,"title":"Morning Beach Walk & Farewell","description":"Early morning yoga by the sea followed by breakfast. Private transfer to the airport for your onward journey.","meals":"Breakfast Included","stay":"Check-out","activities":["Beach sunrise walk","Luxury airport transfer"]}]'::jsonb,
  '["2026-10-08","2026-10-15","2026-10-22","2026-10-29"]'::jsonb,
  '["Goa Mopa Airport (GOX)","Goa Dabolim Airport (GOI)","Madgaon Junction"]'::jsonb,
  true,
  'Coastal Luxury',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-rajasthan-01',
  'Royal Rajputana Grandeur: Forts, Palaces & Desert Stars',
  'dest-rajasthan',
  'Rajasthan',
  'Jaipur, Udaipur & Jodhpur',
  6,
  5,
  29999,
  38000,
  4.97,
  280,
  6,
  12,
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Cultural Heritage',
  'Moderate',
  '6 - 12 Guests',
  'Oct - Mar',
  'Step into the realm of maharajas. Explore Jaipur’s Amber Fort, glide across Udaipur’s Lake Pichola on a royal solar boat, and spend an enchanting night beneath desert constellations in Jodhpur.',
  NULL,
  NULL,
  '["Royal private entry to Jaipur City Palace residential wing","Sunset solar boat cruise on Lake Pichola facing the Taj Lake Palace","Exclusive night tour of Mehrangarh Fort under illuminations","Luxury glamping night in Thar desert with Rajasthani folk music and bonfire","Stay in verified heritage Havelis restored by royal descendants"]'::jsonb,
  '["5 Nights in heritage palace hotels & luxury desert tents","Daily royal breakfasts and traditional thali dinners","Private luxury Mercedes/Innova chauffeur throughout the circuit","Expert heritage scholars and royal storytellers at all monuments","All monument admission fees and boat ride tickets"]'::jsonb,
  '["Airfare into Jaipur & out of Udaipur/Jodhpur","Camel/jeep tips and personal shopping"]'::jsonb,
  '[{"day":1,"title":"Pink City Arrival & Amber Fort Splendor","description":"Chauffeured arrival in Jaipur. Check in to heritage palace hotel. Visit Amber Fort and Hawa Mahal. Royal dinner with puppet show.","meals":"Dinner Included","stay":"Samode Haveli / Heritage Palace Jaipur","activities":["Amber fort exploration","Hawa Mahal photography","Royal dinner"]},{"day":2,"title":"City Palace, Jantar Mantar & Artisanal Bazaars","description":"Morning private tour of City Palace and UNESCO Jantar Mantar observatory. Afternoon block-printing and gem-cutting artisan demonstrations.","meals":"Breakfast & Dinner","stay":"Samode Haveli Jaipur","activities":["City palace museum","Jantar Mantar","Blue pottery & textile artisan walk"]},{"day":3,"title":"Blue City Jodhpur & Mehrangarh Ramparts","description":"Drive to Jodhpur, the Sun City. Tour the mighty Mehrangarh Fort perched 400 feet above the indigo-blue old city.","meals":"Breakfast & Dinner","stay":"Raas Jodhpur / Ajit Bhawan","activities":["Mehrangarh Fort","Jaswant Thada white marble memorial","Old city blue lanes walk"]},{"day":4,"title":"En Route Ranakpur Jain Temples to Udaipur","description":"Scenic journey to Udaipur via 15th-century carved marble pillars of Ranakpur. Check-in to lakeside Udaipur palace.","meals":"Breakfast & Thali Lunch","stay":"Fateh Garh / The Leela Palace Udaipur","activities":["Ranakpur Temple marvel","Lake Pichola twilight check-in"]},{"day":5,"title":"City of Lakes & Pichola Royal Boat Cruise","description":"Explore Udaipur City Palace, Saheliyon-ki-Bari gardens, and enjoy an enchanting sunset boat cruise across Lake Pichola.","meals":"Breakfast & Royal Gala Dinner","stay":"Fateh Garh Udaipur","activities":["Udaipur City Palace","Lake Pichola sunset boat","Rooftop dinner overlooking lighted palaces"]},{"day":6,"title":"Morning Sajjangarh Palace & Departure","description":"Morning visit to Monsoon Palace (Sajjangarh) offering 360-degree valley views before your airport transfer.","meals":"Breakfast Included","stay":"Check-out","activities":["Monsoon Palace vista","Udaipur Airport transfer"]}]'::jsonb,
  '["2026-10-06","2026-10-13","2026-10-20","2026-10-27"]'::jsonb,
  '["Jaipur International Airport (JAI)","Jaipur Junction (JP)","Jodhpur Airport (JDH)"]'::jsonb,
  true,
  'Imperial Signature',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-kashmir-01',
  'Paradise on Earth: Heavenly Valleys & Gulmarg Snows',
  'dest-kashmir',
  'Kashmir',
  'Srinagar, Gulmarg & Pahalgam',
  6,
  5,
  32500,
  42000,
  4.98,
  240,
  4,
  10,
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'Hill Station & Nature',
  'Moderate',
  '6 - 10 Guests',
  'Apr - Oct & Dec - Feb',
  'Witness nature at its most sublime. Glide across Dal Lake in an ornate Shikara, ride the Gulmarg Gondola to the Apharwat peak (4,390 m), and stroll through Pahalgam’s pine-ringed Betaab Valley.',
  NULL,
  NULL,
  '["Stay in handcrafted carved Cedarwood luxury houseboat on Dal Lake","VIP Gulmarg Gondola Phase 1 & 2 tickets included to 4,390 m altitude","Private Shikara sunrise floating vegetable & flower market tour","Day excursion to Pahalgam’s Betaab Valley & Aru Valley","Authentic 7-course Kashmiri Wazwan banquet experience"]'::jsonb,
  '["2 Nights in Luxury Dal Lake Houseboat","2 Nights in Gulmarg Alpine Resort (The Khyber or similar)","1 Night in Pahalgam Riverside Pine Cottage","Daily Kashmiri breakfast & gourmet Wazwan dinners","All chauffeur driven 4x4 transport with snow chains","Gondola Phase 1 & Phase 2 guaranteed tickets"]'::jsonb,
  '["Airfare into Srinagar (SXR)","Pony rides in Gulmarg/Pahalgam","Personal warm gear rental"]'::jsonb,
  '[{"day":1,"title":"Srinagar Arrival & Romantic Dal Lake Shikara","description":"Chauffeured pickup from Srinagar Airport. Check in to luxury houseboat. Sunset Shikara ride across floating lotus gardens.","meals":"Kahwa Welcome & Wazwan Dinner","stay":"Mascot Luxury Houseboat / Sukoon Houseboat","activities":["Airport pickup","Houseboat check-in","Sunset Shikara cruise"]},{"day":2,"title":"Mughal Gardens & Floating Sunrise Market","description":"Early morning Shikara to Dal Lake’s floating vegetable market. Afternoon visits to Shalimar Bagh and Nishat Bagh Mughal gardens.","meals":"Breakfast & Traditional Dinner","stay":"Mascot Houseboat Srinagar","activities":["Floating market visit","Shalimar & Nishat Bagh","Pashmina artisan studio"]},{"day":3,"title":"Gulmarg Gondola & Alpine Snows","description":"Ascent to Gulmarg, the Meadow of Flowers. Board the world’s highest cable car (Phase 1 & 2) up to Apharwat peak for panoramic Himalayan views.","meals":"Breakfast & Alpine Dinner","stay":"The Khyber Himalayan Resort & Spa / Kolahoi Green","activities":["Gulmarg Gondola ascent","Snow sports / ridge photography","Hearthside dinner"]},{"day":4,"title":"Pahalgam: Valley of Shepherds & Betaab Valley","description":"Drive along saffron fields of Pampore to Pahalgam. Explore the crystal Lidder River and Betaab Valley where Bollywood classics were filmed.","meals":"Breakfast & Riverside Dinner","stay":"Pine N Peak Pahalgam","activities":["Saffron field stop","Lidder riverbank walk","Betaab Valley tour"]},{"day":5,"title":"Aru Valley Exploration & Old Srinagar Heritage Walk","description":"Morning drive to picturesque Aru Valley. Return to Srinagar for an old city heritage walk through Jamia Masjid and copper bazaars.","meals":"Breakfast & Farewell Wazwan Feast","stay":"The Lalit Grand Palace Srinagar","activities":["Aru Valley meadows","Old Srinagar heritage walk","Royal palace stay"]},{"day":6,"title":"Morning Kahwa & Srinagar Departure","description":"Savor rich saffron almond Kahwa tea before your chauffeur transfer to Srinagar Airport.","meals":"Breakfast Included","stay":"Check-out","activities":["Kahwa morning tea","Srinagar airport transfer"]}]'::jsonb,
  '["2026-10-07","2026-10-14","2026-10-21","2026-10-28"]'::jsonb,
  '["Srinagar International Airport (SXR)","Srinagar Tourist Reception Centre"]'::jsonb,
  true,
  'Luxury Alpine',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;
INSERT INTO public.tours (id, title, destination_id, destination_name, region, duration_days, duration_nights, price_per_person, original_price, rating, reviews_count, available_seats, total_seats, cover_image, gallery, category, difficulty, group_size, best_season, overview, short_description, long_description, highlights, inclusions, exclusions, itinerary, departure_dates, pickup_locations, is_featured, badge, reviews)
VALUES (
  'tour-dubai-01',
  'Futuristic Oasis: Burj Khalifa, VIP Dunes & Marina Yacht',
  'dest-dubai',
  'Dubai',
  'United Arab Emirates',
  5,
  4,
  48999,
  62000,
  4.93,
  190,
  6,
  12,
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  '[]'::jsonb,
  'International Explorer',
  'Easy',
  '8 - 12 Guests',
  'Nov - Mar',
  'Experience the pinnacle of Middle Eastern glamor. VIP express entry to Burj Khalifa’s highest observatory, luxury desert dune bash in private Land Cruisers, and a twilight yacht dinner in Dubai Marina.',
  NULL,
  NULL,
  '["Fast-track VIP tickets to Burj Khalifa Level 124 & 125","Private 4x4 desert safari with sandboarding, falconry, and BBQ buffet","2-hour luxury motor yacht cruise around Dubai Marina & Palm Jumeirah","Visit to Dubai Miracle Garden and Global Village VIP pavilions","Stay in 5-Star Dubai Marina or Downtown hotel"]'::jsonb,
  '["4 Nights in 5-Star Dubai Hotel (JW Marriott Marquis / Address Marina)","Daily international buffet breakfast","Private airport transfers in luxury vehicle","All attraction tickets & yacht cruise with refreshments","UAE Tourist Visa processing assistance"]'::jsonb,
  '["International flight tickets to Dubai (DXB)","Tourism Dirham Fee payable at hotel"]'::jsonb,
  '[{"day":1,"title":"Arrival in Dubai & Marina Skyline Check-in","description":"Chauffeured arrival at DXB airport. Check in to your 5-star hotel. Evening leisure walk along Dubai Marina Walk.","meals":"Welcome Dinner","stay":"Address Dubai Marina","activities":["VIP airport pickup","Hotel check-in","Dubai Marina Walk stroll"]},{"day":2,"title":"Burj Khalifa Top Floor & Dubai Mall Fountains","description":"Morning fast-track access to Burj Khalifa observatory. Afternoon Dubai Aquarium underwater tunnel. Evening musical fountain spectacle.","meals":"Breakfast Included","stay":"Address Dubai Marina","activities":["Burj Khalifa Level 124","Dubai Aquarium","Dubai Fountain light show"]},{"day":3,"title":"Red Dunes Desert Safari & Starlit Bedouin Camp","description":"Afternoon 4x4 dune bashing across Lahbab red dunes. Sandboarding, camel ride, henna painting, and Arabian grill dinner under the stars.","meals":"Breakfast & Arabian BBQ Dinner","stay":"Address Dubai Marina","activities":["Dune bashing","Sunset photography","Belly dance & fire show"]},{"day":4,"title":"Palm Jumeirah, Miracle Garden & Luxury Yacht Dinner","description":"Explore the Palm Monorail and Dubai Miracle Garden. Evening 2-hour private yacht cruise gliding past Ain Dubai.","meals":"Breakfast & Yacht Dinner","stay":"Address Dubai Marina","activities":["Miracle Garden","Palm Jumeirah","Private Yacht dinner"]},{"day":5,"title":"Gold Souk Curation & Departure","description":"Morning visit to traditional Deira Gold & Spice Souk with water abra crossing before airport drop.","meals":"Breakfast Included","stay":"Check-out","activities":["Traditional Abra ride","Gold & Spice souk","DXB Airport drop"]}]'::jsonb,
  '["2026-10-10","2026-10-24","2026-11-07","2026-11-21"]'::jsonb,
  '["Dubai International Airport (DXB)","Al Maktoum Airport (DWC)"]'::jsonb,
  false,
  'International VIP',
  '[]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_per_person = EXCLUDED.price_per_person,
  available_seats = EXCLUDED.available_seats,
  cover_image = EXCLUDED.cover_image;

-- 4. Initial Bookings
INSERT INTO public.bookings (id, invoice_number, customer_id, customer_name, customer_email, customer_phone, tour_id, tour_title, destination_name, cover_image, travel_date, duration_days, duration_nights, travelers_count, traveler_details, pickup_location, special_requirements, price_per_person, base_price, taxes_and_fees, total_amount, status, payment_status, payment_method)
VALUES (
  'AV-9041',
  'INV-2026-9041',
  'usr-101',
  'Aditi Rao',
  'aditi.rao@voyage.luxury',
  '+91 98450 82194',
  'tour-ooty-01',
  'Misty Nilgiri Serenity & Heritage Train Escape',
  'Ooty',
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
  '2026-10-09',
  3,
  2,
  2,
  '[{"name":"Aditi Rao","age":29,"gender":"Female"},{"name":"Rohan Deshmukh","age":31,"gender":"Male"}]'::jsonb,
  'Coimbatore Airport (CJB)',
  'Vegetarian meals preferred for Day 1 dinner; first-class window seats on the toy train if possible.',
  8499,
  16998,
  850,
  17848,
  'confirmed',
  'paid',
  'HDFC Infinia Credit Card'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, invoice_number, customer_id, customer_name, customer_email, customer_phone, tour_id, tour_title, destination_name, cover_image, travel_date, duration_days, duration_nights, travelers_count, traveler_details, pickup_location, special_requirements, price_per_person, base_price, taxes_and_fees, total_amount, status, payment_status, payment_method)
VALUES (
  'AV-8812',
  'INV-2026-8812',
  'usr-101',
  'Aditi Rao',
  'aditi.rao@voyage.luxury',
  '+91 98450 82194',
  'tour-kerala-01',
  'Emerald Backwater Serenade & Munnar Tea Sanctuaries',
  'Kerala',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  '2026-06-15',
  5,
  4,
  2,
  '[{"name":"Aditi Rao","age":29,"gender":"Female"},{"name":"Sunita Rao","age":56,"gender":"Female"}]'::jsonb,
  'Cochin International Airport (COK)',
  'Ground-floor room in Munnar for senior traveler.',
  18999,
  37998,
  1900,
  39898,
  'completed',
  'paid',
  'UPI / NetBanking'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, invoice_number, customer_id, customer_name, customer_email, customer_phone, tour_id, tour_title, destination_name, cover_image, travel_date, duration_days, duration_nights, travelers_count, traveler_details, pickup_location, special_requirements, price_per_person, base_price, taxes_and_fees, total_amount, status, payment_status, payment_method)
VALUES (
  'AV-7930',
  'INV-2026-7930',
  'usr-102',
  'Siddharth Varma',
  'sid.varma@techventures.io',
  '+91 97112 33445',
  'tour-rajasthan-01',
  'Royal Rajputana Grandeur: Forts, Palaces & Desert Stars',
  'Rajasthan',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  '2026-10-13',
  6,
  5,
  4,
  '[{"name":"Siddharth Varma","age":34,"gender":"Male"},{"name":"Pooja Varma","age":32,"gender":"Female"},{"name":"Aarav Varma","age":8,"gender":"Male"},{"name":"Meera Varma","age":5,"gender":"Female"}]'::jsonb,
  'Jaipur International Airport (JAI)',
  'Interconnected rooms in Samode Haveli.',
  29999,
  119996,
  6000,
  125996,
  'confirmed',
  'paid',
  'Corporate Amex'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, invoice_number, customer_id, customer_name, customer_email, customer_phone, tour_id, tour_title, destination_name, cover_image, travel_date, duration_days, duration_nights, travelers_count, traveler_details, pickup_location, special_requirements, price_per_person, base_price, taxes_and_fees, total_amount, status, payment_status, payment_method)
VALUES (
  'AV-7651',
  'INV-2026-7651',
  'usr-103',
  'Priya Nambiar',
  'priya.n@designstudio.in',
  '+91 99401 22987',
  'tour-kashmir-01',
  'Paradise on Earth: Heavenly Valleys & Gulmarg Snows',
  'Kashmir',
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
  '2026-10-21',
  6,
  5,
  2,
  '[{"name":"Priya Nambiar","age":28,"gender":"Female"},{"name":"Kavita Menon","age":28,"gender":"Female"}]'::jsonb,
  'Srinagar International Airport (SXR)',
  NULL,
  32500,
  65000,
  3250,
  68250,
  'pending',
  'pending',
  'Bank Transfer (Awaiting Clearance)'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, invoice_number, customer_id, customer_name, customer_email, customer_phone, tour_id, tour_title, destination_name, cover_image, travel_date, duration_days, duration_nights, travelers_count, traveler_details, pickup_location, special_requirements, price_per_person, base_price, taxes_and_fees, total_amount, status, payment_status, payment_method)
VALUES (
  'AV-7419',
  'INV-2026-7419',
  'usr-104',
  'Anand Kulkarni',
  'anand.k@precisioneng.com',
  '+91 98220 11223',
  'tour-coorg-01',
  'Coffee Trails, Hidden Cascades & Dubare Wildlife',
  'Coorg',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  '2026-08-12',
  3,
  2,
  3,
  '[{"name":"Anand Kulkarni","age":42,"gender":"Male"},{"name":"Deepa Kulkarni","age":40,"gender":"Female"},{"name":"Tanmay Kulkarni","age":14,"gender":"Male"}]'::jsonb,
  'Kempegowda Bangalore Airport (BLR)',
  NULL,
  9499,
  28497,
  1425,
  29922,
  'completed',
  'paid',
  'Axis Bank NetBanking'
) ON CONFLICT (id) DO NOTHING;

-- 5. Initial Customers
INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  'usr-101',
  'Aditi Rao',
  'aditi.rao@voyage.luxury',
  '+91 98450 82194',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'Bengaluru',
  'India',
  3,
  87668,
  '2024-03-12',
  'vip',
  '["Ooty","Kerala","Kashmir"]'::jsonb,
  'Prefers quiet heritage retreats, organic coffee and mountain view suites.'
) ON CONFLICT (email) DO NOTHING;
INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  'usr-102',
  'Siddharth Varma',
  'sid.varma@techventures.io',
  '+91 97112 33445',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'Mumbai',
  'India',
  2,
  165800,
  '2023-11-18',
  'vip',
  '["Rajasthan","Dubai"]'::jsonb,
  'High net worth traveler with 2 children; always books executive transport.'
) ON CONFLICT (email) DO NOTHING;
INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  'usr-103',
  'Priya Nambiar',
  'priya.n@designstudio.in',
  '+91 99401 22987',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'Chennai',
  'India',
  1,
  68250,
  '2024-08-01',
  'active',
  '["Kashmir"]'::jsonb,
  'Interested in artisan textiles and photography workshops.'
) ON CONFLICT (email) DO NOTHING;
INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  'usr-104',
  'Anand Kulkarni',
  'anand.k@precisioneng.com',
  '+91 98220 11223',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'Pune',
  'India',
  2,
  52400,
  '2024-01-20',
  'active',
  '["Coorg","Goa"]'::jsonb,
  'Frequent weekend traveler.'
) ON CONFLICT (email) DO NOTHING;
INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  'usr-105',
  'Eleanor Vance',
  'eleanor.v@globalconsult.uk',
  '+44 7700 900123',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'London',
  'United Kingdom',
  1,
  54000,
  '2024-05-15',
  'vip',
  '["Kerala","Singapore"]'::jsonb,
  'International inbound client. Prefers English-speaking scholar guides.'
) ON CONFLICT (email) DO NOTHING;
INSERT INTO public.customers (id, name, email, phone, avatar, city, country, total_bookings, total_spent, joined_date, status, favorite_destinations, notes)
VALUES (
  'usr-106',
  'Kabir Oberoi',
  'kabir.o@oberoicapital.com',
  '+91 98100 45678',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'New Delhi',
  'India',
  4,
  210000,
  '2023-06-10',
  'vip',
  '["Dubai","Rajasthan","Manali"]'::jsonb,
  'Crown Tier member. VIP transfers only.'
) ON CONFLICT (email) DO NOTHING;

-- 6. Initial Notifications
INSERT INTO public.notifications (id, title, message, timestamp, type, read, link)
VALUES (
  'notif-1',
  'Booking Confirmed • Misty Nilgiri Serenity',
  'Your journey to Ooty is confirmed for 09 Oct 2026. Chauffeur details and hotel vouchers have been dispatched.',
  '2 hours ago',
  'booking',
  false,
  'my-bookings'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.notifications (id, title, message, timestamp, type, read, link)
VALUES (
  'notif-2',
  'Autumn Hill Station Season Open',
  'Special seasonal allocation for Nilgiri Toy Train & Munnar Houseboats now available for booking.',
  '1 day ago',
  'offer',
  false,
  'tours'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.notifications (id, title, message, timestamp, type, read, link)
VALUES (
  'notif-3',
  'Invoice Issued • #INV-2026-9041',
  'Official GST tax invoice for your upcoming Ooty journey is ready for download in your dashboard.',
  '3 days ago',
  'system',
  true,
  'my-bookings'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.notifications (id, title, message, timestamp, type, read, link)
VALUES (
  'notif-4',
  'VIP Lounge Concierge Access',
  'As a Platinum tier traveler, your dedicated AI Travel Assistant has received updated real-time weather feeds.',
  '1 week ago',
  'alert',
  true,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- 7. Initial Wishlist Items
INSERT INTO public.wishlist_items (user_id, tour_id)
VALUES 
('usr-101', 'tour-ooty-01'),
('usr-101', 'tour-kerala-01')
ON CONFLICT DO NOTHING;
