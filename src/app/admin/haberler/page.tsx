/* Admin — Haberler listesi */
import { prisma } from "@/lib/db";
import Link from "next/link";
import NewsListClient from "./NewsListClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Haberler Yonetimi" };

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Ust Baslik */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Haberler Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {news.length} haber
          </p>
        </div>
        <Link
          href="/admin/haberler/yeni"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition-colors"
        >
          + Yeni Haber Ekle
        </Link>
      </div>

      <NewsListClient news={news} />
    </div>
  );
}
