import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AboutPreview from "@/components/home/AboutPreview";
import LatestNews from "@/components/home/LatestNews";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import BoardPreview from "@/components/home/BoardPreview";
import CTASection from "@/components/home/CTASection";
import JsonLd from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
          url: "https://cetingungor.org.tr",
          description: "Manisa Insaat Malzemecileri Dernegi",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Manisa",
            addressCountry: "TR",
          },
        }}
      />
      <HeroSection />
      <StatsSection />
      <AboutPreview />
      <LatestNews />
      <UpcomingEvents />
      <BoardPreview />
      <CTASection />
    </>
  );
}
