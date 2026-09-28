import { db } from './index.ts';
import { 
  destinations, 
  tours, 
  bookings, 
  customers, 
  notifications, 
  wishlistItems,
  users 
} from './schema.ts';
import { eq, desc, and } from 'drizzle-orm';
import type { 
  Destination, 
  TourPackage, 
  Booking, 
  CustomerProfile, 
  AppNotification, 
  BookingStatus 
} from '../types.ts';

// ==========================================
// DESTINATIONS
// ==========================================
export async function getAllDestinations(): Promise<Destination[]> {
  try {
    const rows = await db.select().from(destinations);
    return rows as unknown as Destination[];
  } catch (error) {
    console.error('Database query failed for destinations:', error);
    throw new Error('Failed to retrieve destinations from database', { cause: error });
  }
}

export async function upsertDestination(data: Destination): Promise<void> {
  try {
    await db.insert(destinations).values({
      id: data.id,
      name: data.name,
      region: data.region,
      country: data.country,
      state: data.state || null,
      tagline: data.tagline,
      description: data.description,
      heroImage: data.heroImage,
      gallery: data.gallery || [],
      startingPrice: data.startingPrice,
      rating: data.rating,
      reviewsCount: data.reviewsCount || 0,
      tourCount: data.tourCount || 0,
      bestSeason: data.bestSeason,
      bestTimeToVisit: data.bestTimeToVisit || null,
      climate: data.climate,
      weather: data.weather || null,
      tags: data.tags || [],
      highlights: data.highlights || [],
      altitude: data.altitude || null,
      isPopular: data.isPopular || false,
    }).onConflictDoUpdate({
      target: destinations.id,
      set: {
        name: data.name,
        region: data.region,
        country: data.country,
        state: data.state || null,
        tagline: data.tagline,
        description: data.description,
        heroImage: data.heroImage,
        gallery: data.gallery || [],
        startingPrice: data.startingPrice,
        rating: data.rating,
        reviewsCount: data.reviewsCount || 0,
        tourCount: data.tourCount || 0,
        bestSeason: data.bestSeason,
        climate: data.climate,
        weather: data.weather || null,
        tags: data.tags || [],
        highlights: data.highlights || [],
        altitude: data.altitude || null,
        isPopular: data.isPopular || false,
      }
    });
  } catch (error) {
    console.error('Failed to upsert destination:', error);
    throw new Error('Failed to save destination', { cause: error });
  }
}

// ==========================================
// TOURS
// ==========================================
export async function getAllTours(): Promise<TourPackage[]> {
  try {
    const rows = await db.select().from(tours);
    return rows as unknown as TourPackage[];
  } catch (error) {
    console.error('Database query failed for tours:', error);
    throw new Error('Failed to retrieve tours from database', { cause: error });
  }
}

export async function getTourById(id: string): Promise<TourPackage | null> {
  try {
    const rows = await db.select().from(tours).where(eq(tours.id, id));
    if (!rows.length) return null;
    return rows[0] as unknown as TourPackage;
  } catch (error) {
    console.error(`Failed to get tour ${id}:`, error);
    throw new Error(`Failed to retrieve tour ${id}`, { cause: error });
  }
}

export async function upsertTour(data: TourPackage): Promise<TourPackage> {
  try {
    const result = await db.insert(tours).values({
      id: data.id,
      title: data.title,
      destinationId: data.destinationId,
      destinationName: data.destinationName,
      region: data.region || null,
      durationDays: data.durationDays,
      durationNights: data.durationNights,
      pricePerPerson: data.pricePerPerson,
      originalPrice: data.originalPrice || null,
      rating: data.rating,
      reviewsCount: data.reviewsCount || data.reviewCount || 0,
      availableSeats: data.availableSeats,
      totalSeats: data.totalSeats,
      coverImage: data.coverImage,
      gallery: (data.gallery && data.gallery.length > 0) ? data.gallery : (data.galleryImages || []),
      category: data.category,
      difficulty: data.difficulty,
      groupSize: data.groupSize || null,
      bestSeason: data.bestSeason || null,
      overview: data.overview || null,
      shortDescription: data.shortDescription || null,
      longDescription: data.longDescription || null,
      highlights: data.highlights || [],
      inclusions: data.inclusions || [],
      exclusions: data.exclusions || [],
      itinerary: data.itinerary || [],
      departureDates: data.departureDates || [],
      pickupLocations: data.pickupLocations || [],
      isFeatured: data.isFeatured || false,
      badge: data.badge || null,
      reviews: data.reviews || [],
    }).onConflictDoUpdate({
      target: tours.id,
      set: {
        title: data.title,
        destinationId: data.destinationId,
        destinationName: data.destinationName,
        region: data.region || null,
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        pricePerPerson: data.pricePerPerson,
        originalPrice: data.originalPrice || null,
        rating: data.rating,
        reviewsCount: data.reviewsCount || data.reviewCount || 0,
        availableSeats: data.availableSeats,
        totalSeats: data.totalSeats,
        coverImage: data.coverImage,
        gallery: (data.gallery && data.gallery.length > 0) ? data.gallery : (data.galleryImages || []),
        category: data.category,
        difficulty: data.difficulty,
        groupSize: data.groupSize || null,
        bestSeason: data.bestSeason || null,
        overview: data.overview || null,
        shortDescription: data.shortDescription || null,
        longDescription: data.longDescription || null,
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        itinerary: data.itinerary || [],
        departureDates: data.departureDates || [],
        pickupLocations: data.pickupLocations || [],
        isFeatured: data.isFeatured || false,
        badge: data.badge || null,
        reviews: data.reviews || [],
      }
    }).returning();

    return result[0] as unknown as TourPackage;
  } catch (error) {
    console.error('Failed to upsert tour:', error);
    throw new Error('Failed to save tour package', { cause: error });
  }
}

