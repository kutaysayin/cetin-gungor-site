"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  BookOpen,
  Image,
  UserCog,
  Gift,
  Mail,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

interface AdminSidebarProps {
  userName: string;
}

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Haberler", href: "/admin/haberler", icon: Newspaper },
  { label: "Etkinlikler", href: "/admin/etkinlikler", icon: Calendar },
  { label: "Uyeler", href: "/admin/uyeler", icon: Users },
  { label: "Yayinlar", href: "/admin/yayinlar", icon: BookOpen },
  { label: "Galeri", href: "/admin/galeri", icon: Image },
  { label: "Yonetim Kurulu", href: "/admin/yonetim", icon: UserCog },
  { label: "Avantajlar", href: "/admin/avantajlar", icon: Gift },
  { label: "Mesajlar", href: "/admin/mesajlar", icon: MessageSquare },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];

export default function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  /* Shared nav content */
  const navContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-secondary-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            Yonetim Paneli
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-white border-l-2 border-secondary-400"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || isMobile) && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-secondary-300">{initials}</span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] text-neutral-400">Admin</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/giris" })}
            title="Cikis Yap"
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-900 text-white rounded-xl shadow-elevated"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 z-50 h-full w-64 bg-[#0a101a] flex flex-col lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              {navContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 bg-[#0a101a] transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {navContent(false)}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary-800 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>
    </>
  );
}
