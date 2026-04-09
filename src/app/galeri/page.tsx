/**
 * Foto Galeri sayfası
 * Tüm albümleri grid formatında listeler, her albümün fotoğraf sayısını gösterir.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Eye } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Foto Galeri | Manisa İnşaat Malzemecileri Derneği",
  description:
    "Derneğimizin etkinlik ve faaliyet fotoğrafları.",
};

function formatTurkishDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function GaleriPage() {
  const albumler = await prisma.galleryAlbum.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: {
        select: { photos: true },
      },
    },
  });

  return (
    <main>
      <PageHeader
        title="Foto Galeri"
        subtitle="Etkinlik ve faaliyet fotoğraflarımız"
        breadcrumbs={[{ label: "Foto Galeri" }]}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {albumler.length === 0 ? (
            <div className="text-center py-20">
              <Camera size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-lg text-neutral-400">Henüz albüm eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albumler.map((album, idx) => (
                <AnimatedSection key={album.id} delay={idx * 0.07}>
                  <Link
                    href={`/galeri/${album.slug}`}
                    className="rounded-2xl overflow-hidden group cursor-pointer bg-white border border-neutral-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 block"
                  >
                    {/* Kapak görseli alanı */}
                    <div className="relative aspect-video bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center overflow-hidden">
                      <Camera
                        size={48}
                        className="text-primary/15 group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Hover overlay — refined */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Eye size={20} className="text-white" />
                        <span className="text-white font-semibold text-sm tracking-wide">
                          Görüntüle
                        </span>
                      </div>
                    </div>

                    {/* Albüm bilgileri */}
                    <div className="p-5">
                      <h3 className="font-semibold text-primary leading-snug group-hover:text-secondary transition-colors">
                        {album.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-sm text-neutral-400">
                          {formatTurkishDate(album.date)}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                          <Camera size={12} />
                          {album._count.photos}
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
