"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

interface User {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  phone: string | null;
  sector: string | null;
  duesStatus: string;
  active: boolean;
  role: string;
  memberSince: string;
  createdAt: string;
}

const duesStatusMap: Record<string, { label: string; color: string }> = {
  ODENDI: { label: "Odendi", color: "bg-green-100 text-green-700" },
  BEKLEMEDE: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700" },
  GECIKTI: { label: "Gecikti", color: "bg-red-100 text-red-700" },
};

export default function UsersListClient({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [duesFilter, setDuesFilter] = useState("");
  const toast = useToast();

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.companyName && u.companyName.toLowerCase().includes(search.toLowerCase()));
      const matchStatus =
        !statusFilter ||
        (statusFilter === "active" && u.active) ||
        (statusFilter === "inactive" && !u.active);
      const matchDues = !duesFilter || u.duesStatus === duesFilter;
      return matchSearch && matchStatus && matchDues;
    });
  }, [users, search, statusFilter, duesFilter]);

  async function toggleStatus(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, active: data.user.active } : u))
      );
      toast.success(data.message);
    } catch {
      toast.error("Durum degistirme basarisiz");
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="">Tum Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
        <select
          value={duesFilter}
          onChange={(e) => setDuesFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="">Tum Aidat Durumlari</option>
          <option value="ODENDI">Odendi</option>
          <option value="BEKLEMEDE">Beklemede</option>
          <option value="GECIKTI">Gecikti</option>
        </select>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="relative max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, email veya firma ara..."
              className="w-full pl-4 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Ad Soyad</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Firma</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Sektor</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Aidat</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Durum</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-neutral-400">
                    Uye bulunamadi.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const s = duesStatusMap[u.duesStatus] ?? {
                    label: u.duesStatus,
                    color: "bg-neutral-100 text-neutral-600",
                  };
                  return (
                    <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900">{u.name}</p>
                        <p className="text-xs text-neutral-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{u.companyName ?? "-"}</td>
                      <td className="px-4 py-3 text-neutral-600">{u.sector ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition hover:opacity-80 ${
                            u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.active ? "Aktif" : "Pasif"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/uyeler/${u.id}`}
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium transition"
                        >
                          Goruntule / Duzenle
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
