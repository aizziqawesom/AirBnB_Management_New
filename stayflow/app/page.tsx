import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Landing page for non-authenticated users
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/homely-logo.png"
              alt="Homely"
              width={100}
              height={100}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Homely
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your Airbnb properties with ease
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </div>

        <div className="pt-8 grid gap-4 sm:grid-cols-3 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold">Property Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage all your properties in one place
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Booking Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Track bookings and availability
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Automated Messages</h3>
            <p className="text-sm text-muted-foreground">
              Send automated messages to guests
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}