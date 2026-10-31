"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Hydration-safe "mounted" detection: the server snapshot is false (matching the
// server HTML) and the client snapshot is true, so React re-renders with the real
// icon right after hydration without a setState-in-effect.
const emptySubscribe = () => () => {};

// Light/Dark toggle for the navbar.
// The icon is rendered only after mount so the server HTML and the
// hydrated client render match (avoids hydration mismatch warnings).
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted && theme === "dark";
  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
        className
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun size={20} aria-hidden="true" />
        ) : (
          <Moon size={20} aria-hidden="true" />
        )
      ) : (
        <span className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
