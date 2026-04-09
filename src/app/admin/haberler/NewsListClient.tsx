"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  publishedAt: Date;
  viewCount: number;
}

const categoryLabels: Record<string, string> = {
  SEKTOR: "Sektor",
  DERNEK: "Dernek",
  TIMFED: "TIMFED",
  DERNEKLERDEN: "Derneklerden",
};

export default function NewsListClient({ news }: { news: NewsItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`"${title}" haberini silmek istediginizden emin misiniz?`)) {
      return;
    }
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Silme islemi basarisiz");
      }
    } catch {
      alert("Bir hata olustu");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      {/* Arama */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Haber ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-shadow"
        />
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-neutral-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Baslik
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Kategori
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Tarih
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                One Cikan
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Goruntuleme
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Islemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-neutral-400">
                  {search ? "Aramayla eslesen haber bulunamadi" : "Henuz haber eklenmemis"}
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-neutral-800 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-600">
                    {categoryLabels[item.category] || item.category}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-500">
                    {new Date(item.publishedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-3.5">
                    {item.featured ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                        Evet
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">Hayir</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-500">
                    {item.viewCount}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/haberler/${item.id}/duzenle`}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Duzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        disabled={deleting === item.id}
                        className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        {deleting === item.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
