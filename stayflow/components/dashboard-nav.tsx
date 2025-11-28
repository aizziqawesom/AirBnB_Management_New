"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Home,
  Calendar,
  CalendarDays,
  MessageSquare,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  children: React.ReactNode;
  user: {
    email: string;
    id: string;
  };
  organization: {
    name: string;
    id: string;
  };
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Properties",
    href: "/properties",
    icon: Home,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: Calendar,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
];

export function DashboardNav({
  children,
  user,
  organization,
}: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const NavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-bold">StayFlow</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {organization.name}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks />
          </div>

          {/* User Section */}
          <div className="border-t px-3 py-4">
            <div className="mb-2 px-3">
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-20 border-b bg-background lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div>
            <h2 className="text-lg font-bold">StayFlow</h2>
            <p className="text-xs text-muted-foreground">
              {organization.name}
            </p>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b px-6 py-4 text-left">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                  <NavLinks />
                </div>

                <div className="border-t px-3 py-4">
                  <div className="mb-2 px-3">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <div className="container mx-auto p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}