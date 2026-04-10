/* Uyeler listesi sayfasi — arama, sektor filtresi ve sayfalama destekler */

import type { Metadata } from "next";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import MemberCard from "@/components/ui/MemberCard";
import MemberSearch from "@/components/uyeler/MemberSearch";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uyelerimiz | MANİMAD",
  description: "Dernek üyesi firma ve işletmeler",
};

const PER_PAGE = 12;

export default async function UyelerPage({
  searchParams,
}: {
  searchParams: Promise<{ arama?: string; sektor?: string; sayfa?: string }>;
}) {
  const params = await searchParams;
  const arama = params.arama ?? "";
  const sektor = params.sektor ?? "";
  const sayfa = Math.max(1, parseInt(params.sayfa ?? "1", 10));
  const skip = (sayfa - 1) * PER_PAGE;

  // Prisma where filtresi
  const where: {
    active: boolean;
    sector?: string;
    OR?: Array<{ name?: { contains: string }; owner?: { contains: string } }>;
  } = { active: true };

  if (sektor) {
    where.sector = sektor;
  }

  if (arama) {
    where.OR = [
      { name: { contains: arama } },
      { owner: { contains: arama } },
    ];
  }

  const [uyeler, toplam] = await Promise.all([
    prisma.memberCompany.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        name: true,
        owner: true,
        sector: true,
        address: true,
        phone: true,
        email: true,
      },
    }),
    prisma.memberCompany.count({ where }),
  ]);

  const toplamSayfa = Math.ceil(toplam / PER_PAGE);
  const oncekiSayfa = sayfa > 1 ? sayfa - 1 : null;
  const sonrakiSayfa = sayfa < toplamSayfa ? sayfa + 1 : null;

  function sayfaHref(s: number) {
    const q = new URLSearchParams();
    if (arama) q.set("arama", arama);
    if (sektor) q.set("sektor", sektor);
    if (s > 1) q.set("sayfa", String(s));
    const qs = q.toString();
    return `/uyeler${qs ? `?${qs}` : ""}`;
  }

  return (
    <main>
      <PageHeader
        title="Üyelerimiz"
        subtitle="Dernek üyesi firma ve işletmeler"
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "Üyeler" }]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Arama ve filtre — Suspense ile client component */}
          <Suspense fallback={<div className="h-14 bg-neutral-100 rounded-xl animate-pulse mb-8" />}>
            <MemberSearch />
          </Suspense>

          {/* Baslik ve sonuc sayisi */}
          <SectionTitle
            title={sektor ? sektor : "Tüm Üyeler"}
            subtitle={`${toplam} üye firma bulundu`}
            className="mb-8"
          />

          {/* Uye grid */}
          {uyeler.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-lg text-neutral-400">
                Arama kriterlerinize uygun üye bulunamadı.
              </p>
              <Link
                href="/uyeler"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Tüm üyeleri görüntüle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uyeler.map((uye, idx) => (
                <AnimatedSection key={uye.id} delay={idx * 0.05}>
                  <MemberCard
                    id={uye.id}
                    name={uye.name}
                    owner={uye.owner}
                    sector={uye.sector}
                    address={uye.address}
                    phone={uye.phone}
                    email={uye.email}
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
