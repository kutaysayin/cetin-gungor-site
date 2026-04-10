/* Calisma Gruplari sayfasi — veritabanindan gruplari cekerek gosterir */

import type { Metadata } from "next";
import {
  BarChart2,
  BookOpen,
  Globe,
  Leaf,
  Megaphone,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Calisma Gruplari",
  description:
    "Manisa Insaat Malzemecileri Dernegi calisma gruplari. Sektor gelistirme, egitim, dijital donusum ve daha fazlasi.",
  openGraph: {
    title: "Calisma Gruplari",
    description:
      "Manisa Insaat Malzemecileri Dernegi calisma gruplari. Sektor gelistirme, egitim, dijital donusum ve daha fazlasi.",
  },
};
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Sıra numarasına göre ikon atama
const groupIcons = [BarChart2, BookOpen, Globe, Leaf, Megaphone, ShieldCheck, Users, Wrench];

// Her gruba farklı bir renk aksanı
const groupAccents = [
  { bg: "bg-primary", light: "bg-primary-50" },
  { bg: "bg-secondary", light: "bg-secondary-50" },
  { bg: "bg-accent", light: "bg-accent-50" },
  { bg: "bg-primary-700", light: "bg-primary-50" },
  { bg: "bg-secondary-600", light: "bg-secondary-50" },
  { bg: "bg-accent-700", light: "bg-accent-50" },
  { bg: "bg-primary-600", light: "bg-primary-50" },
  { bg: "bg-secondary-700", light: "bg-secondary-50" },
];

function parseMembers(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function CalismaGruplariPage() {
  const gruplar = await prisma.workGroup.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main>
      <PageHeader
        title="Çalışma Grupları"
        subtitle="Sektörün farklı alanlarında uzmanlaşmış aktif çalışma gruplarımız"
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hakkımızda", href: "/hakkimizda" },
          { label: "Çalışma Grupları" },
        ]}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Aktif Çalışma Gruplarımız"
            subtitle="Uzman üyelerimizin öncülüğünde yürütülen çalışma grupları, sektörün ihtiyaçlarına yönelik somut çıktılar üretmektedir."
            className="mb-12"
          />

          {gruplar.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">
                Çalışma grupları yakında eklenecektir.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {gruplar.map((grup, idx) => {
                const Icon = groupIcons[idx % groupIcons.length];
                const accent = groupAccents[idx % groupAccents.length];
                const uyeler = parseMembers(grup.members);

                return (
                  <AnimatedSection key={grup.id} delay={idx * 0.07}>
                    <div className="bg-white rounded-2xl border border-neutral-200 hover:border-primary/20 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                      {/* Kart başlığı */}
                      <div className={`flex items-start gap-4 p-6 border-b border-neutral-100 ${accent.light}`}>
                        <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl ${accent.bg} text-white shadow-sm`}>
                          <Icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-primary text-lg leading-snug">
                            {grup.name}
                          </h3>
                        </div>
                      </div>

                      {/* Açıklama ve üyeler */}
                      <div className="p-6 space-y-5">
                        {grup.description && (
                          <p className="text-neutral-600 leading-relaxed text-[0.9375rem]">
                            {grup.description}
                          </p>
                        )}

                        {uyeler.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                              Grup Üyeleri
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {uyeler.map((uye, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-sm font-medium px-3 py-1 rounded-full border border-primary/10"
                                >
                                  {uye}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
