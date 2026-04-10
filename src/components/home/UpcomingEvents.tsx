import { prisma } from "@/lib/db";
import type { Event } from "../../generated/prisma/client";
import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { MapPin, CalendarX } from "lucide-react";
import Link from "next/link";

async function getUpcomingEvents(): Promise<Event[]> {
  try {
    return await prisma.event.findMany({
      where: { date: { gt: new Date() } },
      orderBy: { date: "asc" },
      take: 5,
    });
  } catch {
    return [];
  }
}

const MONTHS_TR = [
  "OCA", "SUB", "MAR", "NIS", "MAY", "HAZ",
  "TEM", "AGU", "EYL", "EKI", "KAS", "ARA",
];

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            title="Yaklasan Etkinlikler"
            linkText="Tum Etkinlikler →"
            linkHref="/etkinlikler"
            className="mb-12"
          />
        </AnimatedSection>

        {events.length === 0 ? (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                <CalendarX size={28} className="text-neutral-300" />
              </div>
              <p className="text-neutral-400 font-medium">Yaklasan etkinlik bulunmuyor</p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1}>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
              {events.map((event) => {
                const d = new Date(event.date);
                const month = MONTHS_TR[d.getMonth()];
                const day = d.getDate();

                return (
                  <div
                    key={event.id}
                    className="min-w-[320px] snap-start bg-white rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 group p-5 flex gap-4"
                  >
                    {/* Date block */}
                    <div className="bg-primary-600 text-white rounded-xl p-4 w-20 text-center flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                        {month}
                      </span>
                      <span className="text-3xl font-bold leading-none mt-0.5">
                        {day}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <p className="font-semibold text-primary leading-snug line-clamp-2 mb-1.5">
                        {event.title}
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-1.5 text-sm text-neutral-500 line-clamp-1">
                          <MapPin size={13} className="shrink-0 text-secondary" />
                          {event.location}
                        </p>
                      )}
                      <Link
                        href={`/etkinlikler/${event.slug}`}
                        className="mt-3 text-xs font-semibold text-secondary hover:text-secondary-600 transition-colors"
                      >
                        Detay →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
