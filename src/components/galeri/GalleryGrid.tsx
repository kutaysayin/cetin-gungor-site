/**
 * GalleryGrid istemci bileşeni
 * Fotoğrafları ızgara formatında gösterir; tıklandığında lightbox açar.
 * Klavye navigasyonu ve Framer Motion animasyonlarını destekler.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Image, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface GalleryGridProps {
  photos: GalleryPhoto[];
}

export default function GalleryGrid({ photos }: GalleryGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Klavye desteği
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeLightbox, goToPrev, goToNext]);

  // Lightbox açıkken body scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const currentPhoto = photos[currentIndex];

  return (
    <>
      {/* Fotoğraf Izgarası */}
      {photos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Image size={48} className="mx-auto mb-4 opacity-40" />
          <p>Bu albümde henüz fotoğraf yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="group rounded-lg overflow-hidden aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
              aria-label={photo.caption ?? `Fotoğraf ${index + 1}`}
            >
              {/* Fotoğraf yer tutucu */}
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  size={32}
                  className="text-gray-400 group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                {photo.caption && (
                  <span className="text-white text-xs line-clamp-2 text-left">
                    {photo.caption}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && currentPhoto && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Kapatma butonu */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>

            {/* Sayaç */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </div>

            {/* Sol ok */}
            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Önceki fotoğraf"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Sağ ok */}
            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Sonraki fotoğraf"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Fotoğraf alanı */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[80vh] w-full mx-16 flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Görsel yer tutucu */}
              <div className="w-full aspect-video bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-xl flex items-center justify-center max-h-[70vh]">
                <Image size={64} className="text-white/20" />
              </div>

              {/* Açıklama */}
              {currentPhoto.caption && (
                <p className="text-white/75 text-sm text-center px-4">
                  {currentPhoto.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
