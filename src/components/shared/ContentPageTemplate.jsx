import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import RichTextRenderer from '@/components/shared/RichTextRenderer';

const ContentPageTemplate = ({
  title,
  subtitle,
  metaTitle,
  metaDescription,
  content,
  loading = false,
  heroLabel = 'Cozy Way',
  aside = null,
  children = null,
}) => (
  <PageTransition>
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
    </Helmet>

    <section className="relative bg-accent pt-28 pb-12 sm:pt-32 sm:pb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 text-center"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-secondary/70">{heroLabel}</p>
        <h1 className="mt-4 text-3xl font-bold text-secondary sm:text-4xl md:text-5xl font-display">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </motion.div>
    </section>

    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className={`grid gap-8 lg:gap-10 ${aside ? 'lg:grid-cols-[1.4fr_0.8fr]' : ''}`}>
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="surface-card rounded-[2rem] p-6 shadow-2xl sm:p-8 md:p-10"
          >
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <RichTextRenderer content={content} demoteH1 />
            )}
          </motion.article>

          {aside ? (
            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5"
            >
              {aside}
            </motion.aside>
          ) : null}
        </div>

        {children ? <div className="mt-12 sm:mt-14">{children}</div> : null}
      </div>
    </section>
  </PageTransition>
);

export default ContentPageTemplate;
