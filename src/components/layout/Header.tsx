/**
 * Header bileşeni — Premium Design Polish
 * Sabit üst navigasyon. Kaydırmada şeffaf → glassmorphism geçişi.
 * Masaüstünde animated underline nav + glassmorphism dropdown.
 * Mobilde full-overlay drawer + staggered link animations.
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from "lucide-react";
import NotificationBell from "@/components/ui/NotificationBell";

// ─── Tip tanımları ────────────────────────────────────────────────────────────

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

// ─── Navigasyon yapısı ────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Hakkımızda",
    href: "/hakkimizda",
    children: [
      { label: "Tarihçe", href: "/hakkimizda" },
      { label: "Yönetim Kurulu", href: "/hakkimizda/yonetim" },
      { label: "Tüzük", href: "/hakkimizda/tuzuk" },
      { label: "Çalışma Grupları", href: "/hakkimizda/calisma-gruplari" },
    ],
  },
  { label: "Haberler", href: "/haberler" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Üyeler", href: "/uyeler" },
  { label: "Yayınlar", href: "/yayinlar" },
  { label: "Galeri", href: "/galeri" },
  { label: "Avantaj Rehberi", href: "/avantaj-rehberi" },
  { label: "İletişim", href: "/iletisim" },
];

// ─── Custom geometric logo SVG ────────────────────────────────────────────────

function LogoIcon({ scrolled }: { scrolled: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Base diamond shape */}
      <path
        d="M14 2L26 10V18L14 26L2 18V10L14 2Z"
        fill={scrolled ? "#1a2744" : "rgba(255,255,255,0.15)"}
        stroke={scrolled ? "#1a2744" : "rgba(255,255,255,0.6)"}
        strokeWidth="1"
      />
      {/* Inner building silhouette */}
      <rect
        x="10"
        y="12"
        width="8"
        height="10"
        fill={scrolled ? "#c8952e" : "rgba(255,255,255,0.9)"}
        rx="0.5"
      />
      {/* Building top / roof triangle */}
      <path
        d="M14 7L19 12H9L14 7Z"
        fill={scrolled ? "#c8952e" : "white"}
      />
      {/* Door */}
      <rect
        x="12.5"
        y="17"
        width="3"
        height="5"
        fill={scrolled ? "#1a2744" : "rgba(26,39,68,0.6)"}
        rx="0.5"
      />
      {/* Windows */}
      <rect x="11" y="13.5" width="2" height="2" fill={scrolled ? "#1a2744" : "rgba(26,39,68,0.5)"} rx="0.25" />
      <rect x="15" y="13.5" width="2" height="2" fill={scrolled ? "#1a2744" : "rgba(26,39,68,0.5)"} rx="0.25" />
    </svg>
  );
}

// ─── Masaüstü dropdown ───────────────────────────────────────────────────────

function DesktopDropdown({ children }: { children: NavChild[] }) {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden"
    >
      {children.map((child) => (
        <li key={child.href}>
          <Link
            href={child.href}
            className="group flex items-center gap-2 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary transition-all duration-150 border-l-2 border-transparent hover:border-secondary-500"
          >
            <ChevronRight
              size={13}
              className="text-secondary-400 group-hover:text-secondary transition-colors shrink-0"
            />
            {child.label}
          </Link>
        </li>
      ))}
    </motion.ul>
  );
}

// ─── Masaüstü nav öğesi ───────────────────────────────────────────────────────

function DesktopNavItem({
  item,
  scrolled,
}: {
  item: NavItem;
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const textBase = scrolled
    ? "text-primary-800 hover:text-primary"
    : "text-white/90 hover:text-white";

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          className={`relative group text-sm font-medium transition-colors duration-200 ${textBase} inline-flex flex-col items-center`}
        >
          {item.label}
          {/* Animated underline */}
          <span
            className={`absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out rounded-full ${
              scrolled ? "bg-secondary-500" : "bg-secondary-300"
            }`}
          />
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative group flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${textBase} pb-0`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {/* Animated underline */}
        <span
          className={`absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out rounded-full ${
            scrolled ? "bg-secondary-500" : "bg-secondary-300"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && <DesktopDropdown children={item.children} />}
      </AnimatePresence>
    </li>
  );
}

// ─── Mobil nav öğesi ─────────────────────────────────────────────────────────

