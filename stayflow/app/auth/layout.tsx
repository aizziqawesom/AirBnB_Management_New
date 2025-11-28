import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or sign up to access your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Built with Next.js and Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
