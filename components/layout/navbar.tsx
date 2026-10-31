
"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck, CalendarCog, CalendarPlus, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { IoIosLogOut } from "react-icons/io";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/#about" },
];

const profileMenuLinks = [
  { name: "Create Event", href: "/create-event", icon: CalendarPlus },
  { name: "Manage Events", href: "/manage-events", icon: CalendarCog },
  { name: "Joined Events", href: "/joined-events", icon: CalendarCheck },
];

type ProfileUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Declared outside Navbar so the component identity is stable across renders.
function ProfileImage({ user, size = 40 }: { user: ProfileUser; size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10"
      style={{ width: size, height: size }}
    >
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || "User"}
          fill
          sizes={`${size}px`}
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-semibold text-white">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
}

function ProfileDropdown({
  user,
  align = "end",
  triggerClassName = "",
  onNavigate,
  children,
}: {
  user: ProfileUser;
  align?: "start" | "center" | "end";
  triggerClassName?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={open ? "Close profile menu" : "Open profile menu"}
        aria-expanded={open}
        className={cn(
          "flex items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
          triggerClassName
        )}
      >
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} sideOffset={8} className="w-72">
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-2">
          <ProfileImage user={user} size={44} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-popover-foreground">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Navigation links */}
        {profileMenuLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-medium focus:bg-accent focus:text-accent-foreground ${
                isActive
                  ? "bg-secondary text-primary"
                  : "text-popover-foreground"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-primary" : "text-primary/80"}`}
                aria-hidden="true"
              />
              {link.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

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
            className="h-16 w-auto object-contain sm:h-20 md:h-24"
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
          <ThemeToggle />
          {!isPending &&
            (isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* User Profile Image */}
                <ProfileDropdown user={session.user} align="end">
                  <ProfileImage user={session.user} />
                </ProfileDropdown>

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

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background px-4 py-5 shadow-lg md:hidden">
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
                    <ProfileDropdown
                      user={session.user}
                      align="start"
                      triggerClassName="w-full gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
                      onNavigate={closeMenu}
                    >
                      <ProfileImage user={session.user} size={44} />
                      <span className="text-sm font-medium text-foreground">
                        {session.user.name}
                      </span>
                    </ProfileDropdown>

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
