/**
 * PublicationCard bileşeni
 * Dergi, rapor ve rehber yayınlarını premium kart formatında gösterir.
 * Hover'da hafif tilt + scale efekti, tip adı gradient overlay üstünde.
 */

import { BookOpen, FileText, BookMarked } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface PublicationCardProps {
  title: string;
  type: string;
  description: string | null;
  issueNumber: number | null;
  publishedAt: Date;
  fileUrl: string | null;
}

const typeConfig = {
  DERGI: {
    gradient: "from-[#1a2744] to-[#0d1628]",
    icon: BookOpen,
    label: "Dergi",
    badgeColor: "blue" as const,
  },
  RAPOR: {
    gradient: "from-[#2a9d8f] to-[#1a6b62]",
    icon: FileText,
    label: "Rapor",
    badgeColor: "green" as const,
  },
  REHBER: {
    gradient: "from-[#c8952e] to-[#9a6e1c]",
    icon: BookMarked,
    label: "Rehber",
    badgeColor: "amber" as const,
  },
};

function formatTurkishDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function PublicationCard({
  title,
  type,
  description,
  issueNumber,
  publishedAt,
  fileUrl,
}: PublicationCardProps) {
  const config =
    typeConfig[type as keyof typeof typeConfig] ?? typeConfig.RAPOR;
  const Icon = config.icon;

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 group hover:-translate-y-1 flex flex-col">
      {/* Kapak alanı */}
      <div
        className={`relative aspect-[3/4] bg-gradient-to-br ${config.gradient} overflow-hidden`}
      >
        {/* Büyük arka plan ikonu — hover'da subtle scale+tilt */}
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
          <Icon size={56} className="text-white/20" />
        </div>

        {/* Tip adı overlay — alt gradient üstünde */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
          <span className="text-white text-sm font-medium">{config.label}</span>
        </div>

        {/* Tür etiketi — sol üst */}
        <div className="absolute top-3 left-3">
          <Badge color={config.badgeColor} size="sm">
            {config.label}
          </Badge>
        </div>

        {/* Sayı numarası — sadece dergiler için */}
        {type === "DERGI" && issueNumber && (
          <div className="absolute bottom-3 right-3 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm font-semibold">
            Sayı {issueNumber}
          </div>
        )}
      </div>

      {/* İçerik alanı */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        {/* Başlık */}
        <h3 className="font-semibold text-primary-800 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Sayı numarası metni — sadece dergi */}
        {type === "DERGI" && issueNumber && (
          <p className="text-xs text-secondary-500 font-medium">
            Sayı {issueNumber}
          </p>
        )}

        {/* Açıklama */}
        {description && (
          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tarih */}
        <p className="text-xs text-neutral-400 mt-auto">
          {formatTurkishDate(publishedAt)}
        </p>

        {/* Butonlar */}
        <div className="flex gap-2 mt-4">
          <Button variant="primary" size="sm" href={fileUrl ?? "#"} className="flex-1">
            Online Oku
          </Button>
          <Button variant="outline" size="sm" href={fileUrl ?? "#"} className="flex-1">
            PDF İndir
          </Button>
        </div>
      </div>
    </div>
  );
}
