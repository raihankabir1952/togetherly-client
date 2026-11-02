
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Loader2,
  CalendarX,
  UserRound,
  Mail,
  Users,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import LeaveEventDialog from "@/components/events/leave-event-dialog";

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
  image?: string;
}

interface EventDetailsResponse {
  success: boolean;
  event: Event;
  organizer: Organizer | null;
  message?: string;
}

interface Participant {
  name: string;
  image?: string;
}

interface ParticipantsResponse {
  success: boolean;
  totalParticipants: number;
  participants: Participant[];
  message?: string;
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const userEmail = session?.user?.email;

  const [id, setId] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isParticipantsLoading, setIsParticipantsLoading] =
    useState(true);
  const [participantsError, setParticipantsError] = useState("");

  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isCheckingJoinStatus, setIsCheckingJoinStatus] =
    useState(false);

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  // Get event ID from route params
  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
    });
  }, [params]);

  // Fetch event details
  useEffect(() => {
    if (!id) return;

    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
        );

        const data: EventDetailsResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load event details."
          );
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

    fetchEventDetails();
  }, [id]);

  // Fetch joined participants
  useEffect(() => {
    if (!id) return;

    let isActive = true;

    const fetchParticipants = async () => {
      try {
        setIsParticipantsLoading(true);
        setParticipantsError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${id}/participants`
        );

        const data: ParticipantsResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load participants."
          );
        }

        if (isActive) {
          setParticipants(data.participants);
          setTotalParticipants(data.totalParticipants);
        }
      } catch (error) {
        console.error("Participants error:", error);

        if (isActive) {
          setParticipantsError(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isActive) {
          setIsParticipantsLoading(false);
        }
      }
    };

    fetchParticipants();

    return () => {
      isActive = false;
    };
  }, [id]);

  // Check whether the current user has joined this event
  useEffect(() => {
    if (isSessionPending || !event) return;

    // Logged-out users and the event organizer cannot join, so there is
    // nothing to check. Their join state stays at its default (not joined,
    // not checking) and the UI does not read it in those cases.
    if (!userEmail || event.creatorEmail === userEmail) return;

    let isActive = true;

    const checkJoinStatus = async () => {
      try {
        setIsCheckingJoinStatus(true);

        // Get JWT token
        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
          throw new Error("Failed to get authentication token.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}/join-status`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to check join status."
          );
        }

        if (isActive) {
          setIsJoined(data.isJoined);
        }
      } catch (error) {
        console.error("Join status error:", error);
      } finally {
        if (isActive) {
          setIsCheckingJoinStatus(false);
        }
      }
    };

    checkJoinStatus();

    return () => {
      isActive = false;
    };
  }, [event, userEmail, isSessionPending]);

  // Join event
  const handleJoinEvent = async () => {
    if (!userEmail) {
      toast.info("Please login to join this event.");
      router.push(
        `/login?callbackURL=${encodeURIComponent(`/events/${event._id}`)}`
      );
      return;
    }

    if (!event) return;

    try {
      setIsJoining(true);

      // Get JWT token
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Failed to get authentication token.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 409) {
        setIsJoined(true);
        toast.info("You have already joined this event.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to join this event.");
      }

      setIsJoined(true);
      toast.success("You have successfully joined this event!");
    } catch (error) {
      console.error("Join event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleGetToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data) {
      console.error("Token Error:", error);
      return;
    }

    const response = await fetch("http://localhost:5000/test-token", {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    console.log(await response.json());
  };

  // Loading state
  if (isLoading || isSessionPending || !id) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-muted-foreground">
            Loading event details...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <CalendarX className="mx-auto mb-4 h-12 w-12 text-red-500" />

          <h2 className="text-2xl font-bold">
            Event Not Found
          </h2>

          <p className="mt-2 text-muted-foreground">
            {error || "This event does not exist or may have been removed."}
          </p>

          <Button
            render={<Link href="/events" />}
            className="mt-6 bg-green-700 hover:bg-green-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </main>
    );
  }

  const isOwnEvent = userEmail === event.creatorEmail;

  const eventDate = new Date(event.eventDate);

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isPastEvent = eventDate.getTime() < Date.now();


  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        {/* Event Cover */}
        <div className="relative mb-8 h-[260px] overflow-hidden rounded-2xl bg-muted sm:h-[400px]">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            unoptimized
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <span className="absolute bottom-5 left-5 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white">
            {event.eventType}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Main Event Information */}
          <div>
            <div className="mb-5">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {event.title}
              </h1>

              <div className="mt-5 flex flex-col gap-3 text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-green-700" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-700" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* About Event */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-bold">About This Event</h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
                {event.description}
              </p>
            </div>

            {/* Participants */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                  <Users className="h-5 w-5" />
                </span>
                Participants
                {!isParticipantsLoading &&
                  !participantsError &&
                  totalParticipants > 0 && (
                    <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                      {totalParticipants} Joined
                    </span>
                  )}
              </h2>

              {isParticipantsLoading ? (
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-green-700" />
                  Loading participants...
                </div>
              ) : participantsError ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Participant information is not available.
                </p>
              ) : totalParticipants === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No one has joined this event yet. Be the first to
                  make a difference!
                </p>
              ) : (
                <>
                  <div className="mt-5 flex flex-wrap gap-4">
                    {participants.slice(0, 5).map((participant, index) => (
                      <div
                        key={`${participant.name}-${index}`}
                        className="flex w-20 flex-col items-center gap-2 text-center"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
                          {participant.image ? (
                            <Image
                              src={participant.image}
                              alt={participant.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <UserRound className="h-7 w-7 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <span className="w-full break-words text-xs font-medium text-foreground">
                          {participant.name}
                        </span>
                      </div>
                    ))}

                    {totalParticipants > 5 && (
                      <div className="flex w-20 flex-col items-center gap-2 text-center">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                          +{totalParticipants - 5}
                        </div>

                        <span className="text-xs font-medium text-muted-foreground">
                          more
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Organizer Information */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-bold">Event Organizer</h2>

              {organizer ? (
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
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
                      <div className="flex h-full w-full items-center justify-center">
                        <UserRound className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      {organizer.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {organizer.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Organizer information is not available.
                </p>
              )}
            </div>

            {/* Community Guidelines */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                  <span className="text-lg">✓</span>
                </span>
                Community Guidelines
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Help us create a safe and welcoming community.
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Respect Everyone
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Treat all participants with kindness and respect. Everyone
                      deserves a welcoming environment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Be Responsible
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Follow the event rules and organizer instructions. Arrive
                      on time and participate responsibly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Protect Our Environment
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Keep the surroundings clean, respect public spaces, and
                      help maintain a safe environment for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Event Sidebar */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Be Part of the Change
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Join this community event and help make a positive impact.
                Every small action matters.
              </p>

              <div className="mt-6 space-y-4 border-y border-border py-5">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">Event Date</p>
                    <p className="text-sm font-medium">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">Participation</p>
                    <p className="text-sm font-medium">Community Welcome</p>
                  </div>
                </div>
              </div>

              {/* Own Event */}
              {isOwnEvent ? (
                <div className="mt-5 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-800 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 className="mx-auto mb-2 h-5 w-5" />
                  You are the organizer of this event.
                </div>
              ) : isPastEvent ? (
                <div className="mt-5 rounded-lg bg-muted p-4 text-center text-sm font-medium text-muted-foreground">
                  This event has already started.
                </div>
              ) : !userEmail ? (
                <Button
                  className="mt-6 w-full bg-green-700 hover:bg-green-800"
                  onClick={() =>
                    router.push(
                      `/login?callbackURL=${encodeURIComponent(`/events/${event._id}`)}`
                    )
                  }
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to Join
                </Button>
              ) : (
                <div className="mt-6">
                  {isCheckingJoinStatus ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Status...
                    </Button>
                  ) : isJoined ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-800 dark:bg-green-950/40 dark:text-green-300">
                        <CheckCircle2 className="h-5 w-5" />
                        You have joined this event
                      </div>

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setIsLeaveDialogOpen(true)}
                      >
                        Leave Event
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-green-700 hover:bg-green-800"
                      onClick={handleJoinEvent}
                      disabled={isJoining}
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        "Join Event"
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Temporary JWT Test Button */}
              {userEmail && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={handleGetToken}
                >
                  {/* Get JWT Token */}
                </Button>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Leave Confirmation Dialog */}
      {userEmail && (
        <LeaveEventDialog
          eventId={event._id}
          email={userEmail}
          open={isLeaveDialogOpen}
          onOpenChange={setIsLeaveDialogOpen}
          onLeft={() => setIsJoined(false)}
        />
      )}
    </main>
  );

}
