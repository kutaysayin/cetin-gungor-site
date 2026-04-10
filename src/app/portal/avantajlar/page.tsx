/**
 * Portal Avantajlarim sayfasi — sunucu bileseni
 * Aktif avantajlari portal icerisinde gosterir.
 */

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Building2, Tag, Phone, Mail, Gift, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Avantajlarim",
};

function categoryLabel(category: string): string {
  if (category === "UYELARARASI") return "Uyeler Arasi";
  if (category === "ANLASMALI") return "Anlasmali Kurum";
  return category;
}

interface Advantage {
  id: string;
  companyName: string;
  description: string;
  category: string;
  discount: string | null;
  contact: string | null;
  active: boolean;
}

function AvantajKart({ advantage }: { advantage: Advantage }) {
  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Ust bolum */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-secondary-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary text-sm leading-snug">
              {advantage.companyName}
            </h3>
            <div className="mt-1">
              <Badge
                color={advantage.category === "UYELARARASI" ? "green" : "blue"}
                size="sm"
              >
                {categoryLabel(advantage.category)}
              </Badge>
            </div>
          </div>
          {advantage.discount && (
            <div className="shrink-0 flex items-center gap-1 bg-secondary-50 text-secondary-700 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-secondary-100">
              <Tag size={10} />
              {advantage.discount}
            </div>
          )}
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
          {advantage.description}
        </p>
      </div>

      {/* Alt bolum — iletisim */}
      {advantage.contact && (
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center gap-2">
          <Phone size={11} className="text-neutral-400 shrink-0" />
          <span className="text-xs text-neutral-500 truncate">{advantage.contact}</span>
        </div>
      )}
    </div>
  );
}

export default async function PortalAvantajlarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/giris");

  const advantages = await prisma.advantage.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { companyName: "asc" }],
  });

  const uyelerArasi = advantages.filter((a) => a.category === "UYELARARASI");
  const anlasmali = advantages.filter((a) => a.category === "ANLASMALI");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Baslik */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Avantajlarim</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Uyeliginize ozel indirim ve ayricaliklar.
          </p>
        </div>
        <Button href="/avantaj-rehberi" variant="outline" size="sm">
          <ExternalLink size={13} />
          Tum Rehber
        </Button>
      </div>

      {/* Ozet bant */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-[var(--shadow-card)] border border-neutral-100 text-sm">
          <Gift size={14} className="text-secondary-500" />
          <span className="font-semibold text-primary">{advantages.length}</span>
          <span className="text-neutral-400">toplam avantaj</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-[var(--shadow-card)] border border-neutral-100 text-sm">
          <Building2 size={14} className="text-accent-500" />
          <span className="font-semibold text-primary">{anlasmali.length}</span>
          <span className="text-neutral-400">anlasmali kurum</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-[var(--shadow-card)] border border-neutral-100 text-sm">
          <Tag size={14} className="text-green-500" />
          <span className="font-semibold text-primary">{uyelerArasi.length}</span>
          <span className="text-neutral-400">uye avantaji</span>
        </div>
      </div>

      {/* Anlasmali Kurumlar */}
      {anlasmali.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 rounded-full bg-secondary-500" />
            <h2 className="font-semibold text-primary">Anlasmali Kurumlar</h2>
            <Badge color="blue" size="sm">{anlasmali.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anlasmali.map((a) => (
              <AvantajKart key={a.id} advantage={a} />
            ))}
          </div>
        </section>
      )}

      {/* Uyeler Arasi Avantajlar */}
      {uyelerArasi.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 rounded-full bg-accent-500" />
            <h2 className="font-semibold text-primary">Uyeler Arasi Avantajlar</h2>
            <Badge color="green" size="sm">{uyelerArasi.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uyelerArasi.map((a) => (
              <AvantajKart key={a.id} advantage={a} />
            ))}
          </div>
        </section>
      )}

      {/* Bos durum */}
      {advantages.length === 0 && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 px-6 py-14 text-center">
          <Gift size={40} className="mx-auto mb-3 text-neutral-200" />
          <p className="font-medium text-neutral-500 text-sm">
            Henuz aktif avantaj bulunmuyor.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Dernek avantaj anlasmalari yakinda eklenecektir.
          </p>
        </div>
      )}
    </div>
  );
}
