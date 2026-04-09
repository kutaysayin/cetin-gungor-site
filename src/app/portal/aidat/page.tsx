/**
 * Portal Aidat Durumu sayfasi
 * Kullanicinin aidat durumunu ve odeme gecmisini gosterir.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  CreditCard,
  Info,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aidat Durumu | Uye Portali",
};

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type DuesStatus = "ODENDI" | "BEKLEMEDE" | "GECIKTI";

interface StatusConfig {
  label: string;
  description: string;
  bgClass: string;
  textClass: string;
  ringClass: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const statusConfig: Record<DuesStatus, StatusConfig> = {
  ODENDI: {
    label: "Odendi",
    description: "Aidatiniz guncel durumda. Tesekkur ederiz.",
    bgClass: "bg-green-50",
    textClass: "text-green-700",
    ringClass: "ring-green-200",
    Icon: CheckCircle2,
  },
  BEKLEMEDE: {
    label: "Beklemede",
    description: "Aidatiniz henuz odenmemis. En kisa surede odemenizi yapmanizi rica ederiz.",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    ringClass: "ring-amber-200",
    Icon: Clock,
  },
  GECIKTI: {
    label: "Gecikti",
    description: "Aidatiniz vadesi gecmis durumda. Lutfen en kisa surede iletisime gecin.",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    ringClass: "ring-red-200",
    Icon: AlertTriangle,
  },
};

// Demo aidat gecmisi
const aidatGecmisi = [
  {
    yil: "2024",
    aciklama: "2024 Yillik Aidat",
    tutar: "5.000 TL",
    durum: "Odendi",
    tarih: "15.01.2024",
    durumRenk: "green" as const,
  },
  {
    yil: "2025",
    aciklama: "2025 Yillik Aidat",
    tutar: "6.000 TL",
    durum: "Beklemede",
    tarih: "-",
    durumRenk: "amber" as const,
  },
];

const durumBadgeClasses: Record<string, string> = {
  green: "bg-green-50 text-green-700 ring-1 ring-green-100",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  red: "bg-red-50 text-red-700 ring-1 ring-red-100",
};

export default async function PortalAidatPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      duesStatus: true,
      lastDuesDate: true,
      name: true,
    },
  });

  if (!user) redirect("/giris");

  const status = (user.duesStatus ?? "BEKLEMEDE") as DuesStatus;
  const config = statusConfig[status] ?? statusConfig.BEKLEMEDE;
  const { Icon } = config;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Aidat Durumu</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Aidat durumunuzu ve odeme gecmisinizi goruntuleyin.
        </p>
      </div>

      {/* Durum karti */}
      <div
        className={[
          "rounded-2xl p-6 ring-1 flex items-start gap-5",
          config.bgClass,
          config.ringClass,
        ].join(" ")}
      >
        <div
          className={[
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            "bg-white/70",
          ].join(" ")}
        >
          <Icon size={28} className={config.textClass} />
        </div>
        <div>
          <p className={["text-xl font-bold mb-1", config.textClass].join(" ")}>
            {config.label}
          </p>
          <p className={["text-sm leading-relaxed", config.textClass, "opacity-80"].join(" ")}>
            {config.description}
          </p>
          {user.lastDuesDate && (
            <p className={["text-xs mt-2 font-medium", config.textClass, "opacity-60"].join(" ")}>
              Son odeme tarihi: {formatDate(user.lastDuesDate)}
            </p>
          )}
        </div>
      </div>

      {/* Aidat gecmisi tablosu */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
          <CreditCard size={16} className="text-secondary-500" />
          <h2 className="font-semibold text-primary text-sm">Aidat Gecmisi</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Donem
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Aciklama
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Tutar
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Durum
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {aidatGecmisi.map((item) => (
                <tr key={item.yil} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-primary-700">
                    {item.yil}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{item.aciklama}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-primary">
                    {item.tutar}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={[
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        durumBadgeClasses[item.durumRenk],
                      ].join(" ")}
                    >
                      {item.durum}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-neutral-400 text-xs">
                    {item.tarih}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online odeme ve banka bilgisi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Online odeme */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-secondary-500" />
            <h3 className="font-semibold text-primary text-sm">Online Odeme</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Aidatinizi online olarak kredi karti ile odeyebilirsiniz.
          </p>
          <Link
            href="/portal/odeme"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <CreditCard size={15} />
            Online Ode
          </Link>
        </div>

        {/* Banka bilgileri */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building size={16} className="text-accent-500" />
            <h3 className="font-semibold text-primary text-sm">Banka Havalesi</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-2">
              <span className="text-neutral-400">Banka</span>
              <span className="font-medium text-primary-700">Halkbank Manisa Subesi</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-neutral-400">Hesap Sahibi</span>
              <span className="font-medium text-primary-700">Manisa Insaat Malz. Der.</span>
            </div>
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-neutral-400 mb-1">IBAN</p>
              <p className="font-mono text-xs text-primary-700 bg-neutral-50 px-3 py-2 rounded-lg tracking-wider">
                TR12 0001 2009 0000 0123 4567 89
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-1.5 text-xs text-neutral-400">
            <Info size={12} className="shrink-0 mt-0.5" />
            <span>Havale aciklamasina adinizi ve uye numaranizi yazmaniyi unutmayiniz.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
