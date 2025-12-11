'use client';

import { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarGrid } from './calendar-grid';
import { CalendarWeekView } from './calendar-week-view';
import { CalendarDayView } from './calendar-day-view';
import { getBookingsForMonth } from '@/lib/actions/calendar';
import type { BookingWithProperty } from '@/lib/types/booking';
import type { Property } from '@/lib/types/property';

type CalendarView = 'month' | 'week' | 'day';

interface CalendarViewClientProps {
  initialBookings: BookingWithProperty[];
  properties: Property[];
}

export function CalendarViewClient({
  initialBookings,
  properties,
}: CalendarViewClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [bookings, setBookings] = useState<BookingWithProperty[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<CalendarView>('month');

  // Fetch bookings when month or property filter changes
  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const data = await getBookingsForMonth(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          selectedProperty
        );
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [currentDate, selectedProperty]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
      );
    } else if (view === 'week') {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
      );
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRangeLabel = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={handlePrevious} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[250px] text-center">
              <h2 className="text-xl font-semibold">
                {getDateRangeLabel()}
              </h2>
            </div>
            <Button onClick={handleNext} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={handleToday} variant="outline" size="sm">
              Today
            </Button>
          </div>

          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Switcher */}
        <Tabs value={view} onValueChange={(v) => setView(v as CalendarView)}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar Views */}
      {view === 'month' && (
        <CalendarGrid
          currentDate={currentDate}
          bookings={bookings}
          isLoading={isLoading}
        />
      )}
      {view === 'week' && (
        <CalendarWeekView
          currentDate={currentDate}
          bookings={bookings}
          isLoading={isLoading}
        />
      )}
      {view === 'day' && (
        <CalendarDayView
          currentDate={currentDate}
          bookings={bookings}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
