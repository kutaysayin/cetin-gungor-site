/**
 * Portal kenar cubugu — masaustu sol sidebar
 * Aktif rota vurgusu, navigasyon linkleri ve cikis butonu.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  User,
  Calendar,
  CreditCard,
  Wallet,
  FileText,
  Gift,
  LogOut,
} from "lucide-react";

interface PortalSidebarProps {
  userName: string;
  companyName?: string | null;
}

const navItems = [
  { label: "Dashboard", href: "/portal", icon: Home },
  { label: "Profilim", href: "/portal/profil", icon: User },
  { label: "Etkinliklerim", href: "/portal/etkinliklerim", icon: Calendar },
  { label: "Aidat Durumu", href: "/portal/aidat", icon: CreditCard },
  { label: "Odeme", href: "/portal/odeme", icon: Wallet },
  { label: "Belgelerim", href: "/portal/belgelerim", icon: FileText },
  { label: "Avantajlar", href: "/portal/avantajlar", icon: Gift },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PortalSidebar({ userName, companyName }: PortalSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-primary-800 text-white shrink-0">
      {/* Kullanici bilgisi */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shrink-0 font-bold text-white text-sm shadow-md">
            {getInitials(userName)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{userName}</p>
            {companyName && (
              <p className="text-xs text-white/50 truncate">{companyName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigasyon */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    "border-l-2",
                    active
                      ? "bg-white/10 border-secondary-400 text-white"
                      : "border-transparent text-white/60 hover:bg-white/5 hover:text-white/90",
                  ].join(" ")}
                >
                  <item.icon
                    size={16}
                    className={active ? "text-secondary-400" : "text-white/50"}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Alt kisim: Cikis Yap */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 hover:text-red-300 transition-all duration-150 border-l-2 border-transparent"
        >
          <LogOut size={16} />
          Cikis Yap
        </button>
      </div>
    </aside>
  );
}
