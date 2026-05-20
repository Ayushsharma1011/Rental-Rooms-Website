import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Camera,
  CheckCircle2,
  MapPin,
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
import { getYouTubeEmbedUrl } from '@/lib/siteContent';

import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const IconWrapper = ({ name, ...props }) => {
  const icons = { Bed, Wifi, Wind, Sparkles, Users };
  const IconComponent = icons[name] || Sparkles;
  return <IconComponent {...props} />;
};

const REVIEW_PREVIEW_LIMIT = 320;

const getReviewPreview = (value = '') => {
  const normalized = `${value}`.replace(/\s+/g, ' ').trim();
  if (normalized.length <= REVIEW_PREVIEW_LIMIT) return normalized;
  return `${normalized.slice(0, REVIEW_PREVIEW_LIMIT).trim()}...`;
};

/* ========================= ROOM DETAIL MODAL ========================= */
const RoomDetailModal = ({ room, open, onOpenChange }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    setShowAllAmenities(false);
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

  const visibleAmenities = showAllAmenities
    ? room.amenities || []
    : (room.amenities || []).slice(0, 4);
  const capacityValue = `${room.capacity || "N/A"}`
    .replace(/adults?/gi, "")
    .trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ Fully responsive Dialog */}
      <DialogContent
        className="
          w-[97vw] sm:w-[94vw] max-w-6xl
          p-0 overflow-hidden
          max-h-[92vh]
          rounded-[2rem]
          border border-border/60
          bg-gradient-to-br from-background via-background to-muted/40
          shadow-[0_30px_120px_-40px_rgba(0,0,0,0.45)]
        "
      >
        {/* ✅ Scrollable container inside modal */}
        <div className="relative max-h-[92vh] overflow-y-auto">
          
          {/* ✅ Close button ALWAYS visible */}

          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.2fr]">
            
            {/* ✅ Image Section (Responsive Height) */}
            <div className="relative h-72 sm:h-80 xl:min-h-[760px]">
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

              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

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
            <div className="flex flex-col p-5 sm:p-7 lg:p-10">
              <h2 className="mb-3 text-2xl font-bold leading-tight text-secondary sm:text-3xl lg:text-4xl font-display">
                {room.name}
              </h2>

              <div
                className={`mb-4 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white ${
                  room.availability === "Available"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {room.availability}
              </div>

              <p className="max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base">
                {room.description}
              </p>

              <div className="space-y-6 mb-6">
                <div className="rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm sm:p-5">
                  <div className="flex items-center gap-3 text-sm sm:text-base">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Capacity
                      </p>
                    <p className="text-base font-semibold text-foreground sm:text-lg">
                      {capacityValue} Adults
                    </p>
                    </div>
                  </div>
                </div>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="rounded-3xl border border-border/60 bg-muted/30 p-4 sm:p-6">
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary/90">
                      Amenities
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {visibleAmenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/85 px-4 py-3.5 shadow-sm"
                        >
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <IconWrapper
                              name={amenity.icon_name}
                              className="h-4 w-4"
                            />
                          </div>
                          <span className="text-sm leading-7 text-foreground/85 sm:text-[15px]">
                            {amenity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    {room.amenities.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllAmenities((prev) => !prev)}
                        className="mt-4 text-sm font-semibold text-secondary transition-colors hover:text-secondary/80"
                      >
                        {showAllAmenities ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ Bottom section responsive */}
              <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Monthly Rent
                  </p>
                  <p className="text-3xl font-bold sm:text-4xl">
                  ₹{room.price}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    /Month
                  </span>
                  </p>
                </div>

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
                  className="soft-shadow hover:glow-shadow h-12 w-full rounded-full bg-secondary px-6 text-secondary-foreground sm:w-auto"
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
  const heroTitle =
    siteContent?.hero_title || 'Comfortable and Affordable Accommodations for Every Need';
  const heroSubtitle =
    siteContent?.hero_subtitle ||
    'Stay close to the mountains, connected to comfort, and surrounded by calm.';
  const youtubeSectionTitle =
    siteContent?.youtube_channel_title || 'Watch Cozy Way On YouTube';
  const youtubeSectionDescription =
    siteContent?.youtube_channel_description ||
    'Room tours, local highlights, and stay updates will appear here once your YouTube link is added.';
  const youtubeEmbedUrl = getYouTubeEmbedUrl(siteContent?.youtube_channel_embed_url);
  const whyChooseLabel = siteContent?.why_choose_label || 'Why Choose Us';
  const whyChooseTitle =
    siteContent?.why_choose_title ||
    'A stay shaped around safety, comfort, and a real sense of belonging.';
  const whyChooseDescription =
    siteContent?.why_choose_description ||
    'Cozy Way is built for guests who want more than a room. Our journey brings together peaceful surroundings, practical amenities, and thoughtful care for students, working women, and travelers in Dharamshala.';
  const whyChoosePoints = `${siteContent?.why_choose_points || ''}`
    .split(/\r?\n/)
    .map((point) => point.trim())
    .filter(Boolean);
  const whyChooseVisiblePoints = whyChoosePoints.length
    ? whyChoosePoints
    : ['Safe managed stay', 'Peaceful mountain setting', 'Comfort for daily living'];
  const whyChooseButtonText = 'Explore Why Choose Us';
  const whyChooseImageLabel = siteContent?.why_choose_image_label || 'See The Story';
  const whyChooseImageTitle =
    siteContent?.why_choose_image_title || 'From a need to a welcoming space';

  const heroImages = [
    { url: '/optimized/ViewfromCozyWay.JPG.webp', alt: 'View from Cozy Way with mountains' },
    { url: '/optimized/Moon Peak.JPG.webp', alt: 'Moon Peak mountain landscape' },
    { url: '/optimized/DSCN1706.JPG.webp', alt: 'Cozy Way exterior and surroundings' },
    { url: '/optimized/DSCN1710.JPG.webp', alt: 'Property frontage at Cozy Way' },
    { url: '/optimized/DSCN1704.JPG.webp', alt: 'Open area and building view at Cozy Way' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeShowcaseSlide, setActiveShowcaseSlide] = useState(0);
  const [activeGallerySlide, setActiveGallerySlide] = useState(0);
  const mapContainerRef = useRef(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (shouldLoadMap) return undefined;
    const target = mapContainerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldLoadMap(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoadMap]);


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
  const whyChooseImage =
    galleryImages.find(
      (image) => String(image.category || '').toLowerCase() === 'why-choose-us'
    ) || null;

  const gallerySettings = {
    dots: !isMobileView,
    infinite: galleryImages.length > 1,
    speed: 600,
    slidesToShow: isMobileView ? 1 : Math.min(galleryImages.length, 3) || 1,
    slidesToScroll: 1,
    autoplay: galleryImages.length > 1,
    autoplaySpeed: 3000,
    arrows: !isMobileView,
    pauseOnHover: true,
    pauseOnFocus: true,
    beforeChange: (_, next) => setActiveGallerySlide(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(galleryImages.length, 2) || 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  const showcaseSlides = useMemo(() => {
    const showcaseGalleryImages = galleryImages.filter((image) =>
      ['showcase', 'home-showcase', 'homepage-showcase'].includes(
        String(image.category || '').toLowerCase()
      )
    );

    if (showcaseGalleryImages.length > 0) {
      return showcaseGalleryImages.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt || 'Cozy Way showcase image',
      }));
    }

    return [
      { id: 'showcase-1', url: '/optimized/ViewfromCozyWay.JPG.webp', alt: 'View from Cozy Way with hills' },
      { id: 'showcase-2', url: '/optimized/DSCN1704.JPG.webp', alt: 'Building exterior at Cozy Way' },
      { id: 'showcase-3', url: '/optimized/DSCN1706.JPG.webp', alt: 'Property view from side angle' },
      { id: 'showcase-4', url: '/optimized/DSCN1710.JPG.webp', alt: 'Front side of the property' },
      { id: 'showcase-5', url: '/optimized/DSCN1725.JPG.webp', alt: 'Room corridor and clean interiors' },
      { id: 'showcase-6', url: '/optimized/Moon Peak.JPG.webp', alt: 'Nearby mountain view' },
      { id: 'showcase-7', url: '/optimized/Triund.JPG.webp', alt: 'Triund scenic view' },
    ];
  }, [galleryImages]);

  const showcaseSettings = {
    infinite: true,
    speed: 900,
    slidesToShow: isMobileView ? 1 : Math.min(showcaseSlides.length, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2600,
    arrows: false,
    dots: !isMobileView,
    cssEase: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    pauseOnHover: true,
    pauseOnFocus: true,
    adaptiveHeight: false,
    beforeChange: (_, next) => setActiveShowcaseSlide(next),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(showcaseSlides.length, 2) } },
      { breakpoint: 900, settings: { slidesToShow: 1, dots: false } },
    ],
  };

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

      {/* ===================== HERO ===================== */}
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
        fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
        decoding="async"
      />

      {/* ✅ UPDATED: Alpine base gradient — reduced opacity so mountain shows through brighter */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a24]/40 via-[#2f3f35]/30 to-[#4b5c4a]/20" />

      {/* ✅ UPDATED: Warm vertical overlay — reduced from /80 /45 /20 to /50 /20 /5 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/5" />

      {/* ✅ UPDATED: Ambient light pulse — increased brightness from [0.15,0.25,0.15] to [0.25,0.45,0.25] */}
      <motion.div
        animate={{ opacity: [0.25, 0.45, 0.25] }}
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
        heroTitle
      )}
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45 }}
      className="max-w-3xl text-sm sm:text-lg md:text-xl text-white/95 mb-3 sm:mb-4 text-shadow-lg"
    >
      {heroSubtitle}
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
      <section className="py-2 sm:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame px-4 py-6 showcase-slider sm:px-10 sm:py-8">
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
              <>
                <Slider className="showcase-track" {...showcaseSettings}>
                  {showcaseSlides.map((slide) => (
                    <div key={slide.id} className="showcase-slide px-2 sm:px-3">
                      <div className="showcase-card relative h-[17.5rem] sm:h-[26rem] lg:h-[30rem] overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] border border-white/60 bg-white/70 shadow-[0_35px_80px_-50px_rgba(0,0,0,0.55)]">
                        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
                        <div className="relative h-full w-full">
                          <img
                            src={slide.url}
                            alt={slide.alt}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
                      </div>
                    </div>
                  ))}
                </Slider>
                {isMobileView && showcaseSlides.length > 1 && (
                  <div className="mt-4 flex justify-center">
                    <div className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-secondary shadow-sm">
                      {activeShowcaseSlide + 1} / {showcaseSlides.length}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Showcase images not available right now.
              </p>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame overflow-hidden px-6 py-8 ring-2 ring-secondary/15 sm:px-10 sm:py-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.35em] text-secondary sm:text-base">
                  {whyChooseLabel}
                </p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight text-secondary sm:text-5xl font-display">
                  {whyChooseTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-muted-foreground sm:text-lg">
                  {whyChooseDescription}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {whyChooseVisiblePoints.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-sm font-semibold text-secondary shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate('/why-choose-us')}
                  className="mt-8 rounded-full bg-secondary px-8 py-7 text-lg font-extrabold text-secondary-foreground shadow-[0_18px_45px_-18px_rgba(194,97,59,0.9)] transition-all duration-300 hover:scale-105 hover:bg-secondary/90"
                >
                  {whyChooseButtonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <button
                type="button"
                onClick={() => navigate('/why-choose-us')}
                className="group relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-white/60 bg-foreground text-left shadow-[0_35px_90px_-55px_rgba(0,0,0,0.65)] sm:min-h-[28rem]"
              >
                <img
                  src={whyChooseImage?.url || '/optimized/DSCN1706.JPG.webp'}
                  alt={whyChooseImage?.alt || 'Cozy Way building and surroundings'}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                    {whyChooseImageLabel}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold font-display sm:text-3xl">
                    {whyChooseImageTitle}
                  </h3>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* AMENITIES */}
      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 py-8 sm:px-10 sm:py-10">
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
      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 py-8 sm:px-10 sm:py-10">
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

      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-secondary/80">
                  YouTube Channel
                </p>
                <h2 className="mt-3 text-2xl font-bold text-secondary sm:text-4xl font-display">
                  {youtubeSectionTitle}
                </h2>
                <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
                  {youtubeSectionDescription}
                </p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-3 shadow-[0_28px_70px_-45px_rgba(0,0,0,0.45)] backdrop-blur">
                <div className="aspect-video overflow-hidden rounded-[1.5rem] bg-foreground/95">
                  {youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Cozy Way YouTube channel"
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
                      <p className="text-lg font-semibold font-display sm:text-2xl">
                        YouTube showcase coming soon
                      </p>
                      <p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">
                        Add a YouTube link from the admin panel to display your room tours and
                        channel videos here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GLIMPSES OF PARADISE */}
      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-secondary">
              Explore our Spaces
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4">
                From cozy rooms to stunning mountain views
              </p>
            </div>

          {loading ? (
            <div className="flex justify-center pt-8">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
            </div>
          ) : galleryImages.length > 0 ? (
            <>
              <Slider className="home-gallery-slider" {...gallerySettings}>
                {galleryImages.map((img) => (
                  <div key={img.id} className="px-2 sm:px-3">
                    <div className="home-gallery-card overflow-hidden rounded-[1.4rem] sm:rounded-2xl h-64 sm:h-72 group cursor-pointer shadow-lg">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                ))}
              </Slider>

              {isMobileView && galleryImages.length > 1 && (
                <div className="mt-4 flex justify-center">
                  <div className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-secondary shadow-sm">
                    {activeGallerySlide + 1} / {galleryImages.length}
                  </div>
                </div>
              )}

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
      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4 text-center">
          <div className="section-frame px-6 py-8 sm:px-10 sm:py-10">
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
                    loading="lazy"
                    decoding="async"
                  />

                  <p className="mb-4 max-h-36 max-w-full overflow-hidden break-words px-1 text-sm italic leading-7 text-foreground/80 sm:max-h-44 sm:text-lg">
                    "{getReviewPreview(approvedTestimonials[testimonialIndex].text)}"
                  </p>

                  <p className="max-w-full break-words font-bold text-secondary text-sm sm:text-base">
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
      <section className="py-2 sm:py-3 lg:py-3">
        <div className="container mx-auto px-4">
          <div className="section-frame px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold font-display text-secondary">
                Find Cozy Way
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground mt-3 sm:mt-4">
                CozyWay, Gokhle Marg, Depot-Bazar Rd, Dharamshala, Himachal Pradesh 176215
              </p>
            </div>

            <div
              ref={mapContainerRef}
              className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.5)]"
            >
              <div className="w-full h-[320px] sm:h-[420px]">
                {shouldLoadMap ? (
                  <iframe
                    title="Cozy Way Location Map"
                    src="https://www.google.com/maps?q=CozyWay%2C%20Gokhle%20Marg%2C%20Depot-Bazar%20Rd%2C%20Dharamshala%2C%20Himachal%20Pradesh%20176215&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-foreground/90 px-6 text-center text-white">
                    <div>
                      <MapPin className="mx-auto h-10 w-10 text-secondary" />
                      <p className="mt-3 text-lg font-semibold font-display">Map loading when needed</p>
                    </div>
                  </div>
                )}
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
