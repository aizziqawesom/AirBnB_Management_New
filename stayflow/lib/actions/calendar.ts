'use server';

import { getBookingsForMonth as getBookingsForMonthService } from '@/lib/services/bookings';

export async function getBookingsForMonth(
  year: number,
  month: number,
  propertyId?: string
) {
  return await getBookingsForMonthService(year, month, propertyId);
}
