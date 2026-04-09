"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: Date;
  location: string | null;
  capacity: number | null;
  registrationCount: number;
}

export default function EventsListClient({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (
      !window.confirm(
        `"${title}" etkinligini silmek istediginizden emin misiniz? Tum kayitlar da silinecektir.`
      )
    ) {
      return;
    }
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
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
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-neutral-100">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-neutral-100">
            <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Baslik
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Tarih
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Konum
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Kayitli / Kapasite
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Islemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {events.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-neutral-400">
                Henuz etkinlik eklenmemis
              </td>
            </tr>
          ) : (
            events.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-neutral-800 max-w-xs truncate">
                  {item.title}
                </td>
                <td className="px-5 py-3.5 text-sm text-neutral-500">
                  {new Date(item.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-3.5 text-sm text-neutral-500">
                  {item.location || "-"}
                </td>
                <td className="px-5 py-3.5 text-sm">
                  <span className="font-medium text-neutral-700">
                    {item.registrationCount}
                  </span>
                  <span className="text-neutral-400">
                    {" / "}
                    {item.capacity ?? "Sinirsiz"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/etkinlikler/${item.id}/duzenle`}
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
  );
}