function MobileNavItem({
  item,
  onClose,
  index,
}: {
  item: NavItem;
  onClose: () => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <motion.li
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      >
        <Link
          href={item.href}
          onClick={onClose}
          className="flex items-center py-3 px-4 text-primary-800 font-medium hover:bg-primary-50 hover:text-primary rounded-xl transition-all duration-150"
        >
          {item.label}
        </Link>
      </motion.li>
    );
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 px-4 text-primary-800 font-medium hover:bg-primary-50 rounded-xl transition-all duration-150"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 text-neutral-400 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onClose}
                  className="flex items-center gap-2 py-2.5 pl-8 pr-4 text-sm text-primary-600 hover:text-primary hover:bg-primary-50 rounded-xl transition-all duration-150"
                >
                  <ChevronRight size={13} className="text-secondary shrink-0" />
                  {child.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

// ─── Kullanıcı Avatar Dropdown ────────────────────────────────────────────────

function UserMenu({ scrolled }: { scrolled: boolean }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!session) {
    return (
      <Link
        href="/giris"
        className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(200,149,46,0.35)] hover:scale-[1.02]"
      >
        Üye Girişi
      </Link>
    );
  }

  // Initials from name
  const initials = session.user?.name
    ? session.user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Kullanıcı menüsü"
        className={`flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-200 ${
          scrolled
            ? "hover:bg-primary-50"
            : "hover:bg-white/10"
        }`}
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-bold leading-none select-none shadow-sm">
          {initials}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${scrolled ? "text-primary-600" : "text-white/80"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-1.5 z-50 overflow-hidden"
          >
            {/* User name hint */}
            <div className="px-4 py-2.5 border-b border-neutral-100">
              <p className="text-xs text-neutral-500 truncate">Hoş geldiniz</p>
              <p className="text-sm font-semibold text-primary-800 truncate">
                {session.user?.name ?? session.user?.email}
              </p>
            </div>

            <Link
              href="/portal"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary transition-all duration-150"
            >
              <LayoutDashboard size={15} className="text-secondary-500" />
              Portal
            </Link>
            <Link
              href="/portal/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary transition-all duration-150"
            >
              <UserCircle size={15} className="text-secondary-500" />
              Profilim
            </Link>

            <div className="border-t border-neutral-100 my-1" />

            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150"
            >
              <LogOut size={15} />
              Çıkış Yap
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Ana Header bileşeni ──────────────────────────────────────────────────────

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        animate={{
          height: scrolled ? 64 : 80,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
          scrolled
            ? "bg-white/85 backdrop-blur-2xl shadow-xs"
            : "bg-transparent"
        }`}
        style={{ height: scrolled ? 64 : 80 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <motion.div
              animate={{ scale: scrolled ? 0.9 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <LogoIcon scrolled={scrolled} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className={`font-bold tracking-tight text-base transition-colors duration-400 ${
                  scrolled ? "text-primary-800" : "text-white"
                }`}
              >
                Cetin Gungor
              </span>
              <span
                className={`text-[10px] tracking-[0.08em] uppercase font-medium transition-colors duration-400 ${
                  scrolled ? "text-secondary-500" : "text-white/60"
                }`}
              >
                İnşaat Malzemecileri
              </span>
            </div>
          </Link>

          {/* Masaüstü navigasyon */}
          <nav className="hidden lg:block flex-1">
            <ul className="flex items-center gap-5 xl:gap-7 justify-center">
              {navItems.map((item) => (
                <DesktopNavItem key={item.href} item={item} scrolled={scrolled} />
              ))}
            </ul>
          </nav>

          {/* Sağ aksiyon butonları */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Arama ikonu */}
            <button
              aria-label="Ara"
              className={`p-2 rounded-full transition-all duration-200 ${
                scrolled
                  ? "text-primary-600 hover:bg-primary-50"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Search size={18} />
            </button>

            {/* Bildirim zili — sadece giris yapmis kullanicilar */}
            {session && <NotificationBell scrolled={scrolled} />}

            {/* Üye Girişi / Kullanıcı Menüsü — masaüstünde görünür */}
            <UserMenu scrolled={scrolled} />

            {/* Hamburger — mobil */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü aç"
              className={`lg:hidden p-2 rounded-full transition-all duration-200 ${
                scrolled
                  ? "text-primary-700 hover:bg-primary-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobil çekmece */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-white rounded-l-3xl shadow-2xl flex flex-col lg:hidden"
            >
              {/* Çekmece başlığı */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <LogoIcon scrolled={true} />
                  <span className="font-bold text-primary tracking-tight">Cetin Gungor</span>
                </div>
                <motion.button
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  onClick={() => setMobileOpen(false)}
                  aria-label="Menüyü kapat"
                  className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-primary transition-all duration-200"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Navigasyon linkleri */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-0.5">
                  {navItems.map((item, index) => (
                    <MobileNavItem
                      key={item.href}
                      item={item}
                      onClose={() => setMobileOpen(false)}
                      index={index}
                    />
                  ))}
                </ul>
              </nav>

              {/* Alt kısım: Üye Girişi / Kullanıcı Aksiyonları */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="p-4 border-t border-neutral-100"
              >
                {!session ? (
                  <Link
                    href="/giris"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold hover:shadow-[0_0_24px_rgba(200,149,46,0.3)] hover:scale-[1.01] transition-all duration-200"
                  >
                    Üye Girişi
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/portal"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-primary-800 font-medium hover:bg-primary-50 hover:text-primary transition-all duration-150"
                    >
                      <LayoutDashboard size={16} className="text-secondary" />
                      Portal
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-all duration-150"
                    >
                      <LogOut size={16} />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