export async function deleteTourById(id: string): Promise<void> {
  try {
    await db.delete(wishlistItems).where(eq(wishlistItems.tourId, id));
    await db.delete(bookings).where(eq(bookings.tourId, id));
    await db.delete(tours).where(eq(tours.id, id));
  } catch (error) {
    console.error(`Failed to delete tour ${id}:`, error);
    throw new Error('Failed to delete tour', { cause: error });
  }
}

// ==========================================
// BOOKINGS
// ==========================================
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return rows as unknown as Booking[];
  } catch (error) {
    console.error('Database query failed for bookings:', error);
    throw new Error('Failed to retrieve bookings from database', { cause: error });
  }
}

export async function createBookingRecord(data: Booking): Promise<Booking> {
  try {
    const result = await db.insert(bookings).values({
      id: data.id,
      invoiceNumber: data.invoiceNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      tourId: data.tourId,
      tourTitle: data.tourTitle,
      destinationName: data.destinationName,
      coverImage: data.coverImage,
      travelDate: data.travelDate,
      durationDays: data.durationDays,
      durationNights: data.durationNights,
      travelersCount: data.travelersCount,
      travelerDetails: data.travelerDetails || [],
      pickupLocation: data.pickupLocation,
      specialRequirements: data.specialRequirements || null,
      pricePerPerson: data.pricePerPerson,
      basePrice: data.basePrice,
      taxesAndFees: data.taxesAndFees,
      totalAmount: data.totalAmount,
      status: data.status,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
    }).returning();

    return result[0] as unknown as Booking;
  } catch (error) {
    console.error('Failed to create booking in database:', error);
    throw new Error('Failed to record booking', { cause: error });
  }
}

export async function updateBookingStatusRecord(
  id: string, 
  status: BookingStatus
): Promise<Booking | null> {
  try {
    const result = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();

    if (!result.length) return null;
    return result[0] as unknown as Booking;
  } catch (error) {
    console.error(`Failed to update booking ${id}:`, error);
    throw new Error('Failed to update booking status', { cause: error });
  }
}

// ==========================================
// CUSTOMERS
// ==========================================
export async function getAllCustomers(): Promise<CustomerProfile[]> {
  try {
    const rows = await db.select().from(customers);
    return rows as unknown as CustomerProfile[];
  } catch (error) {
    console.error('Database query failed for customers:', error);
    throw new Error('Failed to retrieve customers from database', { cause: error });
  }
}

export async function upsertCustomer(data: CustomerProfile): Promise<void> {
  try {
    await db.insert(customers).values({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,
      city: data.city,
      country: data.country,
      totalBookings: data.totalBookings || 0,
      totalSpent: data.totalSpent || 0,
      joinedDate: data.joinedDate,
      status: data.status || 'active',
      favoriteDestinations: data.favoriteDestinations || [],
      notes: data.notes || null,
    }).onConflictDoUpdate({
      target: customers.email,
      set: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
        city: data.city,
        country: data.country,
        totalBookings: data.totalBookings || 0,
        totalSpent: data.totalSpent || 0,
        status: data.status || 'active',
        favoriteDestinations: data.favoriteDestinations || [],
        notes: data.notes || null,
      }
    });
  } catch (error) {
    console.error('Failed to upsert customer:', error);
    throw new Error('Failed to save customer record', { cause: error });
  }
}

// ==========================================
// NOTIFICATIONS
// ==========================================
export async function getAllNotifications(): Promise<AppNotification[]> {
  try {
    const rows = await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    return rows as unknown as AppNotification[];
  } catch (error) {
    console.error('Database query failed for notifications:', error);
    throw new Error('Failed to retrieve notifications from database', { cause: error });
  }
}

export async function upsertNotification(data: AppNotification): Promise<void> {
  try {
    await db.insert(notifications).values({
      id: data.id,
      title: data.title,
      message: data.message,
      timestamp: data.timestamp,
      type: data.type,
      read: data.read,
      link: data.link || null,
    }).onConflictDoUpdate({
      target: notifications.id,
      set: {
        title: data.title,
        message: data.message,
        read: data.read,
        link: data.link || null,
      }
    });
  } catch (error) {
    console.error('Failed to upsert notification:', error);
    throw new Error('Failed to save notification', { cause: error });
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  } catch (error) {
    console.error(`Failed to mark notification ${id} as read:`, error);
    throw new Error('Failed to update notification status', { cause: error });
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await db.update(notifications).set({ read: true });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw new Error('Failed to update notifications', { cause: error });
  }
}

// ==========================================
// WISHLIST
// ==========================================
export async function getUserWishlist(userId: string): Promise<string[]> {
  try {
    const rows = await db
      .select({ tourId: wishlistItems.tourId })
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId));
    return rows.map((r) => r.tourId);
  } catch (error) {
    console.error(`Failed to fetch wishlist for user ${userId}:`, error);
    throw new Error('Failed to retrieve wishlist', { cause: error });
  }
}

export async function toggleWishlistRecord(userId: string, tourId: string): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.tourId, tourId)));

    if (existing.length > 0) {
      await db
        .delete(wishlistItems)
        .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.tourId, tourId)));
      return false; // removed
    } else {
      await db.insert(wishlistItems).values({ userId, tourId });
      return true; // added
    }
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
    throw new Error('Failed to update wishlist', { cause: error });
  }
}
