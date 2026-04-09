/**
 * Portal Dashboard sayfasi
 * Kullaniciya ozet bilgiler, yaklasan etkinlikler ve son duyurular sunar.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Newspaper,
  ArrowRight,
  Building2,
  CreditCard,
  Users,
  Gift,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getMembershipDuration(since: Date): string {
  const now = new Date();
  const months =
    (now.getFullYear() - since.getFullYear()) * 12 +
    now.getMonth() -
    since.getMonth();
  if (months < 1) return "Yeni uye";
  if (months < 12) return `${months} ay`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years} yil ${remMonths} ay` : `${years} yil`;
}

type DuesStatus = "ODENDI" | "BEKLEMEDE" | "GECIKTI";

function DuesStatusBadge({ status }: { status: string }) {
  if (status === "ODENDI") {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium ring-1 ring-green-100">
        <CheckCircle2 size={14} />
        Odendi
      </span>
    );
  }
  if (status === "GECIKTI") {
    return (
      <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm font-medium ring-1 ring-red-100">
        <AlertTriangle size={14} />
        Gecikti
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium ring-1 ring-amber-100">
      <Clock size={14} />
      Beklemede
    </span>
  );
}

export default async function PortalDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/giris");

  const userId = session.user.id;

  // Paralel veri cekme
  const [user, registrations, advantages, latestNews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        companyName: true,
        memberSince: true,
        duesStatus: true,
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId },
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
    }),
    prisma.advantage.count({ where: { active: true } }),
    prisma.news.findMany({
      take: 3,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        publishedAt: true,
        excerpt: true,
      },
    }),
  ]);

  if (!user) redirect("/giris");

  const now = new Date();
  const upcomingRegistrations = registrations.filter(
    (r) => new Date(r.event.date) > now
  );
  const pastRegistrations = registrations.filter(
    (r) => new Date(r.event.date) <= now
  );

  const duesStatus = user.duesStatus as DuesStatus;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hosgeldiniz basligi */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
          Hosgeldiniz, {user.name.split(" ")[0]}
        </h1>
        <p className="text-neutral-500 text-sm">
          Uye panelinizden bilgilerinizi yonetebilir ve etkinliklere katilabilirsiniz.
        </p>
      </div>

      {/* Ozet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Aidat durumu */}
        <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] border border-neutral-100 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <CreditCard size={16} className="text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1.5">Aidat Durumu</p>
            <DuesStatusBadge status={duesStatus} />
          </div>
        </div>

        {/* Uyelik suresi */}
        <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] border border-neutral-100 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-50 flex items-center justify-center">
            <Users size={16} className="text-accent-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1">Uyelik Suresi</p>
            <p className="font-semibold text-primary text-sm">
              {getMembershipDuration(user.memberSince)}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {formatDate(user.memberSince)}
            </p>
          </div>
        </div>

        {/* Kayitli etkinlik */}
        <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] border border-neutral-100 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-50 flex items-center justify-center">
            <Calendar size={16} className="text-secondary-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1">Kayitli Etkinlik</p>
            <p className="text-2xl font-bold text-primary leading-none">
              {registrations.length}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {upcomingRegistrations.length} yaklasan
            </p>
          </div>
        </div>

        {/* Avantaj sayisi */}
        <div className="bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] border border-neutral-100 flex flex-col gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <Gift size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1">Avantaj Sayisi</p>
            <p className="text-2xl font-bold text-primary leading-none">
              {advantages}
            </p>
            <p className="text-xs text-neutral-400 mt-1">aktif avantaj</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yaklasan etkinlikler */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-secondary-500" />
              <h2 className="font-semibold text-primary text-sm">
                Yaklasan Etkinliklerim
              </h2>
            </div>
            <Link
              href="/portal/etkinliklerim"
              className="text-xs text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1"
            >
              Tumu <ArrowRight size={12} />
            </Link>
          </div>

          {upcomingRegistrations.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Calendar size={32} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm text-neutral-400">
                Yaklasan kayitli etkinliginiz bulunmuyor.
              </p>
              <Link
                href="/etkinlikler"
                className="mt-3 inline-flex items-center gap-1 text-xs text-accent-600 hover:text-accent-700 font-medium"
              >
                Etkinliklere goz at <ArrowRight size={11} />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-50">
              {upcomingRegistrations.slice(0, 3).map((reg) => (
                <li key={reg.id}>
                  <Link
                    href={`/etkinlikler/${reg.event.slug}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    {/* Tarih kutusu */}
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex flex-col items-center justify-center shrink-0 text-center">
                      <span className="text-[10px] font-semibold text-secondary-500 uppercase leading-none">
                        {new Date(reg.event.date).toLocaleDateString("tr-TR", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold text-primary leading-none mt-0.5">
                        {new Date(reg.event.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm truncate">
                        {reg.event.title}
                      </p>
                      {reg.event.location && (
                        <p className="text-xs text-neutral-400 mt-0.5 truncate">
                          {reg.event.location}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={14} className="text-neutral-300 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Son duyurular */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper size={16} className="text-accent-500" />
              <h2 className="font-semibold text-primary text-sm">
                Son Duyurular
              </h2>
            </div>
            <Link
              href="/haberler"
              className="text-xs text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1"
            >
              Tumu <ArrowRight size={12} />
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Newspaper size={32} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm text-neutral-400">Haber bulunmuyor.</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-50">
              {latestNews.map((news) => (
                <li key={news.id}>
                  <Link
                    href={`/haberler/${news.slug}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Newspaper size={14} className="text-accent-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm line-clamp-2 leading-snug">
                        {news.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge color="blue" size="sm">
                          {news.category}
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          {formatDate(news.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Hizli islemler */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 p-5">
        <h2 className="font-semibold text-primary text-sm mb-4">
          Hizli Islemler
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/portal/profil" variant="outline" size="sm">
            Profil Duzenle
          </Button>
          <Button href="/etkinlikler" variant="outline" size="sm">
            Etkinliklere Goz At
          </Button>
          <Button href="/portal/aidat" size="sm">
            Aidat Durumu
          </Button>
        </div>
      </div>
    </div>
  );
}
