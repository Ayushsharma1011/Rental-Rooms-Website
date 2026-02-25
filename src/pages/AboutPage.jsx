
import React from 'react';
import { Helmet } from 'react-helmet';
import PageTransition from '@/components/shared/PageTransition';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Loader2 } from 'lucide-react';

const AboutPage = () => {
  const { siteContent, loading } = useData();

  return (
    <PageTransition>
      <Helmet>
        <title>About Cozy Way | Dharamshala Rental Rooms</title>
        <meta
          name="description"
          content="Learn about Cozy Way, a Dharamshala rental rooms stay offering warm Himalayan hospitality."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, rooms in dharamshala, dharamshala rental rooms, stay in dharamshala, dharamshala rooms, cozy way dharamshala, rooms in dharmashala"
        />
      </Helmet>
      
      <div className="relative bg-accent pt-28 sm:pt-32 pb-12 sm:pb-16">
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 text-center"
        >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-secondary mb-3 sm:mb-4">
              About Cozy Way
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover our passion for hospitality and the story that started it all.
            </p>
        </motion.div>
      </div>

      <div className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7 }}
            >
                <img
                  alt="Scenic view of Dharamshala mountains"
                  className="rounded-3xl shadow-xl w-full h-auto object-cover"
                  src="https://images.unsplash.com/photo-1639809959651-9c6138ca06e0"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <div className="surface-card rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
                  {loading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                      <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                          {siteContent.about_page_content || 'Loading content...'}
                      </p>
                  )}
                </div>
            </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
