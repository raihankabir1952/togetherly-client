
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ImagePlus,
  ArrowRight,
  Heart,
  Users,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const photoURL = (formData.get("photoURL") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL || undefined,
        callbackURL: "/login",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.info("Google authentication will be configured later.");
  };


  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8faf8] px-4 py-10 dark:bg-[#101b14] sm:px-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-green-900/5 dark:border-white/10 dark:bg-[#17251b] lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#166534] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute right-16 top-1/2 h-48 w-48 rounded-full bg-green-400/10 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <Image
                  src="/logo/togetherly-logo.png"
                  alt="Togetherly"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Togetherly
              </span>
            </Link>
          </div>

          <div className="relative z-10 my-16">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              <Heart size={15} className="text-orange-300" />
              Be part of something meaningful
            </span>

            <h1 className="max-w-md text-5xl leading-tight font-bold tracking-tight">
              Your small action can create a big change.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-green-100">
              Join a community of passionate people and help make the world a
              better place, one event at a time.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <Users size={25} className="mb-3 text-green-200" />
                <p className="text-2xl font-bold">Connect</p>
                <p className="mt-1 text-sm text-green-100">
                  Meet your community
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <Leaf size={25} className="mb-3 text-green-200" />
                <p className="text-2xl font-bold">Contribute</p>
                <p className="mt-1 text-sm text-green-100">
                  Make a real difference
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-green-100">
            <ShieldCheck size={18} />
            <span>Small Acts. Greater Impact.</span>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <Image
                  src="/logo/togetherly-logo.png"
                  alt="Togetherly"
                  width={42}
                  height={42}
                />
                <span className="text-xl font-bold text-[#166534] dark:text-green-400">
                  Togetherly
                </span>
              </Link>
            </div>

            <div className="mb-7">
              <p className="mb-3 text-sm font-semibold tracking-wider text-[#166534] dark:text-green-400">
                JOIN TOGETHERLY
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Start your journey and become part of a community that cares.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound size={19} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-4 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email Address
                </label>

                <div className="relative">
                  <Mail size={19} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-4 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label htmlFor="photoURL" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Profile Photo URL
                </label>

                <div className="relative">
                  <ImagePlus size={19} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="photoURL"
                    name="photoURL"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-4 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole size={19} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-12 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Minimum 6 characters, with uppercase and lowercase letters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole size={19} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-12 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-400">OR SIGN UP WITH</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            </div>

            {/* Google Register */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.38 5.73c4.3-3.97 6.39-9.81 7.39-17.38Z" />
                <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.77l-7.38-5.73c-2.05 1.38-4.67 2.2-8.53 2.2-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
              </svg>
              Continue with Google
            </button>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#166534] hover:underline dark:text-green-400"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-gray-400">
              By creating an account, you agree to Togetherly&apos;s Terms of
              Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
