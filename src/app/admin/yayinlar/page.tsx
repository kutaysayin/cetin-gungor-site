/* Admin — Yayinlar yonetimi */
import { prisma } from "@/lib/db";
import PublicationsClient from "./PublicationsClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Yayin Yonetimi" };

export default async function AdminPublicationsPage() {
  const publications = await prisma.publication.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Yayin Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {publications.length} yayin
          </p>
        </div>
      </div>

      <PublicationsClient
        publications={JSON.parse(JSON.stringify(publications))}
      />
    </div>
  );
}
