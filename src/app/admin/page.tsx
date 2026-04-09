import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Users,
  UserCheck,
  Newspaper,
  Calendar,
  BookOpen,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react";

/* ────────── Helpers ────────── */

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* ────────── Stat Card ────────── */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

/* ────────── Page ────────── */

export default async function AdminDashboard() {
  const [
    totalUsers,
    activeUsers,
    newsCount,
    eventsCount,
    publicationsCount,
    unreadMessages,
    recentNews,
    recentMessages,
    upcomingEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { active: true } }),
    prisma.news.count(),
    prisma.event.count(),
    prisma.publication.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: { id: true, title: true, category: true, publishedAt: true, slug: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, subject: true, read: true, createdAt: true },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
      select: {
        id: true,
        title: true,
        date: true,
        slug: true,
        _count: { select: { registrations: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Genel bakis ve ozet bilgiler
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-primary-600" />}
          label="Toplam Uye"
          value={totalUsers}
          color="bg-primary-100"
        />
        <StatCard
          icon={<UserCheck className="w-6 h-6 text-accent-600" />}
          label="Aktif Uye"
          value={activeUsers}
          color="bg-accent-100"
        />
        <StatCard
          icon={<Newspaper className="w-6 h-6 text-secondary-600" />}
          label="Haberler"
          value={newsCount}
          color="bg-secondary-100"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          label="Etkinlikler"
          value={eventsCount}
          color="bg-blue-100"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-purple-600" />}
          label="Yayinlar"
          value={publicationsCount}
          color="bg-purple-100"
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-red-600" />}
          label="Okunmamis Mesaj"
          value={unreadMessages}
          color="bg-red-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/haberler/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Haber Ekle
        </Link>
        <Link
          href="/admin/etkinlikler/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-xl hover:bg-accent-700 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Etkinlik Ekle
        </Link>
        <Link
          href="/admin/uyeler"
          className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 bg-white text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50 transition"
        >
          <Users className="w-4 h-4" />
          Uye Listesi
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Son Haberler */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-800">Son Haberler</h3>
            <Link
              href="/admin/haberler"
              className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 transition"
            >
              Tumunu Gor <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentNews.length === 0 ? (
              <p className="px-5 py-8 text-sm text-neutral-400 text-center">
                Henuz haber yok.
              </p>
            ) : (
              recentNews.map((news) => (
                <div
                  key={news.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-700 truncate">
                      {news.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {news.category} &middot; {formatDate(news.publishedAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/haberler/${news.slug}`}
                    className="text-xs text-primary-500 hover:text-primary-700 ml-3 whitespace-nowrap transition"
                  >
                    Duzenle
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Son Mesajlar */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-800">Son Mesajlar</h3>
            <Link
              href="/admin/mesajlar"
              className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 transition"
            >
              Tumunu Gor <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentMessages.length === 0 ? (
              <p className="px-5 py-8 text-sm text-neutral-400 text-center">
                Henuz mesaj yok.
              </p>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition ${
                    !msg.read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm truncate ${
                        !msg.read
                          ? "font-bold text-neutral-800"
                          : "font-medium text-neutral-700"
                      }`}
                    >
                      {msg.name}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {msg.subject} &middot; {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 ml-3" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Yaklasan Etkinlikler */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-800">Yaklasan Etkinlikler</h3>
          <Link
            href="/admin/etkinlikler"
            className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1 transition"
          >
            Tumunu Gor <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <p className="px-5 py-8 text-sm text-neutral-400 text-center">
            Yaklasan etkinlik bulunmuyor.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-700 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {formatDate(event.date)}
                  </p>
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">
                  {event._count.registrations} kayit
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
