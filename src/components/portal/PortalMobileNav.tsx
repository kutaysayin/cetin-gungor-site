/**
 * Portal mobil alt navigasyon cubugu
 * Ekranin altinda sabit, 5 sekme ikon ile hizli gezinme.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Calendar, CreditCard, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Gift, FileText, LogOut, X, Wallet } from "lucide-react";

const primaryTabs = [
  { label: "Panel", href: "/portal", icon: Home },
  { label: "Profil", href: "/portal/profil", icon: User },
  { label: "Etkinlik", href: "/portal/etkinliklerim", icon: Calendar },
  { label: "Aidat", href: "/portal/aidat", icon: CreditCard },
];

const moreTabs = [
  { label: "Odeme", href: "/portal/odeme", icon: Wallet },
  { label: "Belgelerim", href: "/portal/belgelerim", icon: FileText },
  { label: "Avantajlar", href: "/portal/avantajlar", icon: Gift },
];

export default function PortalMobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Alt navigasyon cubugu */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-elevated">
        <ul className="flex items-stretch h-16">
          {primaryTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  className={[
                    "flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors duration-150",
                    active ? "text-primary" : "text-neutral-400 hover:text-neutral-600",
                  ].join(" ")}
                >
                  <tab.icon
                    size={20}
                    className={active ? "text-secondary-500" : "text-neutral-400"}
                  />
                  {tab.label}
                </Link>
              </li>
            );
          })}

          {/* Daha fazla butonu */}
          <li className="flex-1">
            <button
              onClick={() => setMoreOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 h-full w-full text-[10px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
            >
              <MoreHorizontal size={20} />
              Daha
            </button>
          </li>
        </ul>
      </nav>

      {/* Daha fazla menüsü (drawer) */}
      {moreOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/40"
            onClick={() => setMoreOpen(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-primary text-sm">Diger Sayfalar</p>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="space-y-1">
              {moreTabs.map((tab) => (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors duration-150"
                  >
                    <tab.icon size={18} className="text-secondary-500" />
                    {tab.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut size={18} />
                  Cikis Yap
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
