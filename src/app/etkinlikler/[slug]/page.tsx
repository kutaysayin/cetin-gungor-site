/* Etkinlik detay sayfasi — tarih, konum, kapasite, paylasim ve kayit */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import EventRegisterButton from "@/components/etkinlikler/EventRegisterButton";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const TURKCE_AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const TURKCE_GUNLER = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];

function formatTurkishDate(date: Date): string {
  return `${TURKCE_GUNLER[date.getDay()]}, ${date.getDate()} ${TURKCE_AYLAR[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function buildShareUrls(url: string, title: string) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
  };
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const etkinlik = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, description: true, location: true },
  });
  if (!etkinlik) return { title: "Etkinlik Bulunamadı" };
  return {
    title: `${etkinlik.title} | Etkinlikler | MANİMAD`,
    description: etkinlik.description?.substring(0, 160) ?? `${etkinlik.title} — ${etkinlik.location ?? "MANİMAD etkinliği"}`,
  };
}

export default async function EtkinlikDetayPage({ params }: Props) {
  const { slug } = await params;

  // Session ve etkinlik verisini paralel cek
  const [session, etkinlik] = await Promise.all([
    getServerSession(authOptions),
    prisma.event.findUnique({
      where: { slug },
      include: { _count: { select: { registrations: true } } },
    }),
  ]);

  if (!etkinlik) notFound();

  const now = new Date();
  const isUpcoming = new Date(etkinlik.date) > now;
  const isLoggedIn = !!session?.user?.id;

  // Kayit durumu ve kontenjan
  const registrationCount = etkinlik._count.registrations;
  const isFull = etkinlik.capacity !== null && registrationCount >= etkinlik.capacity;

  let isRegistered = false;
  if (isLoggedIn) {
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: session!.user.id,
          eventId: etkinlik.id,
        },
      },
      select: { id: true },
    });
    isRegistered = !!existing;
  }

  // Diger 3 etkinlik (mevcut haric)
  const digerEtkinlikler = await prisma.event.findMany({
    where: { slug: { not: slug } },
    orderBy: { date: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      date: true,
      location: true,
    },
  });

  const pageUrl = `https://manimad.org.tr/etkinlikler/${slug}`;
  const shareUrls = buildShareUrls(pageUrl, etkinlik.title);

  const timeRange = etkinlik.endDate
    ? `${formatTime(etkinlik.date)} — ${formatTime(etkinlik.endDate)}`
    : formatTime(etkinlik.date);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: etkinlik.title,
          description: etkinlik.description,
          startDate: etkinlik.date.toISOString(),
          ...(etkinlik.endDate ? { endDate: etkinlik.endDate.toISOString() } : {}),
          ...(etkinlik.location
            ? {
                location: {
                  "@type": "Place",
                  name: etkinlik.location,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Manisa",
                    addressCountry: "TR",
                  },
                },
              }
            : {}),
          organizer: {
            "@type": "Organization",
            name: "Cetin Gungor - Manisa Insaat Malzemecileri Dernegi",
            url: "https://cetingungor.org.tr",
          },
          eventStatus: isUpcoming
            ? "https://schema.org/EventScheduled"
            : "https://schema.org/EventMovedOnline",
        }}
      />
      <PageHeader
        title={etkinlik.title}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Etkinlikler", href: "/etkinlikler" },
          { label: etkinlik.title },
        ]}
      />

      <article className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Hero gradient alan */}
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-800 to-accent-800 flex items-center justify-center mb-10">
            <div className="flex flex-col items-center gap-4 text-white/30">
              <Calendar size={80} strokeWidth={0.75} />
            </div>

            {/* Degrade overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />

            {/* Durum badge */}
            <div className="absolute top-4 left-4 z-10">
              {isUpcoming ? (
                <span className="bg-secondary text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
                  Yaklaşan Etkinlik
                </span>
              ) : (
                <span className="bg-neutral-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
                  Geçmiş Etkinlik
                </span>
              )}
            </div>

            {/* Etkinlik adı alt kısımda */}
            <div className="absolute bottom-5 left-6 right-6 z-10">
              <p className="text-white/80 font-semibold text-lg line-clamp-1">
                {etkinlik.title}
              </p>
            </div>
          </div>

          {/* Tarih/saat prominent block */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-6 -mt-12 relative z-10 mx-auto max-w-2xl text-center mb-12 border border-neutral-100">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Etkinlik Tarihi
            </p>
            <p className="text-xl font-bold text-primary-800">
              {formatTurkishDate(etkinlik.date)}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-neutral-500 text-sm mt-1">
              <Clock size={13} />
              {timeRange}
            </p>
            {etkinlik.location && (
              <p className="flex items-center justify-center gap-1.5 text-neutral-500 text-sm mt-1.5">
                <MapPin size={13} />
                {etkinlik.location}
              </p>
            )}
            {/* Kayit sayisi */}
            {etkinlik.capacity !== null && (
              <p className="flex items-center justify-center gap-1.5 text-neutral-400 text-xs mt-2">
                <Users size={12} />
                <span>
                  <span className={isFull ? "text-red-500 font-semibold" : "text-accent font-semibold"}>
                    {registrationCount}
                  </span>
                  {" / "}
                  {etkinlik.capacity} kayitli
                </span>
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Sol: Icerik */}
            <div className="lg:col-span-2">
              {/* Aciklama */}
              {etkinlik.description && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Etkinlik Hakkında
                  </h2>
                  <div className="text-neutral-600 leading-relaxed space-y-4">
                    {etkinlik.description.split(/\n\n+/).map((blok, i) => (
                      <p key={i}>{blok}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Kayit ol CTA — sadece yaklasan etkinlikler icin */}
              {isUpcoming && (
                <div className="mt-8 pt-8 border-t border-neutral-100">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    Etkinliğe Katılın
                  </h3>
                  <p className="text-neutral-500 text-sm mb-5">
                    {isLoggedIn
                      ? isRegistered
                        ? "Bu etkinlige kayitlisiniz."
                        : isFull
                        ? "Bu etkinligin kontenjanı dolmustur."
                        : "Bu etkinlige katilmak icin asagidaki butona tiklayin."
                      : "Bu etkinlige kayit olmak icin uye girisi yapmaniz gerekmektedir."}
                  </p>
                  <EventRegisterButton
                    eventId={etkinlik.id}
                    slug={slug}
                    isLoggedIn={isLoggedIn}
                    isRegistered={isRegistered}
                    isFull={isFull}
                  />
                </div>
              )}

              {/* Paylasim butonlari */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                    <Share2 size={15} />
                    Bu etkinliği paylaş:
                  </span>

                  <a
                    href={shareUrls.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter'da paylaş"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#1DA1F2] hover:text-white text-neutral-500 flex items-center justify-center transition-all duration-200"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>

                  <a
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook'ta paylaş"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#1877F2] hover:text-white text-neutral-500 flex items-center justify-center transition-all duration-200"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>

                  <a
                    href={shareUrls.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn'de paylaş"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#0A66C2] hover:text-white text-neutral-500 flex items-center justify-center transition-all duration-200"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>

                  <a
                    href={shareUrls.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp'ta paylaş"
                    className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#25D366] hover:text-white text-neutral-500 flex items-center justify-center transition-all duration-200"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Sag: Bilgi kartlari */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-primary text-lg">Etkinlik Bilgileri</h3>

              {/* Tarih karti */}
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Calendar size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
                      Tarih
                    </p>
                    <p className="font-semibold text-primary text-sm">
                      {formatTurkishDate(etkinlik.date)}
                    </p>
                    <p className="text-neutral-500 text-sm">{timeRange}</p>
                  </div>
                </div>
              </div>

              {/* Konum karti */}
              {etkinlik.location && (
                <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <MapPin size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
                        Konum
                      </p>
                      <p className="font-semibold text-primary text-sm">
                        {etkinlik.location}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Kapasite karti */}
              {etkinlik.capacity !== null && (
                <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Users size={18} className="text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-0.5">
                        Kapasite
                      </p>
                      <p className="font-semibold text-primary text-sm">
                        <span className={isFull ? "text-red-500" : "text-accent"}>
                          {registrationCount}
                        </span>
                        {" / "}
                        {etkinlik.capacity} kişi
                      </p>
                      {isFull && (
                        <p className="text-xs text-red-500 font-medium mt-0.5">
                          Kontenjan doldu
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Durum karti */}
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle size={18} className={isUpcoming ? "text-green-500" : "text-neutral-400"} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                      Durum
                    </p>
                    <Badge color={isUpcoming ? "green" : "blue"} size="sm">
                      {isUpcoming ? "Yaklaşan" : "Geçmiş"}
                    </Badge>
                    {isLoggedIn && isRegistered && (
                      <div className="mt-2">
                        <Badge color="green" size="sm">
                          Kayitlisiniz
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Diger etkinlikler */}
      {digerEtkinlikler.length > 0 && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <SectionTitle title="Diğer Etkinlikler" className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {digerEtkinlikler.map((ev) => {
                const d = new Date(ev.date);
                const evIsUpcoming = d > now;
                return (
                  <a
                    key={ev.id}
                    href={`/etkinlikler/${ev.slug}`}
                    className="group bg-white rounded-2xl border border-neutral-100 p-5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-secondary text-white rounded-xl px-2.5 py-1.5 text-center shrink-0">
                        <div className="text-[10px] font-bold tracking-widest uppercase opacity-90">
                          {TURKCE_AYLAR[d.getMonth()].substring(0, 3).toUpperCase()}
                        </div>
                        <div className="text-xl font-bold leading-none">
                          {d.getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary text-sm leading-tight line-clamp-2 group-hover:text-secondary transition-colors">
                          {ev.title}
                        </h3>
                      </div>
                    </div>
                    {ev.location && (
                      <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                        <MapPin size={12} />
                        {ev.location}
                      </p>
                    )}
                    <div className="mt-3">
                      <Badge color={evIsUpcoming ? "green" : "blue"} size="sm">
                        {evIsUpcoming ? "Yaklaşan" : "Geçmiş"}
                      </Badge>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
