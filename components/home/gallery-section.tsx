
import Image from "next/image";
import { ArrowUpRight, Images } from "lucide-react";

const galleryImages = [
  {
    src: "/images/gallery-cleanup.jpg",
    alt: "Volunteers participating in a community cleanup",
    title: "Community Cleanup",
    category: "Environment",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/gallery-donation.jpg",
    alt: "Volunteers distributing food donations",
    title: "Sharing Kindness",
    category: "Donation",
    className: "",
  },
  {
    src: "/images/gallery-plantation.jpg",
    alt: "Volunteers planting trees together",
    title: "Growing a Greener Future",
    category: "Plantation",
    className: "",
  },
  {
    src: "/images/gallery-education.jpg",
    alt: "Volunteers helping children with education",
    title: "Education for All",
    category: "Education",
    className: "",
  },
  {
    src: "/images/gallery-community.jpg",
    alt: "People working together in a community event",
    title: "Stronger Together",
    category: "Community",
    className: "",
  },
  {
    src: "/images/consultant.jpg",
    alt: "People working together in a community event",
    title: "Stronger Together",
    category: "consultation",
    className: "",
  },
];

export function GallerySection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary">
              <Images size={16} />
              Our Community Moments
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Moments That
              <span className="text-primary"> Matter</span>
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Every event tells a story of kindness, teamwork, and
              positive change. Take a look at the moments that bring
              our community together.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[250px] md:grid-cols-3">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
              className={`group relative overflow-hidden rounded-2xl bg-muted ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, 33vw"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Image Content */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {image.category}
                  </span>

                  <h3 className="text-lg font-semibold text-white sm:text-xl">
                    {image.title}
                  </h3>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-primary">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Every small act of kindness creates a bigger story.
        </p>
      </div>
    </section>
  );
}
