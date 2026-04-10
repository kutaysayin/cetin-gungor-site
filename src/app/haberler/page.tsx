/* Haberler listesi sayfasi — kategori filtresi ve sayfalama destekler */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Haberler",
  description:
    "Manisa Insaat Malzemecileri Dernegi guncel haberleri. Sektor haberleri, dernek duyurulari ve TIMFED gelismeleri.",
  openGraph: {
    title: "Haberler",
    description:
      "Manisa Insaat Malzemecileri Dernegi guncel haberleri. Sektor haberleri, dernek duyurulari ve TIMFED gelismeleri.",
  },
};
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import NewsCard from "@/components/ui/NewsCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

const kategoriler = [
  { slug: "", label: "Tümü" },
  { slug: "SEKTOR", label: "Sektör Haberleri" },
  { slug: "DERNEK", label: "Dernek Haberleri" },
  { slug: "TIMFED", label: "TIMFED" },
  { slug: "DERNEKLERDEN", label: "Derneklerden" },
];

export default async function HaberlerPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; sayfa?: string }>;
}) {
  const params = await searchParams;
  const aktifKategori = params.kategori ?? "";
  const sayfa = Math.max(1, parseInt(params.sayfa ?? "1", 10));
  const skip = (sayfa - 1) * PER_PAGE;

  const where = aktifKategori ? { category: aktifKategori } : {};

  const [haberler, toplam] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        publishedAt: true,
      },
    }),
    prisma.news.count({ where }),
  ]);

  const toplamSayfa = Math.ceil(toplam / PER_PAGE);
  const oncekiSayfa = sayfa > 1 ? sayfa - 1 : null;
  const sonrakiSayfa = sayfa < toplamSayfa ? sayfa + 1 : null;

  function sayfaHref(s: number) {
    const q = new URLSearchParams();
    if (aktifKategori) q.set("kategori", aktifKategori);
    if (s > 1) q.set("sayfa", String(s));
    const qs = q.toString();
    return `/haberler${qs ? `?${qs}` : ""}`;
  }

  return (
    <main>
      <PageHeader
        title="Haberler"
        subtitle="Sektörden ve derneğimizden güncel gelişmeler"
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Haberler" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kategori filtreleri */}
          <div className="flex flex-wrap gap-2 mb-10">
            {kategoriler.map((kat) => {
              const aktif = aktifKategori === kat.slug;
              const href = kat.slug
                ? `/haberler?kategori=${kat.slug}`
                : "/haberler";
              return (
                <Link
                  key={kat.slug}
                  href={href}
                  className={[
                    "inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                    aktif
                      ? "bg-primary-600 text-white shadow-xs"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-200 hover:text-primary",
                  ].join(" ")}
                >
                  {kat.label}
                </Link>
              );
            })}
          </div>

          {/* Başlık */}
          <SectionTitle
            title={
              aktifKategori
                ? (kategoriler.find((k) => k.slug === aktifKategori)?.label ??
                  "Haberler")
                : "Tüm Haberler"
            }
            subtitle={`${toplam} haber bulundu`}
            className="mb-8"
          />

          {/* Haber grid */}
          {haberler.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-lg text-neutral-400">
                Bu kategoride henüz haber bulunmamaktadır.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {haberler.map((haber, idx) => (
                <AnimatedSection key={haber.id} delay={idx * 0.07}>
                  <NewsCard
                    title={haber.title}
                    slug={haber.slug}
                    excerpt={haber.excerpt}
                    image={haber.image}
                    category={haber.category}
                    publishedAt={haber.publishedAt}
                  />
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Sayfalama */}
          {toplamSayfa > 1 && (
            <div className="flex items-center justify-center gap-3 mt-14">
              {oncekiSayfa ? (
                <Link
                  href={sayfaHref(oncekiSayfa)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Önceki
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-100 text-sm font-semibold text-neutral-300 cursor-not-allowed">
                  <ChevronLeft size={16} />
                  Önceki
                </span>
              )}

              <span className="text-sm text-neutral-500 px-2">
                Sayfa{" "}
                <strong className="text-primary font-bold">{sayfa}</strong> /{" "}
                {toplamSayfa}
              </span>

              {sonrakiSayfa ? (
                <Link
                  href={sayfaHref(sonrakiSayfa)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                >
                  Sonraki
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-100 text-sm font-semibold text-neutral-300 cursor-not-allowed">
                  Sonraki
                  <ChevronRight size={16} />
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
