/* Admin — Etkinlikler listesi */
import { prisma } from "@/lib/db";
import Link from "next/link";
import EventsListClient from "./EventsListClient";

export const metadata = { title: "Etkinlikler Yonetimi" };

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  const eventsForClient = events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    date: e.date,
    location: e.location,
    capacity: e.capacity,
    registrationCount: e._count.registrations,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Etkinlikler Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {events.length} etkinlik
          </p>
        </div>
        <Link
          href="/admin/etkinlikler/yeni"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition-colors"
        >
          + Yeni Etkinlik Ekle
        </Link>
      </div>

      <EventsListClient events={eventsForClient} />
    </div>
  );
}
