
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary px-4 py-2 text-sm font-medium text-primary">
            <Heart size={16} />
            Together, We Can Make a Difference
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Small Acts.
            <span className="mt-2 block text-primary">
              Greater Impact.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
            Join hands with your community to create positive change.
            Discover local events, volunteer your time, and make every
            small action count.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Create an Event
            </Link>
          </div>

          {/* Community Stats */}
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-border pt-7 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Users size={22} className="text-primary" />
                Community
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Driven by people
              </p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div>
              <p className="text-2xl font-bold text-foreground">
                Every Action
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Creates a difference
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-accent/15 blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
            <Image
              src="/images/hero-volunteers.jpg"
              alt="Community volunteers working together"
              width={700}
              height={600}
              priority
              className="h-[350px] w-full rounded-2xl object-cover sm:h-[430px]"
            />

            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Heart size={23} />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Be Part of Something Good
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Your time can change someone's life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
