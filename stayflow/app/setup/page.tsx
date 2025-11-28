import { createClient } from "@/lib/supabase/server";
import { getCurrentOrganization } from "@/lib/utils/organization";
import { redirect } from "next/navigation";
import { SetupForm } from "@/components/setup-form";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user already has an organization
  const organization = await getCurrentOrganization(supabase);

  if (organization) {
    // User already has an organization, redirect to dashboard
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to StayFlow</h1>
          <p className="mt-2 text-muted-foreground">
            Let&apos;s get started by setting up your organization
          </p>
        </div>
        <SetupForm userId={user.id} />
      </div>
    </div>
  );
}