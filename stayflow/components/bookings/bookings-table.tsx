import { getBookings } from '@/lib/services/bookings';
import { BookingsTableClient } from './bookings-table-client';

export async function BookingsTable() {
  const bookings = await getBookings();

  return <BookingsTableClient initialBookings={bookings} />;
}
