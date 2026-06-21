import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Lightbox = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  // Prevent page scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images]);

  if (!isOpen || !images || images.length === 0) return null;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2.5 text-white transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-50 rounded-full bg-white/10 p-2 sm:p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          )}

          {/* Image Container with scale transition */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl bg-transparent flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt || 'Enlarged view'}
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl transition-all duration-300"
            />
            {currentImage.alt && (
              <p className="mt-3 text-center text-sm sm:text-base font-medium text-white/90 drop-shadow-md select-none px-4 max-w-xl">
                {currentImage.alt}
              </p>
            )}
          </motion.div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-50 rounded-full bg-white/10 p-2 sm:p-3 text-white transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur select-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
