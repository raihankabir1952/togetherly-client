
"use client";

import { useState } from "react";
import { ArrowRight, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.success("Thank you for your interest in Togetherly!");
    setEmail("");
  };

  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-14 shadow-xl shadow-primary/10 sm:px-12 lg:px-16">
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[45px] border-white/5" />

        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
              <Mail size={16} />
              Stay Connected
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Be the First to Know About
              <span className="block text-green-200">
                Upcoming Events
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-green-50/90 sm:text-base lg:mx-0 mx-auto">
              Get community updates, inspiring stories, and upcoming
              volunteer opportunities delivered straight to your inbox.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                <Send size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Join Our Newsletter
                </h3>
                <p className="text-xs text-green-100/80">
                  Stay inspired. Stay involved.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-green-300"
              />

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-gray-900 transition-all hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Subscribe
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-green-100/80">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
