import { createClient } from "@/lib/supabase/server";
import { getCurrentOrganization } from "@/lib/utils/organization";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user has organization
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    redirect("/setup");
  }

  return (
    <DashboardNav
      user={{ email: user.email || "", id: user.id }}
      organization={{ name: organization.name, id: organization.id }}
    >
      {children}
    </DashboardNav>
  );
}