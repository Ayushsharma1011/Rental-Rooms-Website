import React from 'react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const TermsPage = () => {
  const { siteContent, loading } = useData();

  return (
    <ContentPageTemplate
      title="Terms & Conditions"
      subtitle="Review the key terms, expectations, and usage guidelines for staying with Cozy Way."
      metaTitle={getMetaValue(siteContent, 'terms_and_conditions_meta_title')}
      metaDescription={getMetaValue(siteContent, 'terms_and_conditions_meta_description')}
      content={getStructuredContent(siteContent, 'terms_and_conditions_content', { demoteH1: true })}
      loading={loading}
      heroLabel="Terms"
    />
  );
};

export default TermsPage;
