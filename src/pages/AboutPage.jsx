import React from 'react';
import { HeartHandshake, Home, ShieldCheck, Sparkles } from 'lucide-react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const AboutPage = () => {
  const { siteContent, loading } = useData();

  return (
    <ContentPageTemplate
      title="About Cozy Way"
      subtitle="Discover the story, values, and hospitality behind Cozy Way in Dharamshala."
      metaTitle={getMetaValue(siteContent, 'about_page_meta_title')}
      metaDescription={getMetaValue(siteContent, 'about_page_meta_description')}
      content={getStructuredContent(siteContent, 'about_page_content', { demoteH1: true })}
      loading={loading}
      heroLabel="About"
      heroImage="/logo1234.jpeg"
      heroImageAlt="Cozy Way logo with warm mountain home ambience"
      heroHighlights={[
        { label: 'Warm Hospitality', icon: HeartHandshake },
        { label: 'Managed Rooms', icon: Home },
        { label: 'Peaceful Stay', icon: Sparkles },
      ]}
      children={
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: HeartHandshake,
              title: 'Personal Care',
              text: 'A helpful, approachable stay experience shaped around real guest needs.',
            },
            {
              icon: ShieldCheck,
              title: 'Reliable Comfort',
              text: 'Clean rooms, practical amenities, and a calm environment for daily living.',
            },
            {
              icon: Sparkles,
              title: 'Mountain Spirit',
              text: 'A warm visual identity and stay experience rooted in Dharamshala calm.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface-card p-6 shadow-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-secondary font-display">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
          <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-xl md:col-span-3">
            <img
              src="/logo1234.jpeg"
              alt="Cozy Way logo"
              className="h-72 w-full object-cover object-center sm:h-96"
            />
          </div>
        </div>
      }
    />
  );
};

export default AboutPage;
