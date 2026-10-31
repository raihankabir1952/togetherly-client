
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Loader2,
  CalendarX,
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="min-h-screen bg-background px-6 py-16 sm:py-20">
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

        {/* Events Grid */}
        {!isLoading && !error && events.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {events.length}
                </span>{" "}
                upcoming events
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {events.map((event) => (
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

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays size={16} className="shrink-0 text-primary" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>

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
              ))}

            </div>
          </>
        )}

      </div>
    </main>
  );
}
