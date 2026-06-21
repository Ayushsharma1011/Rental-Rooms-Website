
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import WebsiteChatbot from '@/components/shared/WebsiteChatbot';
import CozywayAnimatedLogo from '@/components/shared/CozywayAnimatedLogo';
import HomePage from '@/pages/HomePage';
import RoomsPage from '@/pages/RoomsPage';
import GalleryPage from '@/pages/GalleryPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import OurJourneyPage from '@/pages/OurJourneyPage';
import WhyChooseUsPage from '@/pages/WhyChooseUsPage';
import NearbySpotsPage from '@/pages/NearbySpotsPage';
import AdminPage from '@/pages/AdminPage';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFoundPage from '@/pages/NotFoundPage';
import { DataProvider } from '@/contexts/DataContext';
import TestimonialsPage from "@/pages/TestimonialsPage";


function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [showSplash, setShowSplash] = React.useState(!isAdminRoute);
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    if (isAdminRoute) {
      setShowSplash(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [isAdminRoute]);

  React.useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  return (
    <div className={isAdminRoute ? 'dark' : ''}>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999]"
          >
            <CozywayAnimatedLogo />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
        <Helmet>
            <title>CozyWay | My Place My Space</title>
            <link rel="icon" type="image/jpeg" href="/logo.jpg" />
            <meta name="description" content="Cozy Way offers dharamshala room rent options with modern amenities and Himalayan views. Find room for rent dharamshala and room rent in dharamshala easily." />
            <meta name="keywords" content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala" />
        </Helmet>
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
              <Route path="/our-journey" element={<OurJourneyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/nearby-spots" element={<NearbySpotsPage />} />
              <Route path="/top-spots" element={<NearbySpotsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />

              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <WebsiteChatbot />
        <Toaster />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </Router>
  )
}

export default App;
