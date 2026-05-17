import React from 'react';
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {journeyImages.map((image, index) => (
              <figure
                key={image.id}
                className={`group overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.55)] ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                </div>
                <figcaption className="px-5 py-4 text-sm font-medium text-secondary">
                  {image.alt}
                </figcaption>
              </figure>
            ))}
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
