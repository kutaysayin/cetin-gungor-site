/**
 * Avantaj Rehberi sayfası
 * Üyelere özel indirim ve avantajları kategorilere göre listeler.
 */

import type { Metadata } from "next";
import { CheckCircle2, Star, Handshake } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AvantajTabs from "@/components/avantaj-rehberi/AvantajTabs";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Avantaj Rehberi | Manisa İnşaat Malzemecileri Derneği",
  description:
    "Dernek üyelerimize özel indirim anlaşmaları ve üyeler arası avantajlar.",
};

const uyeFaydalari = [
  "Üyeler arası ticari ağda öncelikli fırsatlar",
  "Anlaşmalı kurumlardan özel indirimler",
  "Sektöre özgü hizmet ve ürün avantajları",
];

export default async function AvantajRehberiPage() {
  const tumAvantajlar = await prisma.advantage.findMany({
    where: { active: true },
    orderBy: { companyName: "asc" },
  });

  const uyelerArasi = tumAvantajlar.filter(
    (a) => a.category === "UYELARARASI"
  );
  const anlasmali = tumAvantajlar.filter(
    (a) => a.category === "ANLASMALI"
  );

  // Prisma nesneleri doğrudan seri hale getirilebilir; Date'leri stringe çeviriyoruz
  const serializeAdvantage = (a: (typeof tumAvantajlar)[0]) => ({
    id: a.id,
    companyName: a.companyName,
    description: a.description,
    category: a.category,
    discount: a.discount,
    contact: a.contact,
    active: a.active,
  });

  return (
    <main>
      <PageHeader
        title="Avantaj Rehberi"
        subtitle="Üyelerimize özel indirim ve avantajlar"
        breadcrumbs={[{ label: "Avantaj Rehberi" }]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Giriş paragrafı — styled intro section */}
          <AnimatedSection>
            <div className="bg-primary-50 rounded-2xl p-8 mb-12 relative overflow-hidden">
              {/* Accent decorations */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent/5 rounded-full translate-y-8 -translate-x-8" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Star size={18} className="text-secondary" />
                  </div>
                  <h2 className="text-lg font-bold text-primary">
                    Üyelik Avantajlarınız
                  </h2>
                </div>

                <p className="text-neutral-600 leading-relaxed mb-3 max-w-2xl">
                  Manisa İnşaat Malzemecileri Derneği üyeleri, hem birbirleriyle
                  gerçekleştirdikleri ticari iş birliklerinde özel koşullardan
                  yararlanır hem de derneğimizin anlaştığı kurumlardan indirimli
                  hizmet ve ürün satın alabilir.
                </p>
                <p className="text-neutral-600 leading-relaxed mb-6 max-w-2xl">
                  Aşağıdaki rehberi kullanarak size en uygun avantajları keşfedebilir,
                  ilgili firma veya kurum ile doğrudan iletişime geçebilirsiniz.
                </p>

                <ul className="flex flex-col gap-2.5">
                  {uyeFaydalari.map((fayda, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <CheckCircle2
                        size={16}
                        className="text-accent mt-0.5 shrink-0"
                      />
                      {fayda}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* İstatistik özeti */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <p className="text-3xl font-bold text-primary mb-1">{tumAvantajlar.length}</p>
                <p className="text-sm text-neutral-500">Toplam Avantaj</p>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Handshake size={16} className="text-secondary" />
                  <p className="text-3xl font-bold text-primary">{uyelerArasi.length}</p>
                </div>
                <p className="text-sm text-neutral-500">Üyeler Arası</p>
              </div>
              <div className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-neutral-100 p-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <p className="text-3xl font-bold text-primary mb-1">{anlasmali.length}</p>
                <p className="text-sm text-neutral-500">Anlaşmalı Kurum</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Sekmeli avantaj listesi */}
          <AvantajTabs
            uyelerArasi={uyelerArasi.map(serializeAdvantage)}
            anlasmali={anlasmali.map(serializeAdvantage)}
          />
        </div>
      </section>
    </main>
  );
}
