import React from 'react';
import { Camera, Heart, MapPinned } from 'lucide-react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const OurJourneyPage = () => {
  const { siteContent, galleryImages, loading } = useData();

  const journeyImages = galleryImages
    .filter((image) => String(image.category || '').toLowerCase() === 'journey')
    .map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt || 'Cozy Way journey image',
    }));

  return (
    <ContentPageTemplate
      title="Our Journey"
      subtitle="A look at how Cozy Way has grown into a welcoming stay experience in Dharamshala."
      metaTitle={getMetaValue(siteContent, 'our_journey_meta_title')}
      metaDescription={getMetaValue(siteContent, 'our_journey_meta_description')}
      content={getStructuredContent(siteContent, 'our_journey_content', { demoteH1: true })}
      loading={loading}
      heroLabel="Story"
      heroImage="/logo1234.jpeg"
      heroImageAlt="Cozy Way story and mountain stay visual"
      heroHighlights={[
        { label: 'Built With Care', icon: Heart },
        { label: 'Dharamshala Roots', icon: MapPinned },
        { label: 'Journey Gallery', icon: Camera },
      ]}
    >
      <section>
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-secondary/80">
            Journey Gallery
          </p>
          <h2 className="mt-3 text-2xl font-bold text-secondary sm:text-4xl font-display">
            Moments That Built Cozy Way
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Photos uploaded from the admin dashboard appear here to show the growth,
            spaces, and memories behind Cozy Way.
          </p>
        </div>

        {journeyImages.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="grid gap-5">
                {journeyImages[0] && (
                  <figure className="group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-[0_30px_100px_-55px_rgba(0,0,0,0.45)]">
                    <img
                      src={journeyImages[0].url}
                      alt={journeyImages[0].alt}
                      className="h-full w-full min-h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <figcaption className="absolute left-0 bottom-0 w-full p-6 text-sm font-semibold text-white">
                      {journeyImages[0].alt}
                    </figcaption>
                  </figure>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  {journeyImages[2] && (
                    <figure className="group overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.35)]">
                      <img
                        src={journeyImages[2].url}
                        alt={journeyImages[2].alt}
                        className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="p-5 text-sm font-medium text-secondary">
                        {journeyImages[2].alt}
                      </div>
                    </figure>
                  )}
                  {journeyImages[3] && (
                    <figure className="group overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.35)]">
                      <img
                        src={journeyImages[3].url}
                        alt={journeyImages[3].alt}
                        className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="p-5 text-sm font-medium text-secondary">
                        {journeyImages[3].alt}
                      </div>
                    </figure>
                  )}
                </div>
              </div>

              <div className="grid gap-5">
                {journeyImages[1] && (
                  <figure className="group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.35)]">
                    <img
                      src={journeyImages[1].url}
                      alt={journeyImages[1].alt}
                      className="h-full min-h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                    <figcaption className="absolute left-0 bottom-0 w-full p-5 text-sm font-semibold text-white">
                      {journeyImages[1].alt}
                    </figcaption>
                  </figure>
                )}

                {journeyImages[4] && (
                  <figure className="group overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.35)]">
                    <img
                      src={journeyImages[4].url}
                      alt={journeyImages[4].alt}
                      className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="p-5 text-sm font-medium text-secondary">
                      {journeyImages[4].alt}
                    </div>
                  </figure>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-secondary/30 bg-white/60 px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-medium text-muted-foreground sm:text-base">
              Journey images will appear here after they are uploaded from the admin dashboard.
            </p>
          </div>
        )}
      </section>
    </ContentPageTemplate>
  );
};

export default OurJourneyPage;
