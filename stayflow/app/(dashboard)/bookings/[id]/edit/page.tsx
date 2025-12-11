import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getBooking } from '@/lib/services/bookings';
import { getProperties } from '@/lib/services/properties';
import { BookingForm } from '@/components/bookings/booking-form';

interface EditBookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  const { id } = await params;
  const [booking, properties] = await Promise.all([
    getBooking(id),
    getProperties(),
  ]);

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/bookings/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Booking</h1>
          <p className="text-sm text-muted-foreground">Update booking details</p>
        </div>
      </div>

      <BookingForm
        properties={properties}
        mode="edit"
        bookingId={booking.id}
        initialValues={{
          guest_name: booking.guest_name,
          phone: booking.phone,
          property_id: booking.property_id,
          check_in: booking.check_in,
          check_out: booking.check_out,
          guests: booking.guests,
          price: booking.price,
          source: booking.source,
          notes: booking.notes || '',
        }}
      />
    </div>
  );
}
