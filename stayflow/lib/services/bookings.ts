import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import type { BookingWithProperty, BookingStatus, BookingDetail } from '@/lib/types/booking';

export async function getBookings(statusFilter?: BookingStatus): Promise<BookingWithProperty[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  let query = supabase
    .from('bookings')
    .select('*, properties(name)')
    .eq('organization_id', organization.id)
    .order('check_in', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return data as BookingWithProperty[];
}

export async function getBooking(id: string): Promise<BookingDetail | null> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return null;
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('id', id)
    .eq('organization_id', organization.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as BookingDetail;
}

export async function getBookingsForMonth(
  year: number,
  month: number,
  propertyId?: string
): Promise<BookingWithProperty[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  // Calculate date range for the month
  // Include bookings that overlap with the month (check_in before month end, check_out after month start)
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0); // Last day of month

  const monthStartStr = monthStart.toISOString().split('T')[0];
  const monthEndStr = monthEnd.toISOString().split('T')[0];

  let query = supabase
    .from('bookings')
    .select('*, properties(name)')
    .eq('organization_id', organization.id)
    .lte('check_in', monthEndStr)
    .gte('check_out', monthStartStr);

  // Optional property filter
  if (propertyId && propertyId !== 'all') {
    query = query.eq('property_id', propertyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bookings for month:', error);
    throw error;
  }

  return data as BookingWithProperty[];
}
