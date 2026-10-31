
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface EditEventDialogProps {
  event: Event | null;
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export default function EditEventDialog({
  event,
  email,
  open,
  onOpenChange,
  onUpdated,
}: EditEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    thumbnail: "",
    location: "",
    eventDate: "",
  });

  useEffect(() => {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    setMinDate(localDate);
  }, []);

  useEffect(() => {
    if (!event) return;

    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: new Date(event.eventDate).toISOString().split("T")[0],
    });
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            creatorEmail: email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event.");
      }

      toast.success("Event updated successfully!");
      onOpenChange(false);
      onUpdated();
    } catch (error) {
      console.error("Event update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Event
          </DialogTitle>

          <DialogDescription>
            Update your event information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="edit-title" className="text-sm font-medium">
              Event Title
            </label>
            <input
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-eventType" className="text-sm font-medium">
              Event Type
            </label>
            <select
              id="edit-eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>Select event type</option>
              <option value="Cleanup">Cleanup</option>
              <option value="Plantation">Tree Plantation</option>
              <option value="Donation">Donation</option>
              <option value="Food Distribution">Food Distribution</option>
              <option value="Education">Education</option>
              <option value="Community Support">Community Support</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-description" className="text-sm font-medium">
              Event Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              rows={4}
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-thumbnail" className="text-sm font-medium">
              Thumbnail Image URL
            </label>
            <input
              id="edit-thumbnail"
              name="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-location" className="text-sm font-medium">
              Event Location
            </label>
            <input
              id="edit-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-eventDate" className="text-sm font-medium">
              Event Date
            </label>
            <input
              id="edit-eventDate"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              min={minDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !minDate}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
