"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
}

interface DeleteEventDialogProps {
  event: Event | null;
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void | Promise<void>;
}

export default function DeleteEventDialog({
  event,
  email,
  open,
  onOpenChange,
  onDeleted,
}: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!event) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event.");
      }

      toast.success("Event deleted successfully!");
      onOpenChange(false);
      await onDeleted();
    } catch (error) {
      console.error("Delete event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete event."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Event?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {event?.title}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting || !event}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}