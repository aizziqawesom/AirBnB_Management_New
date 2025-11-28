import { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: "admin" | "member";
  created_at: string;
}

/**
 * Get the current user's organization
 * @param supabase - Supabase client instance
 * @returns Organization or null if user has no organization
 */
export async function getCurrentOrganization(
  supabase: SupabaseClient
): Promise<Organization | null> {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Use admin client to bypass RLS when querying organization_members
    // This avoids RLS policy issues with SELECT permissions
    const adminClient = createAdminClient();

    // Query organization_members to get user's organizations
    const { data: memberData, error: memberError } = await adminClient
      .from("organization_members")
      .select(
        `
        organization_id,
        organizations (
          id,
          name,
          created_at,
          updated_at
        )
      `
      )
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (memberError || !memberData) {
      return null;
    }

    // Return the organization
    const org = memberData.organizations as unknown as Organization;
    return org;
  } catch (error) {
    console.error("Error getting current organization:", error);
    return null;
  }
}

/**
 * Require that the user has an organization, throw error if not
 * @param supabase - Supabase client instance
 * @returns Organization
 * @throws Error if user has no organization
 */
export async function requireOrganization(
  supabase: SupabaseClient
): Promise<Organization> {
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error(
      "No organization found. Please complete the setup process."
    );
  }

  return organization;
}

/**
 * Create a new organization with default message templates
 * @param supabase - Supabase client instance
 * @param name - Organization name
 * @param userId - User ID to set as admin
 * @returns Created organization
 */
export async function createOrganization(
  supabase: SupabaseClient,
  name: string,
  userId: string
): Promise<Organization> {
  try {
    // Insert into organizations table using regular client
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name,
      })
      .select()
      .single();

    if (orgError || !organization) {
      throw new Error(`Failed to create organization: ${orgError?.message}`);
    }

    // Use admin client to bypass RLS for organization_members insertion
    // This avoids the infinite recursion issue where RLS policy checks membership
    // by querying the same table it's protecting
    const adminClient = createAdminClient();

    // Insert into organization_members table (user as admin)
    const { error: memberError } = await adminClient
      .from("organization_members")
      .insert({
        organization_id: organization.id,
        user_id: userId,
        role: "admin",
      });

    if (memberError) {
      // Cleanup: delete the organization if member creation fails
      await adminClient.from("organizations").delete().eq("id", organization.id);
      throw new Error(
        `Failed to add user to organization: ${memberError.message}`
      );
    }

    // Create 3 default message templates using admin client
    const templates = [
      {
        organization_id: organization.id,
        name: "Booking Confirmation",
        recipient_type: "guest" as const,
        message_content:
          "Hi {guestName}! Your booking at {property} from {checkIn} to {checkOut} is confirmed. Total: RM{price}. See you soon! 🏠",
        is_active: true,
      },
      {
        organization_id: organization.id,
        name: "Pre-arrival Info",
        recipient_type: "guest" as const,
        message_content:
          "Hi {guestName}! Just a reminder - you're checking in tomorrow at {property}. Check-in time: 3 PM. Address: [To be filled]. WiFi password: [To be filled]. See you soon! 📱",
        is_active: true,
      },
      {
        organization_id: organization.id,
        name: "Cleaner Schedule",
        recipient_type: "cleaner" as const,
        message_content:
          "Cleaning scheduled at {property} on {checkOut}. Guest checkout: 12 PM. Please complete cleaning by 2 PM. Thank you! 🧹",
        is_active: true,
      },
    ];

    const { error: templatesError } = await adminClient
      .from("message_templates")
      .insert(templates);

    if (templatesError) {
      console.error("Failed to create message templates:", templatesError);
      // Don't throw error for templates, just log it
      // Organization is still valid even if templates fail
    }

    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
}