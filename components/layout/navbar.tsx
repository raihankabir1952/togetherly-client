
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { IoIosLogOut } from "react-icons/io";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/#about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  console.log("Google User:", session?.user);

  const isLoggedIn = !!session?.user;

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      closeMenu();
      toast.success("Logged out successfully.");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Profile image with fallback
  const ProfileImage = ({ size = 40 }: { size?: number }) => (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10"
      style={{ width: size, height: size }}
    >
      {session?.user?.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          fill
          sizes={`${size}px`}
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-semibold text-white">
          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="shrink-0">
          <Image
            src="/logo/togetherly-logo.png"
            alt="Togetherly"
            width={240}
            height={70}
            priority
            className="h-24 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/#about" ? false : pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!isPending &&
            (isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* User Profile Image */}
                <ProfileImage />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging Out...
                    </>
                  ) : (
                    <>
                      <span>Logout</span>
                      <IoIosLogOut size={20} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-background px-4 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary ${
                  pathname === link.href
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              {!isPending &&
                (isLoggedIn ? (
                  <>
                    {/* Mobile User Profile */}
                    <div className="flex items-center gap-3 px-3 py-2">
                      <ProfileImage size={44} />
                      <span className="text-sm font-medium text-foreground">
                        {session.user.name}
                      </span>
                    </div>

                    {/* Mobile Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoggingOut ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Logging Out...
                        </>
                      ) : (
                        <>
                          <IoIosLogOut size={20} />
                          Logout
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold transition-colors hover:bg-secondary"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Get Started
                    </Link>
                  </>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
