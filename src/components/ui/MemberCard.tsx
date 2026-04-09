/* Uye kart bileseni — firma bilgilerini ozet olarak gosterir */
/* Premium: hover'da sol border accent, sektore gore avatar gradyani */

import Link from "next/link";
import { User, Phone, Mail } from "lucide-react";

interface MemberCardProps {
  id: string;
  name: string;
  owner: string | null;
  sector: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

type SectorStyle = {
  gradient: string;
  text: string;
};

function getSectorStyle(sector: string | null): SectorStyle {
  if (!sector) {
    return { gradient: "from-primary-100 to-accent-100", text: "text-primary-600" };
  }
  const lower = sector.toLowerCase();
  if (lower.includes("seramik"))
    return { gradient: "from-blue-100 to-blue-200", text: "text-blue-600" };
  if (lower.includes("boya"))
    return { gradient: "from-purple-100 to-purple-200", text: "text-purple-600" };
  if (lower.includes("tesisat"))
    return { gradient: "from-teal-100 to-teal-200", text: "text-teal-600" };
  if (lower.includes("elektrik"))
    return { gradient: "from-amber-100 to-amber-200", text: "text-amber-600" };
  if (lower.includes("hirdavat") || lower.includes("hırdavat"))
    return { gradient: "from-red-100 to-red-200", text: "text-red-600" };
  return { gradient: "from-primary-100 to-accent-100", text: "text-primary-600" };
}

export default function MemberCard({
  id,
  name,
  owner,
  sector,
  address,
  phone,
  email,
}: MemberCardProps) {
  const sectorStyle = getSectorStyle(sector);

  return (
    <Link
      href={`/uyeler/${id}`}
      className="group relative flex flex-col rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Sol border accent — hover'da açılır */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-secondary origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
      />

      {/* Ust kisim: Avatar + isim + sektor */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar — sektore gore renk, kare yuvarlak köşe */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sectorStyle.gradient} flex items-center justify-center shrink-0`}
        >
          <span className={`text-lg font-bold select-none ${sectorStyle.text}`}>
            {getInitials(name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary-800 leading-tight mb-1.5 group-hover:text-secondary-600 transition-colors line-clamp-2">
            {name}
          </h3>
          {sector && (
            <span className="inline-flex items-center text-xs rounded-full px-2.5 py-0.5 bg-neutral-100 text-neutral-600 font-medium">
              {sector}
            </span>
          )}
        </div>
      </div>

      {/* Detay bilgileri */}
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-neutral-100">
        {owner && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <User size={14} className="shrink-0 text-primary-300" />
            <span className="truncate">{owner}</span>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Phone size={14} className="shrink-0 text-primary-300" />
            <span className="truncate">{phone}</span>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Mail size={14} className="shrink-0 text-primary-300" />
            <span className="truncate">{email}</span>
          </div>
        )}

        {!owner && !phone && !email && address && (
          <p className="text-sm text-neutral-400 line-clamp-2">{address}</p>
        )}
      </div>
    </Link>
  );
}
