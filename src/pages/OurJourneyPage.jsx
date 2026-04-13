import React from 'react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const OurJourneyPage = () => {
  const { siteContent, loading } = useData();

  return (
    <ContentPageTemplate
      title="Our Journey"
      subtitle="A look at how Cozy Way has grown into a welcoming stay experience in Dharamshala."
      metaTitle={getMetaValue(siteContent, 'our_journey_meta_title')}
      metaDescription={getMetaValue(siteContent, 'our_journey_meta_description')}
      content={getStructuredContent(siteContent, 'our_journey_content', { demoteH1: true })}
      loading={loading}
      heroLabel="Story"
    />
  );
};

export default OurJourneyPage;
