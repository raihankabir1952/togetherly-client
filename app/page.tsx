import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { GallerySection } from "@/components/home/gallery-section";
import {NewsletterSection} from "@/components/home/newsletter-section"
import { RecentEventsSection } from "@/components/home/recent-events-section";

export default function Home() {
  return (
    <>
      <main className="flex-1">
         <HeroSection />
         <FeaturesSection />
          <RecentEventsSection />
         <GallerySection/>
         <NewsletterSection/>
      </main>
    </>
  );
}
