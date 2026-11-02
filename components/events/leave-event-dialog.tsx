
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface LeaveEventDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeft: () => void;
}

export default function LeaveEventDialog({
  eventId,
  open,
  onOpenChange,
  onLeft,
}: LeaveEventDialogProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    try {
      setIsLeaving(true);

      // Get JWT token
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Failed to get authentication token.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to leave event.");
      }

      toast.success("You have successfully left this event!");

      onOpenChange(false);
      onLeft();
    } catch (error) {
      console.error("Leave event error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this event?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to leave this event? You can join again later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLeaving}
            onClick={(e) => {
              e.preventDefault();
              handleLeave();
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLeaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Leaving...
              </>
            ) : (
              "Leave Event"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
