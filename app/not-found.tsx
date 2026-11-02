
import Link from "next/link";
import { CalendarX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Error Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
        <CalendarX size={40} />
      </div>

      {/* Error Code */}
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-600">
        Error 404
      </p>

      {/* Heading */}
      <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
        Oops! Page Not Found
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or may have been moved.
        Let's get you back to making a difference!
      </p>

      {/* Home Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-[#166534] px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-[#14532d] hover:shadow-lg"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </main>
  );
}
