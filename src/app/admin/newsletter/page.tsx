/* Admin — Newsletter yonetim sayfasi */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Download, UserMinus, Users, UserCheck, UserX } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  async function handleDeactivate(id: string) {
    if (!confirm("Bu aboneyi devre disi birakmak istediginize emin misiniz?")) return;
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: false } : s))
        );
      }
    } catch {
      // silent
    }
  }

  function downloadCSV() {
    const headers = ["Email", "Isim", "Durum", "Kayit Tarihi"];
    const rows = subscribers.map((s) => [
      s.email,
      s.name ?? "-",
      s.active ? "Aktif" : "Pasif",
      new Date(s.createdAt).toLocaleDateString("tr-TR"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-aboneleri-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter((s) => s.active).length;
  const inactiveCount = subscribers.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Baslik */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 font-display">
            Newsletter Aboneleri
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            E-bulten abone listesini yonetin
          </p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          CSV Indir
        </button>
      </div>

      {/* Ozet kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{subscribers.length}</p>
              <p className="text-xs text-neutral-500">Toplam Abone</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{activeCount}</p>
              <p className="text-xs text-neutral-500">Aktif Abone</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{inactiveCount}</p>
              <p className="text-xs text-neutral-500">Pasif Abone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Arama */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-4 border-b border-neutral-100">
          <input
            type="text"
            placeholder="Email veya isim ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Tablo */}
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Yukleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-500">Abone bulunamadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-left">
                  <th className="px-4 py-3 font-semibold text-neutral-600">Email</th>
                  <th className="px-4 py-3 font-semibold text-neutral-600">Isim</th>
                  <th className="px-4 py-3 font-semibold text-neutral-600">Kayit Tarihi</th>
                  <th className="px-4 py-3 font-semibold text-neutral-600">Durum</th>
                  <th className="px-4 py-3 font-semibold text-neutral-600">Islemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-800">{sub.email}</td>
                    <td className="px-4 py-3 text-neutral-600">{sub.name ?? "-"}</td>
                    <td className="px-4 py-3 text-neutral-500">
                      {new Date(sub.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sub.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sub.active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sub.active && (
                        <button
                          onClick={() => handleDeactivate(sub.id)}
                          title="Aboneligi Iptal Et"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
