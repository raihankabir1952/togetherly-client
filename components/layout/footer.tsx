
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Sparkles,
  Users,
  CalendarDays,
  HandHeart,
} from "lucide-react";
import { FaGithub, FaEnvelope } from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Create an Event", href: "/create-event" },
];

const communityLinks = [
  { label: "Join Events", href: "/events" },
  { label: "Joined Events", href: "/joined-events" },
  { label: "Manage Events", href: "/manage-events" },
];

const features = [
  {
    icon: Users,
    title: "Connect",
    description: "Meet people who care.",
  },
  {
    icon: CalendarDays,
    title: "Participate",
    description: "Be part of meaningful events.",
  },
  {
    icon: HandHeart,
    title: "Make an Impact",
    description: "Create positive change.",
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0b241b] text-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-green-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top CTA */}
        <div className="relative -top-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#153d2c] to-[#1c5138] px-6 py-9 shadow-xl sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full border-[25px] border-white/5" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Sparkles size={14} />
                Be Part of Something Good
              </span>

              <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                Your Community Needs{" "}
                <span className="text-emerald-300">You.</span>
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/65">
                Bring your ideas to life. Create an event and inspire
                others to make a meaningful difference.
              </p>
            </div>

            <Link
              href="/create-event"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#123524] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-100 hover:shadow-lg"
            >
              Start an Event
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid gap-12 pb-14 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

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

            <p className="max-w-xs text-sm leading-7 text-white/60">
              Small Acts. Greater Impact. Togetherly connects people
              through meaningful community service and social
              development events.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
              <Heart size={13} className="fill-emerald-300" />
              Together, We Make It Better
            </div>

            {/* GitHub & Email */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/raihankabir1952"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <FaGithub size={19} />
              </a>

              <a
                href="mailto:raihankabir1952@gmail.com"
                aria-label="Send Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-emerald-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-emerald-400/50 transition-all group-hover:w-3 group-hover:bg-emerald-300" />
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Community
            </h3>

            <ul className="space-y-4">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors duration-200 hover:text-emerald-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-emerald-400/50 transition-all group-hover:w-3 group-hover:bg-emerald-300" />
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Values */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Why Togetherly?
            </h3>

            <div className="space-y-5">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                      <Icon size={17} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white/90">
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-white/45">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-white/45 sm:text-sm">
            © Togetherly. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-white/45 sm:text-sm">
            Made with
            <Heart
              size={14}
              className="fill-rose-500 text-rose-500"
            />
            for stronger communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
