import type { Property } from './property';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'checked_in'
  | 'checked_out'
  | 'no_show';

export type BookingSource =
  | 'TikTok'
  | 'WhatsApp'
  | 'Instagram'
  | 'Direct'
  | 'Other';

export interface Booking {
  id: string;
  organization_id: string;
  property_id: string;
  guest_name: string;
  phone: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  price: number;
  status: BookingStatus;
  source: BookingSource;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingWithProperty extends Booking {
  properties: {
    name: string;
  };
}

export interface BookingDetail extends Booking {
  properties: Property;
}
