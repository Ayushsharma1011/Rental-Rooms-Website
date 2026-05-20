import React from 'react';
import { Eye, LockKeyhole, MailCheck, ShieldCheck } from 'lucide-react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const PrivacyPolicyPage = () => {
  const { siteContent, loading } = useData();

  const aside = (
    <div className="surface-card overflow-hidden shadow-xl">
      <img
        src="/logo1234.jpeg"
        alt="Cozy Way privacy visual"
        className="h-56 w-full object-cover"
      />
      <div className="space-y-4 p-6">
        {[
          { icon: LockKeyhole, title: 'Protected Details', text: 'Guest contact information is used only for relevant stay communication.' },
          { icon: MailCheck, title: 'Clear Communication', text: 'Messages and enquiries help us respond with booking and room support.' },
          { icon: Eye, title: 'Respectful Use', text: 'Information is handled with practical care and limited to service needs.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-secondary">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <ContentPageTemplate
      title="Privacy Policy"
      subtitle="Understand how Cozy Way collects, uses, and protects your information."
      metaTitle={getMetaValue(siteContent, 'privacy_policy_meta_title')}
      metaDescription={getMetaValue(siteContent, 'privacy_policy_meta_description')}
      content={getStructuredContent(siteContent, 'privacy_policy_content', { demoteH1: true })}
      loading={loading}
      heroLabel="Privacy"
      heroImage="/logo1234.jpeg"
      heroImageAlt="Cozy Way privacy policy visual"
      heroHighlights={[
        { label: 'Guest Data Care', icon: ShieldCheck },
        { label: 'Secure Enquiries', icon: LockKeyhole },
        { label: 'Transparent Use', icon: Eye },
      ]}
      aside={aside}
    />
  );
};

export default PrivacyPolicyPage;
