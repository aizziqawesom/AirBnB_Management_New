import { Suspense } from 'react';
import { DollarSign, Home, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentBookings } from '@/components/dashboard/recent-bookings';
import { getDashboardStats, getRecentBookings } from '@/lib/services/dashboard';

export const dynamic = 'force-dynamic';

// Loading skeletons
function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookingsLoading() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Async data-fetching components
async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`RM ${stats.totalRevenue.toLocaleString('en-MY', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
        icon={DollarSign}
        description="From all bookings"
      />
      <StatCard
        title="Total Properties"
        value={stats.totalProperties.toString()}
        icon={Home}
        description={`${stats.totalProperties} ${stats.totalProperties === 1 ? 'property' : 'properties'} listed`}
      />
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings.toString()}
        icon={Calendar}
        description="All time bookings"
      />
      <StatCard
        title="Confirmed Bookings"
        value={stats.confirmedBookings.toString()}
        icon={CheckCircle}
        description="Active reservations"
      />
    </div>
  );
}

async function RecentBookingsList() {
  const bookings = await getRecentBookings();
  return <RecentBookings bookings={bookings} />;
}

// Main page component
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<BookingsLoading />}>
        <RecentBookingsList />
      </Suspense>
    </div>
  );
}
