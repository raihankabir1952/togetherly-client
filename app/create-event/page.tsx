
"use client";

import { useEffect, useState } from "react";
import {
  CalendarPlus,
  MapPin,
  Image as ImageIcon,
  CalendarDays,
  Send,
} from "lucide-react";

export default function CreateEventPage() {
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    setMinDate(localDate);
  }, []);

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
            <CalendarPlus size={28} />
          </div>

          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Create an Event
          </h1>

          <p className="mt-3 text-muted-foreground">
            Bring your community together and make a positive impact.
          </p>
        </div>

        {/* Event Form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

          <div className="mb-7">
            <h2 className="text-xl font-semibold text-foreground">
              Event Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below to create your community event.
            </p>
          </div>

          <form className="space-y-6">

            {/* Event Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Event Title <span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Community Park Cleanup"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <label htmlFor="eventType" className="text-sm font-medium">
                Event Type <span className="text-red-500">*</span>
              </label>

              <select
                id="eventType"
                name="eventType"
                required
                defaultValue=""
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="" disabled>
                  Select event type
                </option>
                <option value="Cleanup">Cleanup</option>
                <option value="Plantation">Tree Plantation</option>
                <option value="Donation">Donation</option>
                <option value="Food Distribution">Food Distribution</option>
                <option value="Education">Education</option>
                <option value="Community Support">Community Support</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Event Description <span className="text-red-500">*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Describe your event and how people can participate..."
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label
                htmlFor="thumbnail"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ImageIcon size={16} />
                Thumbnail Image URL <span className="text-red-500">*</span>
              </label>

              <input
                id="thumbnail"
                name="thumbnail"
                type="url"
                required
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <p className="text-xs text-muted-foreground">
                Provide a valid image URL for your event.
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <MapPin size={16} />
                Event Location <span className="text-red-500">*</span>
              </label>

              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <label
                htmlFor="eventDate"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <CalendarDays size={16} />
                Event Date <span className="text-red-500">*</span>
              </label>

              <input
                id="eventDate"
                name="eventDate"
                type="date"
                required
                min={minDate}
                disabled={!minDate}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Submit Button */}
            <div className="border-t border-border pt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Send size={17} />
                Create Event
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Fields marked with * are required.
              </p>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
