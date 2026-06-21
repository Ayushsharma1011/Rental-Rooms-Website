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
  heroImage = '/logo1234.jpeg',
  heroImageAlt = 'Cozy Way mountain stay visual',
  heroHighlights = [],
  aside = null,
  children = null,
}) => (
  <PageTransition>
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
    </Helmet>

    <section className="relative isolate overflow-hidden bg-[#151c18] pt-28 pb-12 text-white sm:pt-32 sm:pb-16 lg:pb-20">
      <img
        src={heroImage}
        alt={heroImageAlt}
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45 blur-sm scale-105"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,17,15,0.92)_0%,rgba(13,17,15,0.72)_46%,rgba(13,17,15,0.38)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
      <div className="absolute inset-0 -z-10 grain-overlay" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">{heroLabel}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl font-display">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
                {subtitle}
              </p>
            ) : null}

            {heroHighlights.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {heroHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <span
                      key={highlight.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:text-sm"
                    >
                      {Icon ? <Icon className="h-4 w-4 text-[#ffd166]" /> : null}
                      {highlight.label}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/20 bg-black/20 p-2 shadow-[0_30px_100px_-45px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="aspect-[16/9] w-full rounded-[1.5rem] object-contain"
              decoding="async"
            />
          </div>
        </div>
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
