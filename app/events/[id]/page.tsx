
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
    CalendarDays,
    MapPin,
    ArrowLeft,
    Loader2,
    CalendarX,
    UserRound,
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

interface Organizer {
    id: string;
    name: string;
    email: string;
    image: string | null;
}

interface EventDetailsResponse {
    success: boolean;
    event: Event;
    organizer: Organizer | null;
}

export default function EventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [id, setId] = useState("");

    const [event, setEvent] = useState<Event | null>(null);
    const [organizer, setOrganizer] = useState<Organizer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        params.then(({ id }) => {
            setId(id);
        });
    }, [params]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
                );

                const data: EventDetailsResponse = await response.json();

                if (!response.ok) {
                    throw new Error("Unable to load event details.");
                }

                setEvent(data.event);
                setOrganizer(data.organizer);
            } catch (error) {
                console.error("Event details error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Loader2 className="h-9 w-9 animate-spin text-primary" />
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
                <CalendarX className="mb-4 h-12 w-12 text-muted-foreground" />

                <h2 className="text-2xl font-bold text-foreground">
                    Event Not Found
                </h2>

                <p className="mt-2 text-muted-foreground">
                    {error || "This event may have been removed."}
                </p>

                <Link
                    href="/events"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Events
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(event.eventDate).toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

    return (
        <main className="min-h-screen bg-background px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-5xl">

                {/* Back Button */}
                <Link
                    href="/events"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft size={18} />
                    Back to Events
                </Link>

                {/* Event Image */}
                <div className="relative h-64 overflow-hidden rounded-2xl bg-muted sm:h-96">
                    {event.thumbnail ? (
                        <Image
                            src={event.thumbnail}
                            alt={event.title}
                            fill
                            unoptimized
                            priority
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <CalendarDays className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4">
                        <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow">
                            {event.eventType}
                        </span>
                    </div>
                </div>

                {/* Event Information */}
                <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px]">

                    {/* Main Content */}
                    <div>
                        <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                            {event.title}
                        </h1>

                        {/* Date and Location */}
                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <CalendarDays size={21} />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Event Date
                                    </p>
                                    <p className="font-medium text-foreground">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <MapPin size={21} />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Location
                                    </p>
                                    <p className="font-medium text-foreground">
                                        {event.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-10 border-t border-border pt-7">
                            <h2 className="text-2xl font-bold text-foreground">
                                About This Event
                            </h2>

                            <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Organizer Profile */}
                    <aside>
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-foreground">
                                Event Organizer
                            </h2>

                            {organizer ? (
                                <div className="mt-5 flex items-center gap-4">
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                                        {organizer.image ? (
                                            <Image
                                                src={organizer.image}
                                                alt={organizer.name}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <UserRound className="h-7 w-7 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-foreground">
                                            {organizer.name}
                                        </h3>

                                        <p className="mt-1 break-all text-sm text-muted-foreground">
                                            {organizer.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    Organizer information is unavailable.
                                </p>
                            )}

                            <div className="mt-5 rounded-lg bg-primary/5 p-3">
                                <p className="text-sm leading-6 text-muted-foreground">
                                    This event is organized by a community member who wants
                                    to make a positive difference.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
