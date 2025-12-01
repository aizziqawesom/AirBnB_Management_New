import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { RecentBooking } from '@/lib/types/dashboard';
import { format } from 'date-fns';

interface RecentBookingsProps {
  bookings: RecentBooking[];
}

// Status badge colors matching dark theme
const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20',
  completed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  checked_in: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
  checked_out: 'bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20',
  no_show: 'bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20',
};

export function RecentBookings({ bookings }: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest booking activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No bookings yet</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Bookings will appear here once you start receiving reservations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest booking activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <Link href="/bookings">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/5"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{booking.guest_name}</p>
                <p className="text-xs text-muted-foreground">{booking.property_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {format(new Date(booking.check_in), 'MMM dd')} -{' '}
                    {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                  </span>
                  <span>•</span>
                  <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <p className="text-sm font-semibold whitespace-nowrap">
                  RM {booking.price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <Badge
                  variant="outline"
                  className={statusColors[booking.status]}
                >
                  {booking.status.replace('_', ' ').split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild className="mt-4 w-full sm:hidden">
          <Link href="/bookings">
            View All Bookings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
