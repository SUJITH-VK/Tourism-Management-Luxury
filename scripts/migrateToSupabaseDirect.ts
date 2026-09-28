import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_TOURS, 
  INITIAL_BOOKINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER, 
  ADMIN_USER 
} from '../src/data/initialData.ts';

const rawUrl = process.env.SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!cleanUrl || !key) {
  console.error('Supabase URL or Key not set');
  process.exit(1);
}

const client = createClient(cleanUrl, key);

async function runDirectMigration() {
  console.log('Connecting to Supabase at:', cleanUrl);

  // 1. Users
  console.log('1. Migrating Users...');
  const { error: userErr } = await client.from('users').upsert([
    {
      uid: INITIAL_USER.id,
      email: INITIAL_USER.email,
      name: INITIAL_USER.name,
      phone: INITIAL_USER.phone,
      avatar: INITIAL_USER.avatar,
      role: INITIAL_USER.role,
      membership_tier: 'Gold',
    },
    {
      uid: ADMIN_USER.id,
      email: ADMIN_USER.email,
      name: ADMIN_USER.name,
      phone: ADMIN_USER.phone,
      avatar: ADMIN_USER.avatar,
      role: ADMIN_USER.role,
      membership_tier: 'Platinum',
    },
  ], { onConflict: 'uid' });
  if (userErr) console.error('User insert error:', userErr);
  else console.log('✓ Users migrated');

  // 2. Destinations
  console.log('2. Migrating Destinations...');
  const destRows = INITIAL_DESTINATIONS.map((d) => ({
    id: d.id,
    name: d.name,
    region: d.region,
    country: d.country,
    state: d.state || null,
    tagline: d.tagline,
    description: d.description,
    hero_image: d.heroImage,
    gallery: d.gallery || [],
    starting_price: d.startingPrice,
    rating: d.rating,
    reviews_count: d.reviewsCount || 0,
    tour_count: d.tourCount || 0,
    best_season: d.bestSeason,
    best_time_to_visit: d.bestTimeToVisit || null,
    climate: d.climate,
    weather: d.weather || null,
    tags: d.tags || [],
    highlights: d.highlights || [],
    altitude: d.altitude || null,
    is_popular: Boolean(d.isPopular),
  }));

  const { error: destErr } = await client.from('destinations').upsert(destRows, { onConflict: 'id' });
  if (destErr) console.error('Destinations insert error:', destErr);
  else console.log(`✓ Destinations migrated (${destRows.length} records)`);

  // 3. Tours
  console.log('3. Migrating Tours...');
  const tourRows = INITIAL_TOURS.map((t) => ({
    id: t.id,
    title: t.title,
    destination_id: t.destinationId,
    destination_name: t.destinationName,
    region: t.region || null,
    duration_days: t.durationDays,
    duration_nights: t.durationNights,
    price_per_person: t.pricePerPerson,
    original_price: t.originalPrice || null,
    rating: t.rating,
    reviews_count: t.reviewsCount || 0,
    available_seats: t.availableSeats,
    total_seats: t.totalSeats,
    cover_image: t.coverImage,
    gallery: t.gallery || [],
    category: t.category,
    difficulty: t.difficulty,
    group_size: t.groupSize || null,
    best_season: t.bestSeason || null,
    overview: t.overview || null,
    short_description: t.shortDescription || null,
    long_description: t.longDescription || null,
    highlights: t.highlights || [],
    inclusions: t.inclusions || [],
    exclusions: t.exclusions || [],
    itinerary: t.itinerary || [],
    departure_dates: t.departureDates || [],
    pickup_locations: t.pickupLocations || [],
    is_featured: Boolean(t.isFeatured),
    badge: t.badge || null,
    reviews: t.reviews || [],
  }));

  const { error: tourErr } = await client.from('tours').upsert(tourRows, { onConflict: 'id' });
  if (tourErr) console.error('Tours insert error:', tourErr);
  else console.log(`✓ Tours migrated (${tourRows.length} records)`);

  // 4. Customers
  console.log('4. Migrating Customers...');
  const custRows = INITIAL_CUSTOMERS.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    avatar: c.avatar,
    city: c.city,
    country: c.country,
    total_bookings: c.totalBookings || 0,
    total_spent: c.totalSpent || 0,
    joined_date: c.joinedDate,
    status: c.status || 'active',
    favorite_destinations: c.favoriteDestinations || [],
    notes: c.notes || null,
  }));

  const { error: custErr } = await client.from('customers').upsert(custRows, { onConflict: 'id' });
  if (custErr) console.error('Customers insert error:', custErr);
  else console.log(`✓ Customers migrated (${custRows.length} records)`);

  // 5. Bookings
  console.log('5. Migrating Bookings...');
  const bkgRows = INITIAL_BOOKINGS.map((b) => ({
    id: b.id,
    invoice_number: b.invoiceNumber,
    customer_id: b.customerId,
    customer_name: b.customerName,
    customer_email: b.customerEmail,
    customer_phone: b.customerPhone,
    tour_id: b.tourId,
    tour_title: b.tourTitle,
    destination_name: b.destinationName,
    cover_image: b.coverImage,
    travel_date: b.travelDate,
    duration_days: b.durationDays,
    duration_nights: b.durationNights,
    travelers_count: b.travelersCount,
    traveler_details: b.travelerDetails || [],
    pickup_location: b.pickupLocation,
    special_requirements: b.specialRequirements || null,
    price_per_person: b.pricePerPerson,
    base_price: b.basePrice,
    taxes_and_fees: b.taxesAndFees,
    total_amount: b.totalAmount,
    status: b.status,
    payment_status: b.paymentStatus,
    payment_method: b.paymentMethod,
  }));

  const { error: bkgErr } = await client.from('bookings').upsert(bkgRows, { onConflict: 'id' });
  if (bkgErr) console.error('Bookings insert error:', bkgErr);
  else console.log(`✓ Bookings migrated (${bkgRows.length} records)`);

  // 6. Notifications
  console.log('6. Migrating Notifications...');
  const notifRows = INITIAL_NOTIFICATIONS.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    timestamp: n.timestamp,
    type: n.type,
    read: Boolean(n.read),
    link: n.link || null,
  }));

  const { error: notifErr } = await client.from('notifications').upsert(notifRows, { onConflict: 'id' });
  if (notifErr) console.error('Notifications insert error:', notifErr);
  else console.log(`✓ Notifications migrated (${notifRows.length} records)`);

  // 7. Wishlist Items
  console.log('7. Migrating Wishlist...');
  const { error: wishErr } = await client.from('wishlist_items').upsert([
    { user_id: 'usr-101', tour_id: 'tour-ooty-01' },
    { user_id: 'usr-101', tour_id: 'tour-kerala-01' },
  ], { onConflict: 'id' });
  if (wishErr) console.error('Wishlist insert error:', wishErr);
  else console.log('✓ Wishlist migrated');

  console.log('\n=========================================');
  console.log('🎉 ALL DATA HAS BEEN MIGRATED DIRECTLY TO SUPABASE!');
  console.log('=========================================');
}

runDirectMigration().catch(console.error);
