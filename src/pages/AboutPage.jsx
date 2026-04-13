import React from 'react';
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
    />
  );
};

export default AboutPage;
