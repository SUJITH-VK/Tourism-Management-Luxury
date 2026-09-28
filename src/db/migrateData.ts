import { 
  INITIAL_DESTINATIONS, 
  INITIAL_TOURS, 
  INITIAL_BOOKINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER, 
  ADMIN_USER 
} from '../data/initialData.ts';
import { 
  upsertDestination, 
  upsertTour, 
  createBookingRecord, 
  upsertCustomer, 
  upsertNotification,
  toggleWishlistRecord 
} from './helpers.ts';
import { getOrCreateUser } from './users.ts';

export async function migrateAllData() {
  console.log('--- Starting Cloud SQL PostgreSQL Data Migration ---');

  // 1. Migrate Users
  console.log('Migrating initial users...');
  await getOrCreateUser(
    INITIAL_USER.id,
    INITIAL_USER.email,
    INITIAL_USER.name,
    INITIAL_USER.phone,
    INITIAL_USER.avatar,
    INITIAL_USER.role
  );
  await getOrCreateUser(
    ADMIN_USER.id,
    ADMIN_USER.email,
    ADMIN_USER.name,
    ADMIN_USER.phone,
    ADMIN_USER.avatar,
    ADMIN_USER.role
  );
  console.log('✓ 2 users migrated.');

  // 2. Migrate Destinations
  console.log(`Migrating ${INITIAL_DESTINATIONS.length} destinations...`);
  for (const dest of INITIAL_DESTINATIONS) {
    await upsertDestination(dest);
  }
  console.log(`✓ ${INITIAL_DESTINATIONS.length} destinations migrated.`);

  // 3. Migrate Tours
  console.log(`Migrating ${INITIAL_TOURS.length} tours...`);
  for (const tour of INITIAL_TOURS) {
    await upsertTour(tour);
  }
  console.log(`✓ ${INITIAL_TOURS.length} tours migrated.`);

  // 4. Migrate Bookings
  console.log(`Migrating ${INITIAL_BOOKINGS.length} bookings...`);
  for (const bkg of INITIAL_BOOKINGS) {
    try {
      await createBookingRecord(bkg);
    } catch (e: any) {
      // If already exists, ignore
      console.log(`Booking ${bkg.id} check:`, e?.message || e);
    }
  }
  console.log(`✓ Bookings processed.`);

  // 5. Migrate Customers
  console.log(`Migrating ${INITIAL_CUSTOMERS.length} customers...`);
  for (const cust of INITIAL_CUSTOMERS) {
    await upsertCustomer(cust);
  }
  console.log(`✓ ${INITIAL_CUSTOMERS.length} customers migrated.`);

  // 6. Migrate Notifications
  console.log(`Migrating ${INITIAL_NOTIFICATIONS.length} notifications...`);
  for (const notif of INITIAL_NOTIFICATIONS) {
    await upsertNotification(notif);
  }
  console.log(`✓ ${INITIAL_NOTIFICATIONS.length} notifications migrated.`);

  // 7. Initial Wishlist Items
  console.log('Migrating initial wishlist items...');
  await toggleWishlistRecord(INITIAL_USER.id, 'tour-ooty-01');
  await toggleWishlistRecord(INITIAL_USER.id, 'tour-kerala-01');
  console.log('✓ Wishlist items migrated.');

  console.log('--- Migration Finished Successfully ---');
}
