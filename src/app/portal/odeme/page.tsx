"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  AlertTriangle,
  History,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

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

export default function OdemePage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [cardHolder, setCardHolder] = useState("");

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

  useEffect(() => {
    if (session?.user?.name) {
      setCardHolder(session.user.name);
    }
  }, [session]);

  const pendingPayments = payments.filter((p) => p.status === "BEKLEMEDE");
  const paidPayments = payments.filter((p) => p.status === "ODENDI");

  function openModal(payment: Payment) {
    setSelectedPayment(payment);
    setSuccess(null);
    setProcessing(false);
  }

  function closeModal() {
    setSelectedPayment(null);
    setSuccess(null);
    setProcessing(false);
  }

  function formatCardNumber(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  async function handleSubmit() {
    if (!selectedPayment) return;
    setProcessing(true);

    // Simulate 2s processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch("/api/portal/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          cardHolder,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(data.transactionId);
        fetchPayments();
      } else {
        const err = await res.json();
        alert(err.error || "Odeme islemi basarisiz");
        setProcessing(false);
      }
    } catch {
      alert("Bir hata olustu");
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-secondary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Odeme</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Bekleyen odemelerinizi goruntuleyin ve online odeme yapin.
        </p>
      </div>

      {/* Pending payments */}
      {pendingPayments.length > 0 ? (
        <div className="space-y-3">
          <h2 className="font-semibold text-primary text-sm flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            Bekleyen Odemeler ({pendingPayments.length})
          </h2>
          {pendingPayments.map((payment) => {
            const tb = typeBadge[payment.type] || typeBadge.DIGER;
            return (
              <div
                key={payment.id}
                className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-sm truncate">
                    {payment.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={[
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                        tb.className,
                      ].join(" ")}
                    >
                      {tb.label}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-primary">{formatCurrency(payment.amount)}</p>
                  <button
                    onClick={() => openModal(payment)}
                    className="mt-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs font-semibold hover:shadow-lg transition-all"
                  >
                    Ode
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 p-8 text-center">
          <BadgeCheck size={40} className="text-green-400 mx-auto mb-3" />
          <p className="font-semibold text-primary text-sm">Bekleyen odemeniz bulunmuyor</p>
          <p className="text-xs text-neutral-400 mt-1">Tum odemeleriniz guncel.</p>
        </div>
      )}

      {/* Payment History */}
      {paidPayments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-secondary-500" />
              <h2 className="font-semibold text-primary text-sm">Odeme Gecmisi</h2>
            </div>
            <Link
              href="/portal/odeme/gecmis"
              className="text-xs text-secondary-600 hover:text-secondary-700 font-medium"
            >
              Tumunu Gor
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {paidPayments.slice(0, 5).map((payment) => {
              const tb = typeBadge[payment.type] || typeBadge.DIGER;
              return (
                <div
                  key={payment.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-primary-700 font-medium truncate">
                      {payment.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={[
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                          tb.className,
                        ].join(" ")}
                      >
                        {tb.label}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {formatDate(payment.paidAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-primary text-sm">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 ring-1 ring-green-200">
                      Odendi
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={!processing && !success ? closeModal : undefined}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <CreditCard size={18} className="text-secondary-500" />
                    Odeme Yap
                  </h3>
                  {!processing && !success && (
                    <button
                      onClick={closeModal}
                      className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {success ? (
                  /* Success state */
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="text-lg font-bold text-primary mb-2">
                      Odeme Basarili!
                    </h4>
                    <p className="text-sm text-neutral-500 mb-3">
                      Odemeniz basariyla tamamlandi.
                    </p>
                    <div className="bg-neutral-50 rounded-xl px-4 py-3 inline-block">
                      <p className="text-xs text-neutral-400 mb-1">Islem No</p>
                      <p className="font-mono text-sm text-primary font-semibold">{success}</p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="mt-6 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Kapat
                    </button>
                  </div>
                ) : (
                  /* Payment form */
                  <div className="p-6 space-y-4">
                    {/* Demo warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Bu bir demo odeme sayfasidir. Gercek odeme islemi yapilmaz.
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="bg-neutral-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-neutral-400 mb-1">Odenecek Tutar</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(selectedPayment.amount)}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {selectedPayment.description}
                      </p>
                    </div>

                    {/* Card number */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                        Kart Numarasi
                      </label>
                      <div className="relative">
                        <CreditCard
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          placeholder="0000 0000 0000 0000"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                          Son Kullanma
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          placeholder="AA/YY"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                          }
                          maxLength={3}
                          placeholder="***"
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Card holder */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                        Kart Sahibi
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Ad Soyad"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-secondary-400 transition-all"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={processing}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-sm font-bold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Odeme isleniyor...
                        </>
                      ) : (
                        <>
                          <Wallet size={16} />
                          Odemeyi Tamamla
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
