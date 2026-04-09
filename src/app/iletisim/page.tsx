import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import IletisimForm from "@/components/iletisim/IletisimForm";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "İletişim | Cetin Gungor - Manisa İnşaat Malzemecileri Derneği",
  description:
    "Manisa İnşaat Malzemecileri Derneği ile iletişime geçin. Adres, telefon ve e-posta bilgilerimize ulaşın.",
};

const iletisimBilgileri = [
  {
    icon: MapPin,
    baslik: "Adres",
    icerik: "Manisa Organize Sanayi Bölgesi,\n45030 Yunusemre / Manisa",
    href: undefined,
  },
  {
    icon: Phone,
    baslik: "Telefon",
    icerik: "+90 (236) 555 12 34",
    href: "tel:+902365551234",
  },
  {
    icon: Mail,
    baslik: "E-posta",
    icerik: "info@cetingungor.org.tr",
    href: "mailto:info@cetingungor.org.tr",
  },
  {
    icon: Clock,
    baslik: "Çalışma Saatleri",
    icerik: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 13:00",
    href: undefined,
  },
];

const sosyalMedya = [
  { abbr: "FB", href: "https://facebook.com/cetingungormanisa", label: "Facebook" },
  { abbr: "IG", href: "https://instagram.com/cetingungormanisa", label: "Instagram" },
  { abbr: "TW", href: "https://twitter.com/cetingungormanisa", label: "Twitter / X" },
  { abbr: "LN", href: "https://linkedin.com/company/cetingungormanisa", label: "LinkedIn" },
  { abbr: "YT", href: "https://youtube.com/@cetingungormanisa", label: "YouTube" },
];

export default function IletisimPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
          url: "https://cetingungor.org.tr",
          telephone: "+90 (236) 555 12 34",
          email: "info@cetingungor.org.tr",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Manisa Organize Sanayi Bolgesi",
            addressLocality: "Yunusemre",
            addressRegion: "Manisa",
            postalCode: "45030",
            addressCountry: "TR",
          },
          openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"],
        }}
      />
      <PageHeader
        title="İletişim"
        subtitle="Bizimle iletişime geçin"
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "İletişim" }]}
      />

      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

          {/* 2-column grid */}
          <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">

            {/* Left: Contact Form */}
            <AnimatedSection className="lg:col-span-3">
              <IletisimForm />
            </AnimatedSection>

            {/* Right: Info Cards */}
            <AnimatedSection className="lg:col-span-2" delay={0.1}>
              <div className="flex flex-col gap-4">

                {/* Iletisim bilgileri */}
                {iletisimBilgileri.map(({ icon: Icon, baslik, icerik, href }) => (
                  <div
                    key={baslik}
                    className="bg-white rounded-2xl p-5 shadow-card flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mb-1">
                        {baslik}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-primary-800 hover:text-secondary transition-colors whitespace-pre-line leading-relaxed"
                        >
                          {icerik}
                        </a>
                      ) : (
                        <p className="text-sm text-primary-800 whitespace-pre-line leading-relaxed">
                          {icerik}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Sosyal medya */}
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mb-3">
                    Sosyal Medya
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {sosyalMedya.map(({ abbr, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110 text-[10px] font-bold"
                      >
                        {abbr}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Map placeholder */}
          <AnimatedSection delay={0.2} className="mt-10">
            <div className="rounded-2xl bg-neutral-100 h-64 flex flex-col items-center justify-center gap-3 border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                <MapPin size={22} className="text-secondary-500" />
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                Harita yakında eklenecek
              </p>
              <p className="text-xs text-neutral-400">
                Manisa Organize Sanayi Bölgesi, 45030 Yunusemre / Manisa
              </p>
            </div>
          </AnimatedSection>

        </div>
      </section>
    </main>
  );
}
