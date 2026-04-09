/**
 * Footer bileşeni — Premium Design Polish
 * Multi-layer wave separator + layered gradient background + dot pattern overlay.
 * 4 sütun: logo/sosyal, hızlı linkler, iletişim, e-bülten.
 * Column headings: küçük dekoratif çizgi + uppercase tracking.
 */

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

// ─── Sosyal medya: inline SVG ikonları ───────────────────────────────────────

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTwitterX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconYoutube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

// ─── Logo SVG (footer versiyonu — always light) ───────────────────────────────

function FooterLogoIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 2L26 10V18L14 26L2 18V10L14 2Z"
        fill="rgba(255,255,255,0.12)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <rect x="10" y="12" width="8" height="10" fill="#c8952e" rx="0.5" />
      <path d="M14 7L19 12H9L14 7Z" fill="#c8952e" />
      <rect x="12.5" y="17" width="3" height="5" fill="#1a2744" rx="0.5" />
      <rect x="11" y="13.5" width="2" height="2" fill="rgba(26,39,68,0.7)" rx="0.25" />
      <rect x="15" y="13.5" width="2" height="2" fill="rgba(26,39,68,0.7)" rx="0.25" />
    </svg>
  );
}

// ─── Sosyal medya linkleri ────────────────────────────────────────────────────

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", Icon: IconInstagram },
  { label: "Facebook", href: "https://facebook.com", Icon: IconFacebook },
  { label: "X (Twitter)", href: "https://x.com", Icon: IconTwitterX },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: IconLinkedin },
  { label: "YouTube", href: "https://youtube.com", Icon: IconYoutube },
];

// ─── Hızlı linkler ────────────────────────────────────────────────────────────

const quickLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Haberler", href: "/haberler" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Üyeler", href: "/uyeler" },
  { label: "Yayınlar", href: "/yayinlar" },
  { label: "Galeri", href: "/galeri" },
  { label: "Avantaj Rehberi", href: "/avantaj-rehberi" },
  { label: "İletişim", href: "/iletisim" },
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
];

// ─── Sütun başlığı bileşeni ───────────────────────────────────────────────────

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 mb-5">
      <span className="w-6 h-px bg-secondary-500 inline-block shrink-0" />
      <span className="text-secondary-400 uppercase text-xs tracking-[0.2em] font-semibold">
        {children}
      </span>
    </h3>
  );
}

// ─── Footer bileşeni ──────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative">

      {/* Multi-layer dalgalı SVG ayırıcı */}
      <div className="bg-white relative" aria-hidden="true">
        <svg
          viewBox="0 0 1440 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          {/* Layer 3 — en arkada, en açık */}
          <path
            d="M0 72L60 60C120 48 240 24 360 18C480 12 600 24 720 33.6C840 43.2 960 50.4 1080 48C1200 45.6 1320 33.6 1380 27.6L1440 22V72H0Z"
            fill="#152036"
            opacity="0.5"
          />
          {/* Layer 2 — ortada */}
          <path
            d="M0 72L60 58C120 44 240 16 360 11C480 6 600 22 720 32C840 42 960 46 1080 44C1200 42 1320 34 1380 30L1440 26V72H0Z"
            fill="#101828"
            opacity="0.7"
          />
          {/* Layer 1 — önde, en koyu */}
          <path
            d="M0 72L60 56C120 40 240 8 360 4C480 0 600 20 720 30C840 40 960 44 1080 42C1200 40 1320 32 1380 28L1440 24V72H0Z"
            fill="#0a101a"
          />
        </svg>
      </div>

      {/* Ana footer içeriği */}
      <div
        className="bg-dot-pattern-light"
        style={{
          background: "linear-gradient(to bottom, #0a101a, #101828, #152036)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

          {/* 4 sütun grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* Sütun 1: Logo + Açıklama + Sosyal medya */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <FooterLogoIcon />
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-white tracking-tight">Cetin Gungor</span>
                  <span className="text-[10px] text-secondary-400 uppercase tracking-[0.08em] mt-0.5">
                    İnşaat Malzemecileri Derneği
                  </span>
                </div>
              </div>

              <p className="text-white/55 text-sm leading-relaxed mb-7">
                Manisa İnşaat Malzemecileri Derneği olarak sektörümüzün
                gelişimine, üyelerimizin haklarına ve bölgemizin kalkınmasına
                katkı sağlamak için çalışıyoruz.
              </p>

              {/* Sosyal medya ikonları */}
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2 rounded-full bg-white/8 text-white/50 hover:bg-secondary hover:text-white hover:scale-110 transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Sütun 2: Hızlı Linkler */}
            <div>
              <ColumnHeading>Hızlı Linkler</ColumnHeading>
              <ul className="space-y-2.5">
                {quickLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group text-sm text-white/55 hover:text-secondary-400 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-secondary-500/40 group-hover:bg-secondary-400 transition-colors shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sütun 3: İletişim */}
            <div>
              <ColumnHeading>İletişim</ColumnHeading>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-white/55">
                  <MapPin size={15} className="text-secondary-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Manisa Organize Sanayi Bölgesi,
                    <br />
                    45030 Yunusemre / Manisa
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+902362000000"
                    className="flex items-center gap-3 text-sm text-white/55 hover:text-secondary-400 transition-colors duration-200"
                  >
                    <Phone size={15} className="text-secondary-500 shrink-0" />
                    +90 (236) 200 00 00
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@cetingungor.org.tr"
                    className="flex items-center gap-3 text-sm text-white/55 hover:text-secondary-400 transition-colors duration-200"
                  >
                    <Mail size={15} className="text-secondary-500 shrink-0" />
                    info@cetingungor.org.tr
                  </a>
                </li>
              </ul>
            </div>

            {/* Sütun 4: E-Bülten */}
            <div>
              <ColumnHeading>E-Bülten</ColumnHeading>
              <p className="text-sm text-white/55 mb-5 leading-relaxed">
                Sektör haberleri ve etkinliklerden haberdar olmak için
                e-bültenimize abone olun.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Alt çizgi */}
          <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-primary-400">
            <span>© {new Date().getFullYear()} Cetin Gungor. Tüm hakları saklıdır.</span>
            <div className="flex items-center gap-4">
              <Link
                href="/kvkk"
                className="hover:text-secondary-400 transition-colors duration-200"
              >
                KVKK
              </Link>
              <span className="text-white/10">|</span>
              <Link
                href="/cerez-politikasi"
                className="hover:text-secondary-400 transition-colors duration-200"
              >
                Çerez Politikası
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
