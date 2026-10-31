
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

    // Fetch current user's events
    const fetchMyEvents = useCallback(async () => {
        if (!session?.user?.email) return;

        try {
            setError("");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my-events?email=${encodeURIComponent(session.user.email)}`
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
    }, [session?.user?.email]);

    useEffect(() => {
        if (isPending) return;

        if (!session?.user?.email) {
            setIsLoading(false);
            return;
        }

        fetchMyEvents();
    }, [session, isPending, fetchMyEvents]);

    // Format event date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Open edit dialog
    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setIsEditOpen(true);
    };

    return (
        <main className="min-h-screen bg-background px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                            Togetherly Dashboard
                        </span>

                        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                            Manage Events
                        </h1>

                        <p className="mt-3 text-muted-foreground">
                            Manage the community events you have created.
                        </p>
                    </div>

                    <Link
                        href="/create-event"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                        <Plus size={18} />
                        Create Event
                    </Link>
                </div>

                {/* Loading State */}
                {(isPending || isLoading) && (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2
                                size={36}
                                className="animate-spin text-primary"
                            />
                            <p className="text-sm text-muted-foreground">
                                Loading your events...
                            </p>
                        </div>
                    </div>
                )}

                {/* Login Required */}
                {!isPending && !session?.user?.email && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
                        <h2 className="text-xl font-semibold text-foreground">
                            Login Required
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Please login to manage your events.
                        </p>

                        <Link
                            href="/login"
                            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && !isPending && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
                        <p className="text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            onClick={fetchMyEvents}
                            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading &&
                    !error &&
                    session?.user?.email &&
                    events.length === 0 && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
                            <CalendarX
                                size={48}
                                className="mb-4 text-muted-foreground"
                            />

                            <h2 className="text-xl font-semibold text-foreground">
                                No Events Created Yet
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                You haven't created any events yet. Start making
                                a difference!
                            </p>

                            <Link
                                href="/create-event"
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                            >
                                <Plus size={17} />
                                Create Your First Event
                            </Link>
                        </div>
                    )}

                {/* Events Grid */}
                {!isLoading &&
                    !error &&
                    session?.user?.email &&
                    events.length > 0 && (
                        <>
                            <p className="mb-6 text-sm text-muted-foreground">
                                You have created{" "}
                                <span className="font-semibold text-foreground">
                                    {events.length}
                                </span>{" "}
                                events
                            </p>

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
                                                    <CalendarDays
                                                        size={16}
                                                        className="shrink-0 text-primary"
                                                    />
                                                    <span>
                                                        {formatDate(event.eventDate)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin
                                                        size={16}
                                                        className="shrink-0 text-primary"
                                                    />
                                                    <span className="line-clamp-1">
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Event Actions */}
                                            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4">

                                                {/* View */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toast.info("View feature coming soon!")
                                                    }
                                                    className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(event)}
                                                    className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/10"
                                                >
                                                    <Pencil size={16} />
                                                    Edit
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toast.info("Delete feature coming soon!")
                                                    }
                                                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
            </div>

            {/* Edit Event Dialog */}
            <EditEventDialog
                event={selectedEvent}
                email={session?.user?.email || ""}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onUpdated={fetchMyEvents}
            />
        </main>
    );
}
