/* Etkinlikler listesi sayfasi — yaklasan ve gecmis etkinlikler, liste/takvim gorunumleri */

import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import EventsView from "@/components/etkinlikler/EventsView";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Etkinlikler | MANİMAD",
  description: "Dernek etkinlikleri ve sektör buluşmaları",
};

export default async function EtkinliklerPage() {
  const now = new Date();

  const tumEtkinlikler = await prisma.event.findMany({
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      date: true,
      endDate: true,
      location: true,
      capacity: true,
    },
  });

  // Yaklasan ve gecmis olarak ayir
  const yaklaşanEtkinlikler = tumEtkinlikler
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const gecmisEtkinlikler = tumEtkinlikler.filter(
    (e) => new Date(e.date) <= now
  );

  // Tarihleri string'e cevirelim (client component'a gecmek icin)
  function serializeEvent(e: {
    id: string;
    title: string;
    slug: string;
    description: string;
    date: Date;
    endDate: Date | null;
    location: string | null;
    capacity: number | null;
  }) {
    return {
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      date: e.date.toISOString(),
      endDate: e.endDate ? e.endDate.toISOString() : null,
      location: e.location,
      capacity: e.capacity,
    };
  }

  return (
    <main>
      <PageHeader
        title="Etkinlikler"
        subtitle="Dernek etkinlikleri ve sektör buluşmaları"
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Etkinlikler" },
        ]}
      />

      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Tüm Etkinlikler"
            subtitle={`${tumEtkinlikler.length} etkinlik bulunuyor`}
            className="mb-8"
          />

          <EventsView
            upcomingEvents={yaklaşanEtkinlikler.map(serializeEvent)}
            pastEvents={gecmisEtkinlikler.map(serializeEvent)}
          />
        </div>
      </section>
    </main>
  );
}
