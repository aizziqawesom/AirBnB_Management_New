import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import type { DashboardStats, RecentBooking } from '@/lib/types/dashboard';

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  // Parallel queries for optimal performance
  const [revenueData, propertiesData, bookingsData, confirmedData] = await Promise.all([
    // Total Revenue - sum all bookings
    supabase
      .from('bookings')
      .select('price')
      .eq('organization_id', organization.id),

    // Total Properties count
    supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organization.id),

    // Total Bookings count
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organization.id),

    // Confirmed Bookings count
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organization.id)
      .eq('status', 'confirmed'),
  ]);

  // Calculate total revenue from all bookings
  const totalRevenue = revenueData.data?.reduce(
    (sum, booking) => sum + (Number(booking.price) || 0),
    0
  ) || 0;

  return {
    totalRevenue,
    totalProperties: propertiesData.count || 0,
    totalBookings: bookingsData.count || 0,
    confirmedBookings: confirmedData.count || 0,
  };
}

export async function getRecentBookings(): Promise<RecentBooking[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      guest_name,
      phone,
      check_in,
      check_out,
      status,
      price,
      guests,
      properties (
        name
      )
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recent bookings:', error);
    throw error;
  }

  // Transform data to match RecentBooking interface
  return (data || []).map(booking => ({
    id: booking.id,
    guest_name: booking.guest_name,
    phone: booking.phone,
    property_name: (booking.properties as any)?.name || 'Unknown Property',
    check_in: booking.check_in,
    check_out: booking.check_out,
    status: booking.status as RecentBooking['status'],
    price: Number(booking.price),
    guests: booking.guests,
  }));
}
