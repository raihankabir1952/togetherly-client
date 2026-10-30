
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Create an Event", href: "/create-event" },
];

const communityLinks = [
  { label: "Join Events", href: "/upcoming-events" },
  { label: "Joined Events", href: "/joined-events" },
  { label: "Manage Events", href: "/manage-events" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo/togetherly-logo.png"
                alt="Togetherly"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Small Acts. Greater Impact. Togetherly connects people
              through meaningful community service and social development
              events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-foreground">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-foreground">
              Community
            </h3>

            <ul className="space-y-4">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-foreground">
              Get Involved
            </h3>

            <p className="mb-5 text-sm leading-7 text-muted-foreground">
              Have an idea to make your community better? Start an event
              and invite others to make a difference.
            </p>

            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              Create an Event
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © 2026 Togetherly. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Made with
            <Heart size={14} className="fill-red-500 text-red-500" />
            for stronger communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
