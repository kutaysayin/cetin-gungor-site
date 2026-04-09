/**
 * SectionTitle bileşeni
 * Bölüm başlıkları için dekoratif altın çizgi, başlık, alt başlık
 * ve isteğe bağlı sağ taraf bağlantısı içerir.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  linkText,
  linkHref,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      {/* Sol taraf: dekoratif çizgi + başlık + alt başlık */}
      <div className="flex-1 min-w-0">
        {/* Dekoratif çizgi — altın gradyan */}
        <div className="w-12 h-1 bg-gradient-to-r from-secondary to-secondary-400 rounded-full mb-4" />

        <h2 className="text-2xl md:text-3xl font-bold text-primary-800 leading-tight">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-neutral-500 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Sağ taraf: isteğe bağlı bağlantı */}
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-600 hover:text-secondary-500 transition-colors shrink-0 group"
        >
          <span>{linkText}</span>
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
