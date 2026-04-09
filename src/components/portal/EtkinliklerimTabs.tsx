/**
 * Etkinliklerim sekme bileseni
 * Yaklaşan ve gecmis kayitlari iki sekme halinde gosterir.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Trash2,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string | null;
}

interface Registration {
  id: string;
  status: string;
  event: EventData;
}

interface EtkinliklerimTabsProps {
  upcoming: Registration[];
  past: Registration[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ONAYLANDI") {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-green-100">
        <CheckCircle2 size={11} />
        Onaylandi
      </span>
    );
  }
  if (status === "IPTAL") {
    return (
      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-red-100">
        <XCircle size={11} />
        Iptal Edildi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-amber-100">
      <Clock size={11} />
      Beklemede
    </span>
  );
}

function RegistrationCard({
  reg,
  isPast,
  onCancel,
  cancelLoading,
}: {
  reg: Registration;
  isPast: boolean;
  onCancel: (id: string) => void;
  cancelLoading: string | null;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const eventDate = new Date(reg.event.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-neutral-100 shadow-[var(--shadow-card)] overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Tarih bloku */}
      <div className="sm:w-20 flex-shrink-0 bg-primary-50 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 px-4 py-4 sm:px-0 sm:py-5 text-center">
        <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-wider">
          {eventDate.toLocaleDateString("tr-TR", { month: "short" })}
        </span>
        <span className="text-2xl font-bold text-primary leading-none sm:mt-0.5">
          {eventDate.getDate()}
        </span>
        <span className="text-[10px] text-neutral-400">
          {eventDate.getFullYear()}
        </span>
      </div>

      {/* Icerik */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary text-sm leading-snug">
              {reg.event.title}
            </h3>
            {reg.event.location && (
              <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                <MapPin size={11} className="shrink-0" />
                {reg.event.location}
              </p>
            )}
          </div>
          <StatusBadge status={reg.status} />
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-neutral-400">
            {formatDate(reg.event.date)}
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={`/etkinlikler/${reg.event.slug}`}
              className="text-xs text-accent-600 hover:text-accent-700 font-medium flex items-center gap-0.5"
            >
              Detay <ArrowRight size={11} />
            </Link>

            {!isPast && reg.status !== "IPTAL" && (
              <>
                {confirmOpen ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-red-600">Emin misiniz?</span>
                    <button
                      onClick={() => {
                        onCancel(reg.id);
                        setConfirmOpen(false);
                      }}
                      disabled={cancelLoading === reg.id}
                      className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-2 py-0.5 rounded-lg font-medium transition-colors"
                    >
                      {cancelLoading === reg.id ? "..." : "Evet"}
                    </button>
                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="text-xs bg-neutral-100 text-neutral-600 hover:bg-neutral-200 px-2 py-0.5 rounded-lg font-medium transition-colors"
                    >
                      Hayir
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-0.5 transition-colors"
                  >
                    <Trash2 size={11} />
                    Iptal
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EtkinliklerimTabs({ upcoming, past }: EtkinliklerimTabsProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [localUpcoming, setLocalUpcoming] = useState(upcoming);

  async function handleCancel(registrationId: string) {
    setCancelLoading(registrationId);
    try {
      const res = await fetch("/api/events/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      if (res.ok) {
        setLocalUpcoming((prev) => prev.filter((r) => r.id !== registrationId));
      }
    } finally {
      setCancelLoading(null);
    }
  }

  const tabs = [
    { key: "upcoming" as const, label: "Kayitli Olduklarim", count: localUpcoming.length },
    { key: "past" as const, label: "Gecmis Katilimlarim", count: past.length },
  ];

  const activeList = activeTab === "upcoming" ? localUpcoming : past;

  return (
    <div>
      {/* Sekmeler */}
      <div className="flex gap-1 mb-6 bg-neutral-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
              activeTab === tab.key
                ? "bg-white text-primary shadow-[var(--shadow-xs)]"
                : "text-neutral-500 hover:text-neutral-700",
            ].join(" ")}
          >
            <Calendar size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.key === "upcoming" ? "Yaklaşan" : "Gecmis"}</span>
            <span
              className={[
                "text-[11px] px-1.5 py-0.5 rounded-full font-medium",
                activeTab === tab.key
                  ? "bg-primary-50 text-primary"
                  : "bg-neutral-200 text-neutral-500",
              ].join(" ")}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Icerik */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
              <Calendar size={40} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-sm text-neutral-400 font-medium">
                {activeTab === "upcoming"
                  ? "Henuz bir etkinlige kayit olmadiniz."
                  : "Gecmis etkinlik kaydiniз bulunmuyor."}
              </p>
              {activeTab === "upcoming" && (
                <Link
                  href="/etkinlikler"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-accent-600 hover:text-accent-700 font-medium"
                >
                  Etkinliklere goz at <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {activeList.map((reg) => (
                <RegistrationCard
                  key={reg.id}
                  reg={reg}
                  isPast={activeTab === "past"}
                  onCancel={handleCancel}
                  cancelLoading={cancelLoading}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
