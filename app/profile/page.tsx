
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Camera,
    Loader2,
    Mail,
    Pencil,
    UserRound,
    CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const [previewError, setPreviewError] = useState(false);

    // Set existing user information
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setImage(user.image || "");
            setPreviewError(false);
        }
    }, [user]);

    // Redirect unauthenticated users
    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/login?callbackURL=/profile");
        }
    }, [isPending, user, router]);

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);

        if (open && user) {
            setName(user.name || "");
            setImage(user.image || "");
            setPreviewError(false);
        }
    };

    const handleSaveChanges = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedImage = image.trim();

        if (!trimmedName) {
            toast.error("Name is required.");
            return;
        }

        if (trimmedImage) {
            try {
                const parsedUrl = new URL(trimmedImage);

                if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                    throw new Error("Invalid image URL");
                }
            } catch {
                toast.error("Please enter a valid image URL.");
                return;
            }
        }

        try {
            setIsSaving(true);

            const { error } = await authClient.updateUser({
                name: trimmedName,
                image: trimmedImage || null,
            });

            if (error) {
                toast.error(error.message || "Profile update failed.");
                return;
            }

            toast.success("Profile updated successfully.");

            setIsDialogOpen(false);

            // Refresh session and updated profile information
            await authClient.getSession();
            router.refresh();
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isPending || !user) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">Loading your profile...</p>
                </div>
            </main>
        );
    }

    const displayName = user.name || "User";
    const profileImage = user.image || "";

    return (
        <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-4xl">
                {/* Page Heading */}
                <div className="mb-8 text-center sm:mb-10">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                        Account Settings
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                        View and manage your personal information.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    {/* Profile Banner */}
                    <div className="h-28 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40 sm:h-36" />

                    <div className="px-5 pb-7 sm:px-8 sm:pb-9">
                        {/* Avatar and Edit Button */}
                        <div className="-mt-14 flex flex-col items-start justify-between gap-5 sm:-mt-16 sm:flex-row sm:items-end">
                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-primary text-4xl font-bold text-white shadow-md sm:h-32 sm:w-32">
                                {profileImage && !previewError ? (
                                    <img
                                        src={profileImage}
                                        alt={displayName}
                                        className="h-full w-full object-cover"
                                        onError={() => setPreviewError(true)}
                                    />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </div>

                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={handleDialogChange}
                            >
                                <DialogTrigger
                                    render={
                                        <Button className="w-full gap-2 sm:w-auto">
                                            <Pencil className="h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    }
                                />

                                <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit Your Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your name and profile picture.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form
                                        onSubmit={handleSaveChanges}
                                        className="space-y-5"
                                    >
                                        {/* Profile Image Preview */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary text-3xl font-bold text-white">
                                                {image.trim() && !previewError ? (
                                                    <img
                                                        src={image.trim()}
                                                        alt="Profile preview"
                                                        className="h-full w-full object-cover"
                                                        onError={() => setPreviewError(true)}
                                                    />
                                                ) : (
                                                    name.trim().charAt(0).toUpperCase() || "U"
                                                )}
                                            </div>

                                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Camera className="h-3.5 w-3.5" />
                                                Profile picture preview
                                            </p>
                                        </div>

                                        {/* Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="profile-name">
                                                Full Name
                                            </Label>

                                            <Input
                                                id="profile-name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                maxLength={50}
                                                required
                                                disabled={isSaving}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="profile-email">
                                                Email Address
                                            </Label>

                                            <Input
                                                id="profile-email"
                                                value={user.email || ""}
                                                readOnly
                                                disabled
                                                className="bg-muted"
                                            />

                                            <p className="text-xs text-muted-foreground">
                                                Email address cannot be changed here.
                                            </p>
                                        </div>

                                        {/* Image URL */}
                                        <div className="space-y-2">
                                            <Label htmlFor="profile-image">
                                                Profile Picture URL
                                            </Label>

                                            <Input
                                                id="profile-image"
                                                type="url"
                                                value={image}
                                                onChange={(e) => {
                                                    setImage(e.target.value);
                                                    setPreviewError(false);
                                                }}
                                                placeholder="https://example.com/image.jpg"
                                                disabled={isSaving}
                                            />

                                            <p className="text-xs text-muted-foreground">
                                                Paste a publicly accessible image URL.
                                                Leave empty to remove your picture.
                                            </p>
                                        </div>

                                        <DialogFooter className="flex-col gap-2 sm:flex-row">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                                onClick={() => setIsDialogOpen(false)}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="submit"
                                                className="w-full gap-2 sm:w-auto"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* User Name */}
                        <div className="mt-5">
                            <h2 className="text-2xl font-bold text-foreground">
                                {displayName}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Togetherly Member
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="my-7 border-t border-border" />

                        {/* Personal Information */}
                        <div>
                            <h3 className="mb-5 text-lg font-semibold text-foreground">
                                Personal Information
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Name */}
                                <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                                        <UserRound className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Full Name
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold text-foreground">
                                            {displayName}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Email Address
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                                        <CalendarDays className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Account Status
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            Active Member
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="mt-7 rounded-xl border border-primary/15 bg-primary/5 p-4">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Keep your profile information up to date so other
                                community members can recognize you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
