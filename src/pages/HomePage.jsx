import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Loader2,
  Wifi,
  Shield,
  Utensils as CookingPot,
  Feather,
  Users,
  Bed,
  Wind,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  Send,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import PageTransition from '@/components/shared/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const IconWrapper = ({ name, ...props }) => {
  const icons = { Bed, Wifi, Wind, Sparkles, Users };
  const IconComponent = icons[name] || Sparkles;
  return <IconComponent {...props} />;
};

/* ========================= ROOM DETAIL MODAL ========================= */
const RoomDetailModal = ({ room, open, onOpenChange }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [room]);

  if (!room) return null;

  const images =
    room.images && room.images.length > 0
      ? room.images
      : [{ image_url: room.image_url, image_alt: room.image_alt }];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ Fully responsive Dialog */}
      <DialogContent
        className="
          w-[95vw] sm:w-[90vw] max-w-4xl 
          p-0 bg-card border-border/60
          max-h-[90vh] overflow-hidden
          rounded-3xl
        "
      >
        {/* ✅ Scrollable container inside modal */}
        <div className="relative max-h-[90vh] overflow-y-auto">
          
          {/* ✅ Close button ALWAYS visible */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* ✅ Image Section (Responsive Height) */}
            <div className="relative h-64 sm:h-72 md:h-full">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]?.image_url}
                  alt={images[currentImageIndex]?.image_alt || room.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                    onClick={prevImage}
                  >
                    <ChevronLeft />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                    onClick={nextImage}
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>

            {/* ✅ Content Section */}
            <div className="p-5 sm:p-7 md:p-8 flex flex-col">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-secondary mb-2">
                {room.name}
              </h2>

              <div
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white self-start mb-4 ${
                  room.availability === "Available"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {room.availability}
              </div>

              <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
                {room.description}
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm sm:text-base">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Capacity: {room.capacity || "N/A"} people</span>
                </div>

                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-secondary">
                      Amenities:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                        >
                          <IconWrapper
                            name={amenity.icon_name}
                            className="h-4 w-4 text-primary"
                          />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Bottom section responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-auto pt-5 border-t">
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{room.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /Month
                  </span>
                </p>

                <Button
                  onClick={() => {
                    const phoneNumber = "919816446709";
                    const message = `Hello Cozy Way! 👋%0A%0AI want to enquire about the availability of the room: *${room.name}* 🏨%0A%0ACan you please share availability + price details?`;
                    window.open(
                      `https://wa.me/${phoneNumber}?text=${message}`,
                      "_blank"
                    );
                    onOpenChange(false);
                  }}
                  className="soft-shadow hover:glow-shadow w-full sm:w-auto rounded-full bg-secondary text-secondary-foreground"
                >
                  Enquire on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ========================= ROOM CARD ========================= */
const RoomCard = ({ room, onReadMore }) => {
  return (
    <motion.div whileHover={{ y: -8 }} className="h-full w-full">
      <Card className="surface-card text-card-foreground overflow-hidden w-full h-full flex flex-col group">
        
        {/* ✅ Responsive Image */}
        <div className="relative h-52 sm:h-64 md:h-72 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={room.image_alt || room.name}
            src={
              room.image_url ||
              "https://images.unsplash.com/photo-1598928636135-d146006ff4be"
            }
          />

          {/* ✅ Availability Badge */}
          <div
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white backdrop-blur-sm ${
              room.availability === "Available"
                ? "bg-green-500/70"
                : "bg-red-500/70"
            }`}
          >
            {room.availability}
          </div>
        </div>

        <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
          
          {/* ✅ Responsive Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-secondary">
            {room.name}
          </h3>

          {/* ✅ Responsive Description */}
          <p className="text-muted-foreground mt-2 mb-4 text-xs sm:text-sm leading-relaxed flex-grow">
            {room.description?.substring(0, 110)}...
          </p>

          {/* ✅ Responsive Bottom Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-4 border-t">
            
            {/* ✅ Responsive Price */}
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              ₹{room.price}
              <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                {" "}
                /Month
              </span>
            </p>

            {/* ✅ Button responsive */}
            <Button
              onClick={() => onReadMore(room)}
              variant="outline"
              className="soft-shadow hover:glow-shadow w-full sm:w-auto rounded-full text-xs sm:text-sm py-2"
            >
              Read More
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ========================= HOME PAGE ========================= */
const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    rooms = [],
    galleryImages = [],
    testimonials = [],
    siteContent,
    loading,
  } = useData();

  const heroImages = [
    { url: '/ViewfromCozyWay.JPG.jpeg', alt: 'View from Cozy Way with mountains' },
    { url: '/Moon Peak.JPG.jpeg', alt: 'Moon Peak mountain landscape' },
    { url: '/DSCN1706.JPG.jpeg', alt: 'Cozy Way exterior and surroundings' },
    { url: '/DSCN1710.JPG.jpeg', alt: 'Property frontage at Cozy Way' },
    { url: '/DSCN1704.JPG.jpeg', alt: 'Open area and building view at Cozy Way' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, 6000);

  return () => clearInterval(interval);
}, []);


  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);

  const amenities = [
    {
      icon: <Wifi className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: 'High-Speed Wi-Fi',
      description: 'Stay connected for work, studies, or streaming.',
    },
    {
      icon: <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: '24/7 Security',
      description: 'Your safety is our priority with CCTV surveillance.',
    },
    {
      icon: <CookingPot className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: 'Attached Kitchenette',
      description: 'Enjoy the freedom to cook your favorite meals.',
    },
    {
      icon: <Feather className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: 'Fully Furnished',
      description: 'Comfortable beds, wardrobes, and modern fittings.',
    },
  ];

  const featuredRooms = rooms.slice(0, 3);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const gallerySettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const showcaseSlides = [
    { id: 'showcase-1', url: '/ViewfromCozyWay.JPG.jpeg', alt: 'View from Cozy Way with hills' },
    { id: 'showcase-2', url: '/DSCN1704.JPG.jpeg', alt: 'Building exterior at Cozy Way' },
    { id: 'showcase-3', url: '/DSCN1706.JPG.jpeg', alt: 'Property view from side angle' },
    { id: 'showcase-4', url: '/DSCN1710.JPG.jpeg', alt: 'Front side of the property' },
    { id: 'showcase-5', url: '/DSCN1725.JPG.jpeg', alt: 'Room corridor and clean interiors' },
    { id: 'showcase-6', url: '/Moon Peak.JPG.jpeg', alt: 'Nearby mountain view' },
    { id: 'showcase-7', url: '/Triund.JPG.jpeg', alt: 'Triund scenic view' },
  ];

  const approvedTestimonials = testimonials.filter((t) => t.status === 'approved');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    if (!approvedTestimonials.length) return;
    const timer = setTimeout(() => {
      setTestimonialIndex((prev) => (prev + 1) % approvedTestimonials.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [testimonialIndex, approvedTestimonials.length]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewName.trim() || !reviewText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please enter your name and review.',
      });
      return;
    }

    setReviewSubmitting(true);

    const { error } = await supabase.from('testimonials').insert([
      {
        name: reviewName.trim(),
        text: reviewText.trim(),
        status: 'pending',
      },
    ]);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: error.message,
      });
    } else {
      toast({
        title: '✅ Review submitted!',
        description: 'Thanks! Your review is pending admin approval.',
      });

      setReviewName('');
      setReviewText('');
      setShowReviewForm(false);
    }

    setReviewSubmitting(false);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>CozyWay | My Place My Space</title>
        <meta
          name="description"
          content="Cozy Way provides dharamshala room rent stays. Explore room for rent dharamshala options and room rent in dharamshala with comfort and mountain views."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
        />
      </Helmet>

     {/* HERO */}
     
<section
  ref={ref}
  className="
    relative
    h-[68vh] sm:h-[75vh]
    px-4 sm:px-6
    min-h-[500px] sm:min-h-[620px]
    pt-24 sm:pt-32
    text-white
    overflow-hidden
  "
>

<motion.div
  style={{ y }}
  className="absolute inset-0 overflow-hidden"
>
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      {/* Hero image */}
      <img
        src={heroImages[currentSlide].url}
        alt={heroImages[currentSlide].alt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Base alpine gradient tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a24]/70 via-[#2f3f35]/60 to-[#4b5c4a]/45" />

      {/* Soft warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />

      {/* Subtle ambient light */}
      <motion.div
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-radial from-white/12 via-transparent to-transparent"
      />

      {/* Fine grain texture */}
      <div className="absolute inset-0 grain-overlay" />
    </motion.div>
  </AnimatePresence>
</motion.div>


  <div className="relative h-full mx-auto flex max-w-5xl flex-col items-center justify-center text-center px-4 sm:px-8">
    <div className="pointer-events-none absolute -z-10 h-64 w-64 rounded-full bg-secondary/35 blur-3xl sm:h-80 sm:w-80" />
    <div className="pointer-events-none absolute -z-10 top-1/3 h-56 w-56 rounded-full bg-primary/35 blur-3xl sm:h-72 sm:w-72" />

    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-gradient-to-r from-white/25 via-white/10 to-white/25 px-5 py-2 text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(255,255,255,0.35)] backdrop-blur-md"
    >
      <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] animate-pulse" />
      Premium Stays In Dharamshala
    </motion.span>
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="
        text-3xl sm:text-5xl md:text-6xl
        font-extrabold font-display
        leading-tight
        mb-4
        drop-shadow-xl
      "
    >
      {loading ? (
        <Loader2 className="h-10 w-10 animate-spin mx-auto" />
      ) : (
        "Comfortable and Affordable Accommodations for Every Need"
      )}
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45 }}
      className="max-w-3xl text-sm sm:text-lg md:text-xl text-white/95 mb-3 sm:mb-4 text-shadow-lg"
    >
      Stay close to the mountains, connected to comfort, and surrounded by calm.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55 }}
      className="max-w-2xl text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] text-white/80 mb-7 sm:mb-9"
    >
      Your Cozy Corner In The Himalayas
    </motion.p>

    <Button
      size="lg"
      className="
        bg-secondary text-secondary-foreground
        rounded-full
        px-7 sm:px-9
        py-4
        text-base sm:text-lg
        hover:scale-105 hover:bg-secondary/90
        transition-transform shadow-[0_14px_45px_-12px_rgba(194,97,59,0.75)]
      "
      onClick={() => navigate("/rooms")}
    >
      Discover Our Rooms
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </div>
</section>

      {/* SHOWCASE CAROUSEL */}
      <section className="py-3 sm:py-6">
        <div className="container mx-auto px-4">
          <div className="section-frame px-4 sm:px-10 py-6 sm:py-10 showcase-slider">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-secondary/80">
                  Home Away From Home
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-secondary mt-3">
                  Rooms & Places, In Focus
                </h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-lg">
                A refined look at Cozy Way — serene rooms, warm interiors, and the
                beauty just outside your window.
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
              </div>
            ) : showcaseSlides.length > 0 ? (
              <Slider
                className="showcase-track"
                infinite
                speed={800}
                slidesToShow={3}
                slidesToScroll={1}
                centerMode={false}
                centerPadding="0%"
                autoplay
                autoplaySpeed={2400}
                arrows={false}
                dots={false}
                cssEase="cubic-bezier(0.22, 0.61, 0.36, 1)"
                pauseOnHover={false}
                responsive={[
                  { breakpoint: 1280, settings: { slidesToShow: 2 } },
                  { breakpoint: 900, settings: { slidesToShow: 1 } },
                ]}
              >
                {showcaseSlides.map((slide) => (
                  <div key={slide.id} className="px-2 sm:px-3">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 shadow-[0_35px_80px_-50px_rgba(0,0,0,0.55)]">
                      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
                      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
                      <div className="relative w-full aspect-[4/5]">
                        <img
                          src={slide.url}
                          alt={slide.alt}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Showcase images not available right now.
              </p>
            )}
            </div>
          </div>
        </div>
      </section>


      {/* AMENITIES */}
      <section className="py-2 sm:py-4 lg:py-6">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 sm:px-10 py-10 sm:py-12">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold font-display">
              Comforts of Home, Elevated
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4">
                We've thoughtfully curated every detail to ensure your stay is
                nothing short of perfect.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
              {amenities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group glassy-amenity flex items-start gap-4"
                >
                  <div className="p-3 bg-white/70 rounded-2xl shadow-inner ring-1 ring-white/60 backdrop-blur-md">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-secondary font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-3 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 sm:px-10 py-10 sm:py-12">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-secondary">
              Featured Rooms
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4">
                Feel at home in the heart of Dharamshala.
              </p>
            </div>

          {loading ? (
            <div className="flex justify-center pt-8">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
            </div>
          ) : featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-10">
              {featuredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex"
                >
                  <RoomCard room={room} onReadMore={setSelectedRoom} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No rooms available right now.
            </p>
          )}

            <div className="flex justify-center mt-12 sm:mt-14">
              <Button
                onClick={() => navigate('/rooms')}
                className="bg-foreground text-background rounded-full px-7 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                View All Rooms <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* GLIMPSES OF PARADISE */}
      <section className="py-3 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 sm:px-10 py-10 sm:py-12">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-secondary">
              Explore our Spaces
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4">
                From cozy rooms to stunning mountain view's
              </p>
            </div>

          {loading ? (
            <div className="flex justify-center pt-8">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
            </div>
          ) : galleryImages.length > 0 ? (
            <>
              <Slider {...gallerySettings}>
                {galleryImages.map((img) => (
                  <div key={img.id} className="px-2 sm:px-3">
                    <div className="overflow-hidden rounded-2xl h-56 sm:h-72 group cursor-pointer shadow-lg">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                ))}
              </Slider>

              <div className="flex justify-center mt-12 sm:mt-14">
                <Button
                  onClick={() => navigate('/gallery')}
                  size="lg"
                  className="bg-secondary text-secondary-foreground rounded-full px-7 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  View Full Gallery <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              Gallery images not available right now.
            </p>
          )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-3 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="section-frame px-6 sm:px-10 py-10 sm:py-12">
            <h2 className="text-2xl sm:text-4xl font-bold font-display mb-3 sm:mb-4 text-secondary">
              What Our Guests Say
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mb-10 sm:mb-12">
              Authentic reviews from those who stayed with us in review section
            </p>

          {loading ? (
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
          ) : approvedTestimonials.length > 0 ? (
            <div className="relative max-w-2xl mx-auto min-h-[15rem] sm:min-h-[16rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-4"
                >
                  <img
                    src={
                      approvedTestimonials[testimonialIndex].avatar_url ||
                      `https://avatar.vercel.sh/${approvedTestimonials[testimonialIndex].name}.png`
                    }
                    alt={approvedTestimonials[testimonialIndex].name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 border-4 border-white shadow-lg"
                  />

                  <p className="text-sm sm:text-lg italic text-foreground/80 mb-4">
                    “{approvedTestimonials[testimonialIndex].text}”
                  </p>

                  <p className="font-bold text-secondary text-sm sm:text-base">
                    {approvedTestimonials[testimonialIndex].name}
                  </p>

                  <div className="flex text-primary mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No reviews yet. Be the first one to leave a review ✨
            </p>
          )}

            <div className="flex justify-center mt-12 sm:mt-14">
              <Button
                onClick={() => setShowReviewForm(true)}
                size="lg"
                className="bg-foreground text-background rounded-full px-7 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Leave a Review <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION MAP */}
      <section className="py-3 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 sm:px-10 py-10 sm:py-12">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-secondary">
                Find Cozy Way
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4">
                CozyWay, Gokhle Marg, Depot-Bazar Rd, Dharamshala, Himachal Pradesh 176215
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.5)]">
              <div className="w-full h-[320px] sm:h-[420px]">
                <iframe
                  title="Cozy Way Location Map"
                  src="https://www.google.com/maps?q=CozyWay%2C%20Gokhle%20Marg%2C%20Depot-Bazar%20Rd%2C%20Dharamshala%2C%20Himachal%20Pradesh%20176215&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <a
                href="https://www.google.com/maps/search/?api=1&query=CozyWay%2C%20Gokhle%20Marg%2C%20Depot-Bazar%20Rd%2C%20Dharamshala%2C%20Himachal%20Pradesh%20176215"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground px-7 sm:px-10 py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEW FORM POPUP */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="glass-card shadow-2xl">
                <CardContent className="p-5 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-secondary">
                      Leave a Review
                    </h3>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowReviewForm(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div>
                      <Label htmlFor="reviewName">Your Name</Label>
                      <Input
                        id="reviewName"
                        placeholder="e.g., Ayush Sharma"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        disabled={reviewSubmitting}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="reviewText">Your Review</Label>
                      <Textarea
                        id="reviewText"
                        rows={4}
                        placeholder="Write your experience..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        disabled={reviewSubmitting}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setShowReviewForm(false)}
                        disabled={reviewSubmitting}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        className="rounded-full soft-shadow hover:glow-shadow"
                        disabled={reviewSubmitting}
                      >
                        {reviewSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3">
                      ✅ Your review will appear after admin approval.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ROOM MODAL */}
      <RoomDetailModal
        room={selectedRoom}
        open={!!selectedRoom}
        onOpenChange={() => setSelectedRoom(null)}
      />
    </PageTransition>
  );
};

export default HomePage;
