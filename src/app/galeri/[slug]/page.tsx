/**
 * Galeri albüm detay sayfası
 * Seçili albümün tüm fotoğraflarını lightbox destekli ızgara ile gösterir.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Camera, CalendarDays, Images } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import GalleryGrid from "@/components/galeri/GalleryGrid";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { slug } });

  if (!album) {
    return { title: "Albüm Bulunamadı" };
  }

  return {
    title: `${album.title} | Foto Galeri | Manisa İnşaat Malzemecileri Derneği`,
    description: album.description ?? `${album.title} albümü fotoğrafları.`,
  };
}

function formatTurkishDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function GaleriAlbumPage({ params }: PageProps) {
  const { slug } = await params;

  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!album) {
    notFound();
  }

  return (
    <main>
      <PageHeader
        title={album.title}
        subtitle={album.description ?? undefined}
        breadcrumbs={[
          { label: "Foto Galeri", href: "/galeri" },
          { label: album.title },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Albüm meta bilgileri */}
          <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-neutral-100">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <CalendarDays size={15} className="text-primary-300" />
              <span>{formatTurkishDate(album.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Images size={15} className="text-primary-300" />
              <span>
                <strong className="text-primary font-semibold">
                  {album.photos.length}
                </strong>{" "}
                fotoğraf
              </span>
            </div>
            {album.photos.length === 0 && (
              <div className="w-full text-center py-20">
                <Camera size={48} className="mx-auto mb-4 text-neutral-300" />
                <p className="text-neutral-400">Bu albümde henüz fotoğraf yok.</p>
              </div>
            )}
          </div>

          {/* Fotoğraf ızgarası — istemci bileşeni */}
          <GalleryGrid photos={album.photos} />
        </div>
      </section>
    </main>
  );
}
