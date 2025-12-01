export type PropertyType =
  | 'Studio'
  | '1BR Apartment'
  | '2BR Apartment'
  | '3BR Apartment'
  | 'Villa';

export type PropertyStatus = 'available' | 'maintenance' | 'unavailable';

export type PropertyAmenity =
  | 'WiFi'
  | 'AC'
  | 'Kitchen'
  | 'Washing Machine'
  | 'Pool Access'
  | 'Parking'
  | 'TV'
  | 'Gym';

export interface Property {
  id: string;
  organization_id: string;
  name: string;
  type: PropertyType | null;
  capacity: number;
  price_per_night: number;
  amenities: PropertyAmenity[];
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyInput {
  name: string;
  type: PropertyType;
  capacity: number;
  price_per_night: number;
  amenities: PropertyAmenity[];
  status: PropertyStatus;
}
