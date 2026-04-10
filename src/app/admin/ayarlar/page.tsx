/* Admin — Site Ayarlari */
import { prisma } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Site Ayarlari" };

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-primary-900">
          Site Ayarlari
        </h1>
        <p className="text-neutral-500 mt-1">
          Genel site ayarlarini buradan yonetebilirsiniz.
        </p>
      </div>

      <SettingsClient settings={settings ? JSON.parse(JSON.stringify(settings)) : null} />
    </div>
  );
}
