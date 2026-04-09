/**
 * AvantajTabs istemci bileşeni
 * Üyeler arası ve anlaşmalı kurum avantajlarını sekmeli olarak gösterir.
 * Framer Motion ile sekme geçiş animasyonu destekler.
 */
"use client";

import { useState } from "react";
import { Building2, Phone, Mail, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

interface Advantage {
  id: string;
  companyName: string;
  description: string;
  category: string;
  discount: string | null;
  contact: string | null;
  active: boolean;
}

interface AvantajTabsProps {
  uyelerArasi: Advantage[];
  anlasmali: Advantage[];
}

function AvantajCard({ advantage }: { advantage: Advantage }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-neutral-100 p-6 bg-white hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
    >
      {/* Üst alan: logo + isim */}
      <div className="flex items-start gap-4">
        {/* Logo yer tutucu */}
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shrink-0">
          <Building2 size={24} className="text-[#c8952e]" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-snug">
            {advantage.companyName}
          </h3>
          {/* Kategori etiketi */}
          <div className="mt-1">
            {advantage.category === "UYELARARASI" ? (
              <Badge color="blue" size="sm">
                Üyeler Arası
              </Badge>
            ) : (
              <Badge color="green" size="sm">
                Anlaşmalı Kurum
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Açıklama */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {advantage.description}
      </p>

      {/* Alt alan: indirim + iletişim */}
      <div className="flex flex-wrap gap-3 pt-1">
        {/* İndirim rozeti */}
        {advantage.discount && (
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
            <Tag size={13} />
            {advantage.discount}
          </span>
        )}

        {/* İletişim bilgisi */}
        {advantage.contact && (
          <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
            {advantage.contact.includes("@") ? (
              <Mail size={13} className="shrink-0" />
            ) : (
              <Phone size={13} className="shrink-0" />
            )}
            {advantage.contact}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function AvantajTabs({ uyelerArasi, anlasmali }: AvantajTabsProps) {
  const [aktifTab, setAktifTab] = useState<"UYELARARASI" | "ANLASMALI">(
    "UYELARARASI"
  );

  const tabs = [
    {
      key: "UYELARARASI" as const,
      label: "Üyeler Arası Avantajlar",
      count: uyelerArasi.length,
    },
    {
      key: "ANLASMALI" as const,
      label: "Anlaşmalı Kurumlar",
      count: anlasmali.length,
    },
  ];

  const aktifListe = aktifTab === "UYELARARASI" ? uyelerArasi : anlasmali;

  return (
    <div>
      {/* Sekme butonları */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setAktifTab(tab.key)}
            className={[
              "relative px-5 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none",
              aktifTab === tab.key
                ? "text-[#1a2744]"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {tab.label}
            {/* Sayı rozeti */}
            <span
              className={[
                "ml-2 text-xs px-2 py-0.5 rounded-full font-medium",
                aktifTab === tab.key
                  ? "bg-[#1a2744]/10 text-[#1a2744]"
                  : "bg-gray-100 text-gray-500",
              ].join(" ")}
            >
              {tab.count}
            </span>
            {/* Aktif çizgi */}
            {aktifTab === tab.key && (
              <motion.div
                layoutId="aktif-tab-cizgi"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a2744] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* İçerik */}
      <AnimatePresence mode="wait">
        <motion.div
          key={aktifTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {aktifListe.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-40" />
              <p>Bu kategoride henüz avantaj bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aktifListe.map((avantaj) => (
                <AvantajCard key={avantaj.id} advantage={avantaj} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
