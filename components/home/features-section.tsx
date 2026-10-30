
import {
  CalendarDays,
  HeartHandshake,
  Leaf,
  Users,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Discover Events",
    description:
      "Find meaningful community events near you and discover new ways to contribute.",
    number: "01",
  },
  {
    icon: Users,
    title: "Join a Community",
    description:
      "Connect with passionate people who share your vision for a better world.",
    number: "02",
  },
  {
    icon: HeartHandshake,
    title: "Create an Event",
    description:
      "Turn your ideas into action by organizing events that bring people together.",
    number: "03",
  },
  {
    icon: Leaf,
    title: "Make an Impact",
    description:
      "Every small contribution matters. Work together to create lasting positive change.",
    number: "04",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-card py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary">
            What We Do
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Small Actions,
            <span className="text-primary"> Big Changes</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Togetherly makes it easier to turn your willingness to help
            into meaningful community action.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group relative rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-semibold text-muted-foreground/50">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
