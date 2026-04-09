/**
 * NewsCard bileşeni
 * Haber listelerinde kullanılan premium kart bileşeni.
 * Hover'da yükselen kart, gradient overlay üstünde kategori etiketi.
 */
import Link from "next/link";
import Image from "next/image";
import { Building } from "lucide-react";

interface NewsCardProps {
  title: string;
  slug: string;
  excerpt: string;
  image?: string | null;
  category: string;
  publishedAt: Date | string;
}

/** Kategoriye göre badge arka plan rengi */
function getCategoryBg(category: string): string {
  const map: Record<string, string> = {
    Duyuru: "bg-primary-600",
    Haber: "bg-accent-600",
    Etkinlik: "bg-secondary-600",
    Rapor: "bg-purple-700",
    Mevzuat: "bg-red-700",
  };
  return map[category] ?? "bg-primary-700";
}

export default function NewsCard({
  title,
  slug,
  excerpt,
  image,
  category,
  publishedAt,
}: NewsCardProps) {
  const date = new Date(publishedAt);
  const formatted = date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/haberler/${slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Görsel alanı */}
      <div className="aspect-video relative overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <Building size={40} className="text-primary-300" />
          </div>
        )}

        {/* Alt gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Kategori etiketi — overlay üstünde */}
        <span
          className={`absolute bottom-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full text-white ${getCategoryBg(category)}`}
        >
          {category}
        </span>
      </div>

      {/* İçerik */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-neutral-400">{formatted}</p>

        <h3 className="font-semibold text-primary-800 line-clamp-2 mt-1.5 group-hover:text-secondary-600 transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-sm text-neutral-500 line-clamp-2 mt-2 leading-relaxed">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
