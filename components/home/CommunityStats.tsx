
"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  Users,
  Handshake,
  HeartHandshake,
} from "lucide-react";

const statistics = [
  {
    label: "Events Hosted",
    value: 250,
    suffix: "+",
    icon: CalendarCheck,
    description: "Meaningful events organized",
  },
  {
    label: "Active Members",
    value: 1200,
    suffix: "+",
    icon: Users,
    description: "People in our community",
  },
  {
    label: "Participants",
    value: 3500,
    suffix: "+",
    icon: Handshake,
    description: "People making a difference",
  },
  {
    label: "Community Initiatives",
    value: 85,
    suffix: "+",
    icon: HeartHandshake,
    description: "Positive changes together",
  },
];

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800;
    const startTime = performance.now();

    let animationFrame: number;

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString("en-US")}
    </span>
  );
}

export default function CommunityStats() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Our Community Impact
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Making a Difference,{" "}
            <span className="text-primary">Together.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Every event brings people closer and creates
            opportunities to make a positive impact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-7"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </h3>

                <p className="mt-2 font-semibold text-foreground">
                  {stat.label}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
