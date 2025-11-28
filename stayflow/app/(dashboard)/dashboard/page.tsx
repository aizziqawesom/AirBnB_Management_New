import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Email</CardTitle>
            <CardDescription>Your registered email address</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Current account status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User ID</CardTitle>
            <CardDescription>Your unique identifier</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm truncate">{user?.id}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your dashboard features will be added here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
