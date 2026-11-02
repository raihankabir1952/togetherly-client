
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    CalendarDays,
    MapPin,
    Loader2,
    CalendarX,
    ArrowRight,
    Users,
    CheckCircle2,
    LogIn,
    Eye,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import LeaveEventDialog from "@/components/events/leave-event-dialog";

interface JoinedEvent {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: string;
    creatorEmail: string;
    joinedAt: string;
}

export default function JoinedEventsPage() {
    const { data: session, isPending: isSessionPending } =
        authClient.useSession();

    const userEmail = session?.user?.email;

    const [events, setEvents] = useState<JoinedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedEvent, setSelectedEvent] =
        useState<JoinedEvent | null>(null);

    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

    // Fetch joined events

    const fetchJoinedEvents = useCallback(async () => {
        if (!userEmail) return;

        try {
            setIsLoading(true);
            setError("");

            // Get JWT token
            const { data: tokenData, error } = await authClient.token();

            if (error || !tokenData?.token) {
                throw new Error("Failed to get authentication token.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/joined-events`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch joined events."
                );
            }

            setEvents(data.events || []);
        } catch (error) {
            console.error("Joined events error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(false);
        }
    }, [userEmail]);


    useEffect(() => {
        if (isSessionPending) return;

        if (!userEmail) {
            setIsLoading(false);
            return;
        }

        fetchJoinedEvents();
    }, [isSessionPending, userEmail, fetchJoinedEvents]);

    // Format event date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Check event status
    const isCompleted = (date: string) => {
        const eventDate = new Date(date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate < today;
    };

    const upcomingEvents = events.filter(
        (event) => !isCompleted(event.eventDate)
    );

    const completedEvents = events.filter(
        (event) => isCompleted(event.eventDate)
    );

    // Loading state
    if (isSessionPending || isLoading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <p className="text-sm text-muted-foreground">
                        Loading your joined events...
                    </p>
                </div>
            </main>
        );
    }

    // Login required
    if (!userEmail) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                        <LogIn className="h-8 w-8 text-green-700" />
                    </div>

                    <h1 className="text-2xl font-bold">
                        Login Required
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        Please login to see the events you have joined.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
                    >
                        Login Now
                    </Link>
                </div>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <CalendarX className="mx-auto mb-4 h-12 w-12 text-red-500" />

                    <h2 className="text-2xl font-bold">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        {error}
                    </p>

                    <Button
                        onClick={fetchJoinedEvents}
                        className="mt-6 bg-green-700 hover:bg-green-800"
                    >
                        Try Again
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-10">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
                        <Users className="h-4 w-4" />
                        My Activities
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Joined Events
                    </h1>

                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                        Keep track of the community events you have joined.
                        Every small action creates a greater impact.
                    </p>
                </div>

                {/* Statistics */}
                <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Total Joined
                            </p>
                            <Users className="h-5 w-5 text-green-700" />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {events.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Upcoming Events
                            </p>
                            <CalendarDays className="h-5 w-5 text-green-700" />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {upcomingEvents.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Completed Events
                            </p>
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>

                        <p className="mt-3 text-3xl font-bold">
                            {completedEvents.length}
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                {events.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                            <CalendarX className="h-8 w-8 text-green-700" />
                        </div>

                        <h2 className="text-2xl font-bold">
                            No Joined Events Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                            You haven't joined any community events yet.
                            Explore upcoming events and become part of something meaningful.
                        </p>

                        <Link
                            href="/events"
                            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
                        >
                            Explore Events
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">

                        {/* Upcoming Events */}
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Upcoming Events
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Events you are going to participate in.
                                    </p>
                                </div>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
                                    {upcomingEvents.length}
                                </span>
                            </div>

                            {upcomingEvents.length === 0 ? (
                                <div className="rounded-xl border border-border bg-card p-8 text-center">
                                    <p className="text-muted-foreground">
                                        No upcoming events. Explore more events to join!
                                    </p>
                                    <Button
                                        render={<Link href="/events" />}
                                        variant="link"
                                        className="mt-2 text-green-700"
                                    >
                                        Explore Events
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event._id}
                                            className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-52 overflow-hidden bg-muted">
                                                <Image
                                                    src={event.thumbnail}
                                                    alt={event.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition duration-500 group-hover:scale-105"
                                                />

                                                <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white">
                                                    {event.eventType}
                                                </span>

                                                <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-800">
                                                    Upcoming
                                                </span>
                                            </div>

                                            {/* Event Information */}
                                            <div className="p-5">
                                                <h3 className="line-clamp-1 text-lg font-bold">
                                                    {event.title}
                                                </h3>

                                                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                                                    {event.description}
                                                </p>

                                                <div className="mt-4 space-y-3 border-t border-border pt-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <CalendarDays className="h-4 w-4 shrink-0 text-green-700" />
                                                        <span>{formatDate(event.eventDate)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4 shrink-0 text-green-700" />
                                                        <span className="line-clamp-1">
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-5 flex gap-2">
                                                    <Link
                                                        href={`/events/${event._id}`}
                                                        className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>

                                                    <Button
                                                        variant="outline"
                                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900"
                                                        onClick={() => {
                                                            setSelectedEvent(event);
                                                            setIsLeaveDialogOpen(true);
                                                        }}
                                                    >
                                                        Leave
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Completed Events */}
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Completed Events
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your previously joined events.
                                    </p>
                                </div>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                    {completedEvents.length}
                                </span>
                            </div>

                            {completedEvents.length === 0 ? (
                                <div className="rounded-xl border border-border bg-card p-8 text-center">
                                    <p className="text-muted-foreground">
                                        You haven't completed any events yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {completedEvents.map((event) => (
                                        <div
                                            key={event._id}
                                            className="overflow-hidden rounded-2xl border border-border bg-card opacity-90"
                                        >
                                            <div className="relative h-52 overflow-hidden bg-muted">
                                                <Image
                                                    src={event.thumbnail}
                                                    alt={event.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover grayscale-[30%]"
                                                />

                                                <span className="absolute left-4 top-4 rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white">
                                                    Completed
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="line-clamp-1 text-lg font-bold">
                                                    {event.title}
                                                </h3>

                                                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
                                                    {event.description}
                                                </p>

                                                <div className="mt-4 space-y-3 border-t border-border pt-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <CalendarDays className="h-4 w-4 shrink-0" />
                                                        {formatDate(event.eventDate)}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4 shrink-0" />
                                                        <span className="line-clamp-1">
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    render={
                                                        <Link href={`/events/${event._id}`} />
                                                    }
                                                    variant="outline"
                                                    className="mt-5 w-full"
                                                >
                                                    View Details
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Leave Confirmation Dialog */}
            {selectedEvent && (
                <LeaveEventDialog
                    eventId={selectedEvent._id}
                    // email={userEmail}
                    open={isLeaveDialogOpen}
                    onOpenChange={(open) => {
                        setIsLeaveDialogOpen(open);

                        if (!open) {
                            setSelectedEvent(null);
                        }
                    }}
                    onLeft={async () => {
                        setSelectedEvent(null);
                        await fetchJoinedEvents();
                    }}
                />
            )}
        </main>
    );
}
