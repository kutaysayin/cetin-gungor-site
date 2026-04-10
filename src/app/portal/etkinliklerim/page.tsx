/**
 * Portal Etkinliklerim sayfasi
 * Kullanicinin kayitli oldugu etkinlikleri yaklaşan / gecmis olarak listeler.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import EtkinliklerimTabs from "@/components/portal/EtkinliklerimTabs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Etkinliklerim | Uye Portali",
};

export default async function PortalEtkinliklerimPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/giris");

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: session.user.id },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          date: true,
          location: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  const upcoming = registrations
    .filter((r) => new Date(r.event.date) > now)
    .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime())
    .map((r) => ({
      id: r.id,
      status: r.status,
      event: {
        id: r.event.id,
        title: r.event.title,
        slug: r.event.slug,
        date: r.event.date.toISOString(),
        location: r.event.location,
      },
    }));

  const past = registrations
    .filter((r) => new Date(r.event.date) <= now)
    .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime())
    .map((r) => ({
      id: r.id,
      status: r.status,
      event: {
        id: r.event.id,
        title: r.event.title,
        slug: r.event.slug,
        date: r.event.date.toISOString(),
        location: r.event.location,
      },
    }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Etkinliklerim</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Kayitli oldugunuz ve katildiginiz etkinliklerin listesi.
        </p>
      </div>

      <EtkinliklerimTabs upcoming={upcoming} past={past} />
    </div>
  );
}
