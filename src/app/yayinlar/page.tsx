/**
 * Yayınlar sayfası
 * Dergi, rapor ve rehber yayınlarını listeler; tür filtresi destekler.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import PublicationCard from "@/components/ui/PublicationCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Yayınlar | Manisa İnşaat Malzemecileri Derneği",
  description:
    "Derneğimizin yayımladığı dergiler, raporlar ve rehberler.",
};

const kategoriler = [
  { slug: "", label: "Tümü" },
  { slug: "DERGI", label: "Dergiler" },
  { slug: "RAPOR", label: "Raporlar" },
  { slug: "REHBER", label: "Rehberler" },
];

export default async function YayinlarPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string }>;
}) {
  const params = await searchParams;
  const aktifTur = params.tur ?? "";

  const yayinlar = await prisma.publication.findMany({
    where: aktifTur ? { type: aktifTur } : undefined,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main>
      <PageHeader
        title="Yayınlar"
        subtitle="Dergi, rapor ve rehberlerimiz"
        breadcrumbs={[{ label: "Yayınlar" }]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kategori Sekmeleri — pill style */}
          <div className="flex flex-wrap gap-2 mb-10">
            {kategoriler.map((kat) => {
              const isActive = aktifTur === kat.slug;
              const href = kat.slug ? `/yayinlar?tur=${kat.slug}` : "/yayinlar";
              return (
                <Link
                  key={kat.slug}
                  href={href}
                  className={[
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary-600 text-white shadow-xs"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary-200 hover:text-primary",
                  ].join(" ")}
                >
                  {kat.label}
                </Link>
              );
            })}
          </div>

          {/* Yayın Listesi */}
          {yayinlar.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-lg text-neutral-400">
                Bu kategoride henüz yayın bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yayinlar.map((yayin, idx) => (
                <AnimatedSection key={yayin.id} delay={idx * 0.07}>
                  <PublicationCard
                    title={yayin.title}
                    type={yayin.type}
                    description={yayin.description}
                    issueNumber={yayin.issueNumber}
                    publishedAt={yayin.publishedAt}
                    fileUrl={yayin.fileUrl}
                  />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
