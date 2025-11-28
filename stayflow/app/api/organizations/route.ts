import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get organization name from request body
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    // Create the organization using admin client (bypasses RLS)
    const adminClient = createAdminClient();

    // First, create the organization
    const { data: organization, error: orgError } = await adminClient
      .from("organizations")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (orgError) {
      console.error("Failed to create organization:", orgError);
      return NextResponse.json(
        { error: "Failed to create organization" },
        { status: 500 }
      );
    }

    // Then, add the user as an admin member
    const { error: memberError } = await adminClient
      .from("organization_members")
      .insert({
        organization_id: organization.id,
        user_id: user.id,
        role: "admin",
      });

    if (memberError) {
      console.error("Failed to create organization member:", memberError);
      // Rollback: delete the organization
      await adminClient.from("organizations").delete().eq("id", organization.id);
      return NextResponse.json(
        { error: "Failed to add user to organization" },
        { status: 500 }
      );
    }

    return NextResponse.json({ organization }, { status: 201 });
  } catch (error) {
    console.error("Organization creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
