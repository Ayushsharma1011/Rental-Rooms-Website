import React from 'react';
import { Helmet } from 'react-helmet';
import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>404 - Page Not Found | Cozy Way</title>
        <meta
          name="description"
          content="Page not found for Cozy Way, a best homestay in Dharamshala with rooms in Dharamshala."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
        />
      </Helmet>
      <div className="container mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          <h1 className="text-9xl font-bold text-secondary font-serif">404</h1>
          <h2 className="text-4xl font-semibold text-white mt-4 mb-6">Page Not Found</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for seems to have taken a hike into the mountains.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full">
              Go Back Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
