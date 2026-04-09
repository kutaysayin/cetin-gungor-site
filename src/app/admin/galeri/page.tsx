/* Admin — Galeri yonetimi */
import { prisma } from "@/lib/db";
import GalleryClient from "./GalleryClient";

export const metadata = { title: "Galeri Yonetimi" };

export default async function AdminGalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { date: "desc" },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-900">
            Galeri Yonetimi
          </h1>
          <p className="text-neutral-500 mt-1">
            Toplam {albums.length} album
          </p>
        </div>
      </div>

      <GalleryClient albums={JSON.parse(JSON.stringify(albums))} />
    </div>
  );
}
