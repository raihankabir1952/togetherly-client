"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
}

export function RecentEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events?limit=6`
        );

        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch recent events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="bg-white px-4 py-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-semibold text-green-700">
              MAKE A DIFFERENCE
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Recent Upcoming Events
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Discover opportunities to make a positive impact.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800"
          >
            View All Events <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-center text-gray-500">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No upcoming events available.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                    {event.eventType}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-green-700" />
                      {new Date(event.eventDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-green-700" />
                      <span className="line-clamp-1">{event.location}</span>
                    </p>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}