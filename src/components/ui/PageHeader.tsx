/**
 * PageHeader bileşeni
 * Sayfa başlığı, alt başlık ve breadcrumb navigasyonu içerir.
 * Premium dot-pattern overlay ile derin lacivert gradient arka plan.
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950">
      {/* Dot pattern overlay */}
      <div className="bg-dot-pattern-light absolute inset-0 opacity-30 pointer-events-none" />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,149,46,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Breadcrumb */}
        <nav
          aria-label="Sayfa yolu"
          className="flex items-center justify-center gap-1.5 text-sm text-primary-300/80 mb-8 flex-wrap"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home size={14} />
            <span>Anasayfa</span>
          </Link>

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1.5">
                <ChevronRight size={14} className="text-primary-300/40 shrink-0" />
                {isLast || !crumb.href ? (
                  <span
                    className={
                      isLast ? "font-medium text-white" : "text-primary-300/80"
                    }
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {/* Başlık */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          {title}
        </h1>

        {/* Dekoratif çizgi */}
        <div className="w-16 h-1 bg-secondary rounded-full mx-auto mt-6" />

        {/* Alt başlık */}
        {subtitle && (
          <p className="text-primary-200/70 text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
