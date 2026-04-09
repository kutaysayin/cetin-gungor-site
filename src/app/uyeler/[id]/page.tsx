/* Uye detay sayfasi — firma bilgileri, iletisim ve ayni sektorden diger uyeler */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Globe, User } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import MemberCard from "@/components/ui/MemberCard";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const uye = await prisma.memberCompany.findUnique({
    where: { id },
    select: { name: true, sector: true },
  });
  if (!uye) return { title: "Üye Bulunamadı" };
  return {
    title: `${uye.name} | Üyelerimiz | MANİMAD`,
    description: `${uye.name} — ${uye.sector ?? "MANİMAD üyesi"} firmasının iletişim ve detay bilgileri.`,
  };
}

export default async function UyeDetayPage({ params }: Props) {
  const { id } = await params;

  const uye = await prisma.memberCompany.findUnique({
    where: { id },
  });

  if (!uye) notFound();

  // Ayni sektorden diger 3 uye
  const digerUyeler = uye.sector
    ? await prisma.memberCompany.findMany({
        where: {
          active: true,
          sector: uye.sector,
          id: { not: id },
        },
        take: 3,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          owner: true,
          sector: true,
          address: true,
          phone: true,
          email: true,
        },
      })
    : [];

  return (
    <main>
      <PageHeader
        title={uye.name}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Üyeler", href: "/uyeler" },
          { label: uye.name },
        ]}
      />

      {/* Header banner */}
      <section className="py-12 bg-primary-50 border-b border-primary-100/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Büyük avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(26,39,68,0.25)]">
              <span className="text-white text-3xl font-bold select-none">
                {getInitials(uye.name)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {uye.name}
              </h1>
              {uye.sector && (
                <Badge color="blue" size="md">
                  {uye.sector}
                </Badge>
              )}
              {uye.owner && (
                <p className="flex items-center gap-2 mt-3 text-neutral-600">
                  <User size={15} className="text-primary-300 shrink-0" />
                  <span>{uye.owner}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Bilgi grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {/* Adres */}
            {uye.address && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 flex gap-4 items-start shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Adres
                  </p>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    {uye.address}
                  </p>
                </div>
              </div>
            )}

            {/* Telefon */}
            {uye.phone && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 flex gap-4 items-start shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Telefon
                  </p>
                  <a
                    href={`tel:${uye.phone}`}
                    className="text-neutral-700 text-sm hover:text-primary transition-colors"
                  >
                    {uye.phone}
                  </a>
                </div>
              </div>
            )}

            {/* E-posta */}
            {uye.email && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 flex gap-4 items-start shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    E-posta
                  </p>
                  <a
                    href={`mailto:${uye.email}`}
                    className="text-neutral-700 text-sm hover:text-primary transition-colors break-all"
                  >
                    {uye.email}
                  </a>
                </div>
              </div>
            )}

            {/* Web sitesi */}
            {uye.website && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 flex gap-4 items-start shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Globe size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Web Sitesi
                  </p>
                  <a
                    href={uye.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-700 text-sm hover:text-primary transition-colors break-all"
                  >
                    {uye.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Harita placeholder */}
          <div className="rounded-2xl bg-neutral-100 border border-neutral-200 h-56 flex flex-col items-center justify-center gap-3 mb-10">
            <MapPin size={32} className="text-neutral-300" />
            <p className="text-neutral-400 text-sm font-medium">
              Harita yakında eklenecek
            </p>
          </div>
        </div>
      </section>

      {/* Diger uyeler */}
      {digerUyeler.length > 0 && (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h2 className="text-2xl font-bold text-primary mb-8">
              {uye.sector} Sektöründen Diğer Üyeler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digerUyeler.map((diger) => (
                <MemberCard
                  key={diger.id}
                  id={diger.id}
                  name={diger.name}
                  owner={diger.owner}
                  sector={diger.sector}
                  address={diger.address}
                  phone={diger.phone}
                  email={diger.email}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
