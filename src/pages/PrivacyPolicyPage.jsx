
import React from 'react';
import { Helmet } from 'react-helmet';
import PageTransition from '@/components/shared/PageTransition';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Loader2 } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const { siteContent, loading } = useData();

  return (
    <PageTransition>
      <Helmet>
        <title>Privacy Policy | Cozy Way</title>
        <meta
          name="description"
          content="Read the privacy policy for Cozy Way in Dharamshala."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, privacy policy cozy way, rooms in dharamshala, dharamshala rental rooms, stay in dharamshala"
        />
      </Helmet>
      
      <div className="bg-accent pt-28 sm:pt-32 pb-12 sm:pb-16">
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 text-center"
        >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-secondary mb-3 sm:mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Your privacy is our priority.
            </p>
        </motion.div>
      </div>

      <div className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <div className="surface-card rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl text-foreground/80">
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                  {siteContent.privacy_policy_content || 'Loading content...'}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPolicyPage;
