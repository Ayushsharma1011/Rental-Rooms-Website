import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2, MapPin, X } from 'lucide-react';

import PageTransition from '@/components/shared/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useData } from '@/contexts/DataContext';

const PREVIEW_CHAR_LIMIT = 135;

const NearbySpotCard = ({ spot, onReadMore }) => {
  const hasMapLink = !!spot.map_link;
  const description = spot.description || '';
  const isLongDescription = description.length > PREVIEW_CHAR_LIMIT;
  const previewDescription = isLongDescription
    ? `${description.slice(0, PREVIEW_CHAR_LIMIT).trimEnd()}...`
    : description;

  const handleOpenMap = () => {
    if (hasMapLink) window.open(spot.map_link, '_blank');
  };

  return (
    <motion.div whileHover={{ y: -10 }} className="group mx-auto w-full max-w-sm">
      <Card className="surface-card text-card-foreground overflow-hidden w-full h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={spot.image_alt || spot.name}
            src={
              spot.image_url ||
              'https://images.unsplash.com/photo-1598928636135-d146006ff4be'
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90" />

          {hasMapLink && (
            <div className="absolute top-4 left-4 bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md border border-white/30">
              <MapPin className="h-4 w-4" />
              Open Map
            </div>
          )}
        </div>

        <CardContent className="p-6 flex flex-col flex-1">
          <h3 className="text-xl sm:text-2xl font-bold font-display text-secondary min-h-[5.25rem] leading-7 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
            {spot.name}
          </h3>

          <p className="text-muted-foreground mt-2 text-sm leading-6 min-h-[4.5rem] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
            {previewDescription}
          </p>

          <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between gap-3">
            {isLongDescription ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => onReadMore(spot)}
              >
                Read More
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground"> </span>
            )}

            {hasMapLink && (
              <Button size="sm" className="rounded-full" onClick={handleOpenMap}>
                <MapPin className="mr-2 h-4 w-4" />
                Open Map
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NearbySpotDetailModal = ({ spot, open, onOpenChange }) => {
  if (!spot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-3xl p-0 overflow-hidden rounded-3xl border-border/60">
        <div className="relative max-h-[88vh] overflow-y-auto bg-card">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 z-20 rounded-full bg-black/55 p-2 text-white hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-64 sm:h-80">
            <img
              src={
                spot.image_url ||
                'https://images.unsplash.com/photo-1598928636135-d146006ff4be'
              }
              alt={spot.image_alt || spot.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <h3 className="absolute bottom-4 left-4 right-14 text-xl sm:text-3xl font-bold font-display text-white">
              {spot.name}
            </h3>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {spot.description}
            </p>

            {spot.map_link && (
              <div className="mt-6">
                <Button
                  className="rounded-full"
                  onClick={() => window.open(spot.map_link, '_blank')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open Location in Maps
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NearbySpotsPage = () => {
  const { nearbySpots, loading } = useData();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleSpots = nearbySpots.slice(0, visibleCount);

  return (
    <PageTransition>
      <Helmet>
        <title>Nearby Spots | Cozy Way</title>
        <meta
          name="description"
          content="Discover nearby attractions from Cozy Way, a best homestay in Dharamshala, while enjoying rooms in Dharamshala."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
        />
      </Helmet>

      <section className="pt-28 sm:pt-32 pb-16">
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
              Top Spots
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mt-4 mb-4">
              Explore Dharamshala
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Discover the beauty and culture surrounding Cozy Way. Adventure
              awaits just around the corner.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center pt-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleSpots.map((spot, index) => (
                  <motion.div
                    key={spot.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-center group"
                  >
                    <NearbySpotCard spot={spot} onReadMore={setSelectedSpot} />
                  </motion.div>
                ))}
              </div>

              {visibleCount < nearbySpots.length && (
                <div className="mt-10 flex justify-center">
                  <Button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 4, nearbySpots.length))}
                    className="rounded-full bg-secondary px-6 py-3 text-secondary-foreground shadow-lg hover:bg-secondary/90"
                  >
                    More Spots
                  </Button>
                </div>
              )}
            </>
          )}

          {nearbySpots.length === 0 && !loading && (
            <p className="text-center text-muted-foreground mt-12">
              No nearby spots have been added yet.
            </p>
          )}
        </div>
      </section>

      <NearbySpotDetailModal
        spot={selectedSpot}
        open={!!selectedSpot}
        onOpenChange={() => setSelectedSpot(null)}
      />
    </PageTransition>
  );
};

export default NearbySpotsPage;
