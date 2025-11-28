import { createClient } from "@supabase/supabase-js";

/**
 * Admin client with service role key - bypasses RLS
 * ONLY use for administrative operations like organization setup
 * DO NOT expose to client-side code
 *
 * This client should ONLY be used in server-side code for:
 * - Initial organization setup
 * - Administrative operations that require bypassing RLS
 * - Operations that would otherwise cause RLS recursion
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase admin credentials. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local"
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  });
}
