
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  Heart,
  Leaf,
  Users,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL") || "/events";

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful!");

      router.push(callbackURL);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Unable to login with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8faf8] px-4 py-12 dark:bg-[#101b14] sm:px-6">
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
              Together we make a difference
            </span>

            <h1 className="max-w-md text-5xl leading-tight font-bold tracking-tight">
              Make your community a better place.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-green-100">
              Connect with people, join meaningful events, and turn small acts
              of kindness into a greater impact.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <Users size={25} className="mb-3 text-green-200" />
                <p className="text-2xl font-bold">Community</p>
                <p className="mt-1 text-sm text-green-100">
                  Connect with people
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <Leaf size={25} className="mb-3 text-green-200" />
                <p className="text-2xl font-bold">Positive</p>
                <p className="mt-1 text-sm text-green-100">
                  Create real impact
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-green-100">
            <ShieldCheck size={18} />
            <span>Small Acts. Greater Impact.</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
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

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold tracking-wider text-[#166534] dark:text-green-400">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Welcome back! Please enter your details to continue making a
                difference.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                  />

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

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Password recovery will be available soon.")
                    }
                    className="py-1 text-xs font-semibold text-[#166534] hover:underline dark:text-green-400"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-12 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#166534]"
                />

                <label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
                >
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
              <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
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

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#166534] hover:underline dark:text-green-400"
              >
                Create account
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-400">
              By signing in, you agree to Togetherly&apos;s Terms of Service
              and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8faf8] dark:bg-[#101b14]">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
