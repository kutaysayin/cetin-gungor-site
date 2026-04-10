/* Admin — Avantajlar yonetimi */
import { prisma } from "@/lib/db";
import AdvantagesClient from "./AdvantagesClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Avantaj Yonetimi" };

export default async function AdminAdvantagesPage() {
  const advantages = await prisma.advantage.findMany({
    orderBy: { companyName: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Avantaj Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {advantages.length} avantaj
          </p>
        </div>
      </div>

      <AdvantagesClient
        advantages={JSON.parse(JSON.stringify(advantages))}
      />
    </div>
  );
}
