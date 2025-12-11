import { getBookingsForMonth } from '@/lib/services/bookings';
import { getProperties } from '@/lib/services/properties';
import { CalendarViewClient } from './calendar-view-client';

export async function CalendarView() {
  // Get current month's data
  const now = new Date();
  const bookings = await getBookingsForMonth(now.getFullYear(), now.getMonth());
  const properties = await getProperties();

  return <CalendarViewClient initialBookings={bookings} properties={properties} />;
}
