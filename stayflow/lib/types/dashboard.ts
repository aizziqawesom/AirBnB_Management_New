export interface DashboardStats {
  totalRevenue: number;
  totalProperties: number;
  totalBookings: number;
  confirmedBookings: number;
}

export interface RecentBooking {
  id: string;
  guest_name: string;
  phone: string;
  property_name: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'checked_in' | 'checked_out' | 'no_show';
  price: number;
  guests: number;
}
