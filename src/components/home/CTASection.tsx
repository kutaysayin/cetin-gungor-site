"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950">
      {/* Floating decorative shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full bg-accent/5 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary/5 blur-2xl pointer-events-none" />
      <div className="absolute top-8 right-1/3 w-48 h-48 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      {/* Subtle dot pattern overlay */}
      <div className="bg-dot-pattern-light absolute inset-0 pointer-events-none opacity-50" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <AnimatedSection>
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 rounded-full px-4 py-1.5 text-sm tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
              Uyeliginizi Baslatin
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Siz de Ailemize{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
              Katilin
            </span>
          </h2>

          <p className="text-white/50 text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            Manisa insaat sektorunde birlikte daha gucluyuz. Uyelerimizin
            yaninda olmak icin buradayiz.
          </p>

          <div className="mt-8">
            <Link
              href="/uyelik"
              className="inline-flex items-center justify-center bg-white text-primary-600 font-bold px-10 py-4 rounded-full text-lg hover:shadow-[var(--shadow-elevated)] hover:scale-[1.02] transition-all duration-300"
            >
              Uyelik Basvurusu
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
