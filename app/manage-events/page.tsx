
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Loader2,
  CalendarX,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import EditEventDialog from "@/components/events/edit-event-dialog";
import DeleteEventDialog from "@/components/events/delete-event-dialog";

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

export default function ManageEventsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedDeleteEvent, setSelectedDeleteEvent] =
    useState<Event | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const userEmail = session?.user?.email;

  // Fetch current user's events
  const fetchMyEvents = useCallback(async () => {
    if (!userEmail) return;

    try {
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-events?email=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch your events.");
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Manage events error:", error);
      setError("Unable to load your events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    fetchMyEvents();
  }, [isPending, userEmail, fetchMyEvents]);

  // Open edit dialog
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  // Open delete confirmation dialog
  const handleDelete = (event: Event) => {
    setSelectedDeleteEvent(event);
    setIsDeleteOpen(true);
  };

  // Loading state
  if (isPending || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login required
  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <CalendarX className="mb-4 h-12 w-12 text-muted-foreground" />

        <h2 className="text-2xl font-bold">
          Login Required
        </h2>

        <p className="mt-2 text-muted-foreground">
          Please login to manage your events.
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-2 text-muted-foreground">
              View, edit, and manage the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            Create Event
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && events.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <CalendarX className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-foreground">
              No Events Found
            </h2>

            <p className="mt-2 text-muted-foreground">
              You have not created any events yet.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Create Your First Event
            </Link>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Event Image */}
                <div className="relative h-52 w-full bg-muted">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    {event.eventType}
                  </span>
                </div>

                {/* Event Information */}
                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-bold text-foreground">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="shrink-0" />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="shrink-0" />
                      {new Date(event.eventDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-2 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleEdit(event)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-50 px-2 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(event)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Event Dialog */}
        <EditEventDialog
          event={selectedEvent}
          email={userEmail || ""}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onUpdated={fetchMyEvents}
        />

        {/* Delete Event Dialog */}
        <DeleteEventDialog
          event={selectedDeleteEvent}
          email={userEmail || ""}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onDeleted={fetchMyEvents}
        />

      </div>
    </section>
  );
}
