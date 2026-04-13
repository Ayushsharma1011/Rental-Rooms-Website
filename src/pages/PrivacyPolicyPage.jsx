import React from 'react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const PrivacyPolicyPage = () => {
  const { siteContent, loading } = useData();

  return (
    <ContentPageTemplate
      title="Privacy Policy"
      subtitle="Understand how Cozy Way collects, uses, and protects your information."
      metaTitle={getMetaValue(siteContent, 'privacy_policy_meta_title')}
      metaDescription={getMetaValue(siteContent, 'privacy_policy_meta_description')}
      content={getStructuredContent(siteContent, 'privacy_policy_content', { demoteH1: true })}
      loading={loading}
      heroLabel="Policy"
    />
  );
};

export default PrivacyPolicyPage;
