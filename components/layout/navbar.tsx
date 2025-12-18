import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/search-bar";
import { Logo, LogoIcon } from "@/components/layout/logo";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="hidden h-8 sm:block" />
          <LogoIcon className="h-8 w-8 sm:hidden" />
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-600/20">
            BETA
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <SearchBar className="hidden flex-1 max-w-md mx-8 lg:block" />

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Mobile Search - Navigate to search page */}
          <Link href="/search" className="lg:hidden text-stone-600 hover:text-stone-900">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Submit Button */}
          {user && (
            <Link href="/submit">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Submit</span>
              </Button>
            </Link>
          )}

          {/* Auth State */}
          {user ? (
            <UserNav user={user} />
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <button className="lg:hidden text-stone-600 hover:text-stone-900">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
