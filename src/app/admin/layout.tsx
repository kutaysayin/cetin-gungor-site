import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExternalLink } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";

export const metadata = {
  title: "Yonetim Paneli | Manisa Insaat Malzemecileri Dernegi",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-neutral-50">
        {/* Sidebar */}
        <AdminSidebar userName={session.user.name ?? "Admin"} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800 pl-12 lg:pl-0">
              Yonetim Paneli
            </h2>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-700 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Siteyi Goruntule</span>
            </a>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
