import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const GalleryPage = () => {
  const { galleryImages, loading } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedImg, setSelectedImg] = useState(null);

  const categories = ['all', ...Array.from(new Set(galleryImages.map(img => img.category)))];
  
  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === filter);

  return (
    <PageTransition>
      <Helmet>
        <title>Gallery | Cozy Way</title>
        <meta
          name="description"
          content="View photos of Cozy Way, a best homestay in Dharamshala, showcasing rooms in Dharamshala and scenic mountain views."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
        />
      </Helmet>
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-frame px-6 sm:px-10 py-12 sm:py-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a24] via-[#2f3f35] to-[#4b5c4a] opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 grain-overlay" />
            </div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/70">
              Visual Journey
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mt-4 mb-4">
              A Gallery of Cozy Way
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Immerse yourself in the beauty of Cozy Way and the enchanting landscapes of Dharamshala.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">

        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12">
          {categories.map(category => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'secondary'}
              onClick={() => setFilter(category)}
              className="capitalize rounded-full px-5 sm:px-6"
            >
              {category}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-secondary" /></div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  layout
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  key={image.id}
                  className="overflow-hidden rounded-2xl bg-white/60 border border-white/50 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.45)] cursor-pointer group"
                  onClick={() => setSelectedImg(image)}
                >
                  <div className="relative aspect-[4/5] sm:aspect-[3/4]">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImg(null)}
            >
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="relative max-w-5xl max-h-[90vh] w-full"
              >
                <img src={selectedImg.url} alt={selectedImg.alt} className="w-full h-full object-contain rounded-2xl bg-black/40" />
                <Button variant="ghost" size="icon" className="absolute -top-12 -right-2 text-white" onClick={() => setSelectedImg(null)}>
                  <X size={32} />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
};

export default GalleryPage;
