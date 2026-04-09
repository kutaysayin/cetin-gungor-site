/**
 * Portal duzen bileseni
 * Masaustunde: sol sidebar (w-64) + sag icerik alani
 * Mobilde: ust bar + alt sekme cubugu + icerik
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PortalSidebar from "@/components/portal/PortalSidebar";
import PortalMobileNav from "@/components/portal/PortalMobileNav";
import Link from "next/link";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris");
  }

  const userName = session.user.name ?? "Uye";
  const companyName = session.user.companyName;

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Masaustu sol sidebar */}
      <PortalSidebar userName={userName} companyName={companyName} />

      {/* Ana icerik alani */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobil ust bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-800 flex items-center justify-center">
              <span className="text-secondary-400 text-xs font-bold">CG</span>
            </div>
            <span className="font-semibold text-primary text-sm">Portal</span>
          </Link>

          {/* Kullanici avatar inisyalleri */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-bold">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </header>

        {/* Sayfa icerigi */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobil alt navigasyon */}
      <PortalMobileNav />
    </div>
  );
}
