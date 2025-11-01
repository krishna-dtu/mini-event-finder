import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import ThemeToggle from "@/components/theme-toggle"
import UserMenu from "@/components/user-menu"

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            EventSphere
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/events/map" className="hover:text-accent transition-colors">
              Map View
            </Link>
            {user && (
              <Link href="/events/create" className="hover:text-accent transition-colors">
                Create Event
              </Link>
            )}
          </div>

          {/* Theme Toggle & Auth Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <UserMenu userEmail={user.email} />
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors">
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 text-sm font-medium bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <MobileMenu user={user} />
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileMenu({ user }: { user: any }) {
  return <div className="md:hidden">{/* Mobile menu would go here - simplified for now */}</div>
}
