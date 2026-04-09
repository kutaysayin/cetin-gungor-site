"use client";

import { useState, useEffect, useCallback } from "react";
import { History, Loader2, Filter, Receipt } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  description: string;
  type: string;
  status: string;
  paymentMethod: string | null;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
}

const typeBadge: Record<string, { label: string; className: string }> = {
  AIDAT: { label: "Aidat", className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  ETKINLIK: { label: "Etkinlik", className: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  DIGER: { label: "Diger", className: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200" },
};

const statusBadge: Record<string, { label: string; className: string }> = {
  BEKLEMEDE: { label: "Beklemede", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  ODENDI: { label: "Odendi", className: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  IPTAL: { label: "Iptal", className: "bg-red-50 text-red-700 ring-1 ring-red-200" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OdemeGecmisPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter((p) => {
    if (typeFilter !== "ALL" && p.type !== typeFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-secondary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Odeme Gecmisi</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Tum odemelerinizin detayli gecmisini goruntuleyin.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 p-4 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-neutral-400" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary-300"
        >
          <option value="ALL">Tum Turler</option>
          <option value="AIDAT">Aidat</option>
          <option value="ETKINLIK">Etkinlik</option>
          <option value="DIGER">Diger</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary-300"
        >
          <option value="ALL">Tum Durumlar</option>
          <option value="ODENDI">Odendi</option>
          <option value="BEKLEMEDE">Beklemede</option>
          <option value="IPTAL">Iptal</option>
        </select>
        <span className="text-xs text-neutral-400 ml-auto">
          {filteredPayments.length} kayit
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
          <History size={16} className="text-secondary-500" />
          <h2 className="font-semibold text-primary text-sm">Tum Odemeler</h2>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt size={40} className="text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">Filtreye uygun odeme bulunamadi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Tarih
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Aciklama
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Tutar
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Tur
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Durum
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Islem No
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredPayments.map((payment) => {
                  const tb = typeBadge[payment.type] || typeBadge.DIGER;
                  const sb = statusBadge[payment.status] || statusBadge.BEKLEMEDE;
                  return (
                    <tr key={payment.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3.5 text-neutral-500 text-xs whitespace-nowrap">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-primary-700">
                        {payment.description}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-primary whitespace-nowrap">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={[
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                            tb.className,
                          ].join(" ")}
                        >
                          {tb.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={[
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            sb.className,
                          ].join(" ")}
                        >
                          {sb.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono text-neutral-400">
                        {payment.transactionId || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
