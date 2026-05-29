import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface GalleryImage {
  slot: string;
  caption: string;
}

interface CollegeGalleryProps {
  images: GalleryImage[];
  collegeName: string;
}

function slotToUrl(slot: string) {
  return `/images/${slot}.svg`;
}

export default function CollegeGallery({ images, collegeName }: CollegeGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  if (!images || images.length === 0) return null;

  const featured = images[0];
  const thumbs = images.slice(1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Images size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900 text-lg">Campus Gallery</h2>
        <span className="text-xs text-gray-400 font-medium ml-1">{images.length} photos</span>
      </div>

      {/* Grid layout: 1 large + 4 thumbs + "see all" */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-72 sm:h-80">
        {/* Featured large image */}
        <div
          className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img
            src={slotToUrl(featured.slot)}
            alt={`${collegeName} — ${featured.caption}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-xs font-semibold">{featured.caption}</p>
          </div>
        </div>

        {/* Thumbnails */}
        {thumbs.slice(0, 3).map((img, i) => (
          <div
            key={img.slot}
            className="relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(i + 1)}
          >
            <img
              src={slotToUrl(img.slot)}
              alt={`${collegeName} — ${img.caption}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </div>
        ))}

        {/* "See all" tile */}
        {thumbs.length >= 4 && (
          <div
            className="relative group cursor-pointer overflow-hidden bg-gray-900"
            onClick={() => openLightbox(4)}
          >
            <img
              src={slotToUrl(thumbs[3].slot)}
              alt={`${collegeName} — ${thumbs[3].caption}`}
              className="w-full h-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">+{images.length - 4}</span>
              <span className="text-white/80 text-xs mt-0.5">more</span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={(e) => e.stopPropagation()}>
              <div>
                <p className="text-white font-semibold text-sm">{collegeName}</p>
                <p className="text-white/60 text-xs">{images[lightboxIndex].caption}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-sm">{lightboxIndex + 1} / {images.length}</span>
                <button
                  onClick={closeLightbox}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Close gallery"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center px-16 min-h-0" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={slotToUrl(images[lightboxIndex].slot)}
                  alt={`${collegeName} — ${images[lightboxIndex].caption}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Prev / Next buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={22} className="text-white" />
            </button>

            {/* Thumbnail strip */}
            <div className="shrink-0 px-4 pb-4 pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2 justify-center overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.slot}
                    onClick={() => setLightboxIndex(i)}
                    className={`shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                      i === lightboxIndex ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={slotToUrl(img.slot)}
                      alt={img.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
