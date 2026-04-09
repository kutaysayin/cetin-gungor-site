/**
 * Portal Belgelerim sayfasi
 * Uye belgelerini kategorilere gore listeler ve indirme secenegi sunar.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, File, Download, FolderOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belgelerim | Uye Portali",
};

interface BelgeItem {
  ad: string;
  boyut: string;
  tur: "pdf" | "doc" | "zip";
}

interface BelgeKategori {
  baslik: string;
  iconName: "FileText" | "File" | "FolderOpen";
  aciklama: string;
  belgeler: BelgeItem[];
}

const kategoriler: BelgeKategori[] = [
  {
    baslik: "Uyelik Belgeleri",
    iconName: "FileText",
    aciklama: "Uyeliginize ozgu resmi belgeler",
    belgeler: [
      { ad: "Uyelik Belgesi", boyut: "245 KB", tur: "pdf" },
      { ad: "Uye Kimlik Karti", boyut: "180 KB", tur: "pdf" },
    ],
  },
  {
    baslik: "Dernek Belgeleri",
    iconName: "File",
    aciklama: "Dernege ait genel belgeler ve dokumanlar",
    belgeler: [
      { ad: "Dernek Tuzugu", boyut: "1.2 MB", tur: "pdf" },
      { ad: "Uye El Kitabi", boyut: "3.4 MB", tur: "pdf" },
    ],
  },
  {
    baslik: "Raporlar",
    iconName: "FolderOpen",
    aciklama: "Yillik faaliyet ve sektor raporlari",
    belgeler: [
      { ad: "2024 Faaliyet Raporu", boyut: "8.7 MB", tur: "pdf" },
      { ad: "Sektor Raporu 2024", boyut: "5.1 MB", tur: "pdf" },
    ],
  },
];

const turRenk: Record<BelgeItem["tur"], string> = {
  pdf: "bg-red-50 text-red-600",
  doc: "bg-blue-50 text-blue-600",
  zip: "bg-amber-50 text-amber-600",
};

const ikonlar = { FileText, File, FolderOpen };

function BelgeKart({ belge }: { belge: BelgeItem }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors duration-150">
      <div
        className={[
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold uppercase",
          turRenk[belge.tur],
        ].join(" ")}
      >
        {belge.tur}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-primary text-sm truncate">{belge.ad}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{belge.boyut}</p>
      </div>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-medium transition-colors duration-150 shrink-0"
        title="Indirme Sprint 5'te aktif olacak"
      >
        <Download size={13} />
        <span className="hidden sm:inline">Indir</span>
      </a>
    </div>
  );
}

export default async function PortalBelgelerimPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/giris");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Belgelerim</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Uyeliginize ait belgeler ve dernek dokumanlarini buradan indirebilirsiniz.
        </p>
      </div>

      {/* Bilgi notu */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs text-amber-700">
        <Download size={14} className="shrink-0 mt-0.5" />
        <span>
          Belge indirme ozelligi Sprint 5&apos;te aktif hale getirilecektir. Su an belgeler goruntuleme amaclidir.
        </span>
      </div>

      {/* Kategoriler */}
      <div className="space-y-4">
        {kategoriler.map((kategori) => {
          const KategoriIcon = ikonlar[kategori.iconName];
          return (
            <div
              key={kategori.baslik}
              className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <KategoriIcon size={15} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-primary text-sm">
                    {kategori.baslik}
                  </h2>
                  <p className="text-xs text-neutral-400">{kategori.aciklama}</p>
                </div>
                <span className="ml-auto text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {kategori.belgeler.length} belge
                </span>
              </div>

              <div className="divide-y divide-neutral-50">
                {kategori.belgeler.map((belge) => (
                  <BelgeKart key={belge.ad} belge={belge} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
