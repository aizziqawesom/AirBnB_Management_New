'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { updateBookingStatus, deleteBooking } from '@/lib/actions/bookings';
import { toast } from 'sonner';
import type { BookingStatus } from '@/lib/types/booking';

interface BookingActionsProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    setIsUpdating(true);
    const result = await updateBookingStatus(bookingId, newStatus);

    if (result.error) {
      toast.error('Error', {
        description: result.error,
      });
      setIsUpdating(false);
    } else {
      toast.success('Success', {
        description: `Booking ${newStatus}`,
      });
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteBooking(bookingId);

    if (result.error) {
      toast.error('Error', {
        description: result.error,
      });
      setIsDeleting(false);
    } else {
      toast.success('Success', {
        description: 'Booking deleted successfully',
      });
      router.push('/bookings');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === 'pending' && (
        <>
          <Button
            onClick={() => handleStatusUpdate('confirmed')}
            disabled={isUpdating}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm
          </Button>
          <Button
            onClick={() => handleStatusUpdate('cancelled')}
            disabled={isUpdating}
            size="sm"
            variant="destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </>
      )}

      {currentStatus === 'confirmed' && (
        <>
          <Button
            onClick={() => handleStatusUpdate('checked_in')}
            disabled={isUpdating}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Clock className="mr-2 h-4 w-4" />
            Check In
          </Button>
          <Button
            onClick={() => handleStatusUpdate('cancelled')}
            disabled={isUpdating}
            size="sm"
            variant="destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </>
      )}

      {currentStatus === 'checked_in' && (
        <Button
          onClick={() => handleStatusUpdate('checked_out')}
          disabled={isUpdating}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Check Out
        </Button>
      )}

      {currentStatus === 'checked_out' && (
        <Button
          onClick={() => handleStatusUpdate('completed')}
          disabled={isUpdating}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark Completed
        </Button>
      )}

      <Button
        onClick={() => router.push(`/bookings/${bookingId}/edit`)}
        disabled={isUpdating || isDeleting}
        size="sm"
        variant="outline"
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>

      <Button
        onClick={handleDelete}
        disabled={isUpdating || isDeleting}
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}
