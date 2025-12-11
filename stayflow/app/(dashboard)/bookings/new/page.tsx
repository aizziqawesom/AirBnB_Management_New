import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/bookings/booking-form';
import { getProperties } from '@/lib/services/properties';

export default async function NewBookingPage() {
  const properties = await getProperties();

  if (properties.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold mb-2">No Properties Available</h2>
          <p className="text-muted-foreground mb-6">
            You need to create at least one property before creating a booking.
          </p>
          <Link href="/properties/new">
            <Button>Create Property</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/bookings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </Link>
      </div>

      <BookingForm properties={properties} />
    </div>
  );
}
