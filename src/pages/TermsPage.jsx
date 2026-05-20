import React from 'react';
import { BadgeCheck, ClipboardCheck, Home, Sparkles } from 'lucide-react';
import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { useData } from '@/contexts/DataContext';
import { getMetaValue, getStructuredContent } from '@/lib/siteContent';

const TermsPage = () => {
  const { siteContent, loading } = useData();

  const aside = (
    <div className="surface-card overflow-hidden shadow-xl">
      <img
        src="/logo1234.jpeg"
        alt="Cozy Way terms visual"
        className="h-56 w-full object-cover"
      />
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Stay Guidelines</p>
        <h2 className="mt-3 text-2xl font-bold text-secondary font-display">
          Simple expectations for a comfortable stay
        </h2>
        <div className="mt-6 space-y-4">
          {[
            { icon: BadgeCheck, label: 'Confirmed availability before booking' },
            { icon: Home, label: 'Respectful use of rooms and amenities' },
            { icon: ClipboardCheck, label: 'Accurate guest and enquiry details' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-background/70 p-3">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground/80">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <ContentPageTemplate
      title="Terms & Conditions"
      subtitle="Review the key terms, expectations, and usage guidelines for staying with Cozy Way."
      metaTitle={getMetaValue(siteContent, 'terms_and_conditions_meta_title')}
      metaDescription={getMetaValue(siteContent, 'terms_and_conditions_meta_description')}
      content={getStructuredContent(siteContent, 'terms_and_conditions_content', { demoteH1: true })}
      loading={loading}
      heroLabel="Terms"
      heroImage="/logo1234.jpeg"
      heroImageAlt="Cozy Way terms and conditions visual"
      heroHighlights={[
        { label: 'Clear Guidelines', icon: ClipboardCheck },
        { label: 'Guest Comfort', icon: Home },
        { label: 'Smooth Stays', icon: Sparkles },
      ]}
      aside={aside}
      children={
        <div className="rounded-[2rem] border border-border/60 bg-card p-6 text-center shadow-xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Cozy Way Promise</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-bold text-secondary sm:text-4xl font-display">
            Clear terms help every guest enjoy a calmer, better-managed stay.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Please confirm current room details, pricing, and availability with the Cozy Way team before finalizing your stay.
          </p>
        </div>
      }
    />
  );
};

export default TermsPage;
