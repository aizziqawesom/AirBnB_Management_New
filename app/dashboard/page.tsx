import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login (middleware should handle this, but just in case)
  if (!user) {
    redirect("/login");
  }

  // Sign out function
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
            <p className="text-gray-600 mb-4">
              You are successfully authenticated and viewing a protected route.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">User Information</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-blue-800">Email:</dt>
                  <dd className="text-blue-600">{user.email}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue-800">User ID:</dt>
                  <dd className="text-blue-600 font-mono">{user.id}</dd>
                </div>
                <div>
                  <dt className="font-medium text-blue-800">Created:</dt>
                  <dd className="text-blue-600">
                    {new Date(user.created_at || "").toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                🎉 Authentication is working!
              </h3>
              <p className="text-sm text-green-700">
                This page is protected by middleware. Only authenticated users can access it.
                Try signing out and accessing /dashboard - you'll be redirected to /login.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
