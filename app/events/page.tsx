
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Loader2,
  CalendarX,
  Search,
  SearchX,
} from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
}

// Event types supported by the create/edit event forms
const EVENT_CATEGORIES = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Food Distribution",
  "Education",
  "Community Support",
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }

        const data = await response.json();

        setEvents(data.events || []);
      } catch (error) {
        console.error("Events fetching error:", error);
        setError("Unable to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (date: string) => {
    const today = new Date();
    const eventDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const difference = eventDate.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  // Filter options: "All", every app-supported category, plus any other
  // event types present in the data so nothing becomes unreachable.
  const categories = useMemo(() => {
    const typesInData = new Set(events.map((event) => event.eventType));
    const extraTypes = Array.from(typesInData).filter(
      (type) => !EVENT_CATEGORIES.includes(type)
    );

    return ["All", ...EVENT_CATEGORIES, ...extraTypes];
  }, [events]);

  // Category filter and search work together (both must match)
  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "All" ||
        event.eventType.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        query === "" ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchQuery]);


  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Togetherly Community
          </span>

          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Upcoming Events
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Discover upcoming community events and make a difference.
            Join hands with others to create positive change.
          </p>
        </div>

        {/* Search & Category Filters */}
        {!isLoading && !error && events.length > 0 && (
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-primary text-white"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-72 lg:shrink-0">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title or location..."
                aria-label="Search events by title or location"
                className="w-full rounded-lg border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={36} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading events...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && events.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
            <CalendarX size={48} className="mb-4 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-foreground">
              No Upcoming Events
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are no upcoming events right now. Check back later!
            </p>
          </div>
        )}

        {/* No Matches State */}
        {!isLoading && !error && events.length > 0 && filteredEvents.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-4 text-center">
            <SearchX size={48} className="mb-4 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-foreground">
              No Events Found
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              No events match your search or selected category. Try
              adjusting your filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && filteredEvents.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredEvents.length}
                </span>{" "}
                upcoming events
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const daysRemaining = getDaysRemaining(event.eventDate);

                return (
                  <article
                    key={event._id}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Event Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-muted">
                      <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        {event.eventType}
                      </span>
                    </div>

                    {/* Event Information */}
                    <div className="p-5">
                      <h2 className="line-clamp-1 text-xl font-semibold text-foreground">
                        {event.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-3 border-t border-border pt-4">
                        {/* Event Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays size={16} className="shrink-0 text-primary" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">
                            {daysRemaining === 0
                              ? "Event is today!"
                              : daysRemaining === 1
                                ? "1 day remaining"
                                : `${daysRemaining} days remaining`}
                          </span>
                        </div>

                        {/* Event Location */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={16} className="shrink-0 text-primary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      {/* View Details */}
                      <Link
                        href={`/events/${event._id}`}
                        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );

}
