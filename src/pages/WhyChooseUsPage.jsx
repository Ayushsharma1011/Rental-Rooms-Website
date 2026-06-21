import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Home,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react';

import ContentPageTemplate from '@/components/shared/ContentPageTemplate';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

const fallbackPoints = [
  'Safe managed stay',
  'Peaceful mountain setting',
  'Comfort for daily living',
];

const reasonCards = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    text: 'A managed environment with practical care, clear communication, and everyday peace of mind.',
  },
  {
    icon: Home,
    title: 'Ready To Live',
    text: 'Rooms and facilities planned for students, working women, professionals, and long-stay guests.',
  },
  {
    icon: MapPinned,
    title: 'Connected Location',
    text: 'Close to Dharamshala essentials while still keeping the relaxed feeling of a mountain stay.',
  },
  {
    icon: HeartHandshake,
    title: 'Helpful Support',
    text: 'Responsive help for enquiries, room details, availability, and stay-related questions.',
  },
  {
    icon: Wifi,
    title: 'Daily Convenience',
    text: 'Facilities that make studying, working, cooking, and settling in feel simpler.',
  },
  {
    icon: Sparkles,
    title: 'A Real Sense Of Belonging',
    text: 'A stay experience shaped around the promise of having your own place and your own space.',
  },
];

const trustStats = [
  { value: '24/7', label: 'Stay support mindset', icon: Clock },
  { value: 'Safe', label: 'Managed living focus', icon: ShieldCheck },
  { value: 'Easy', label: 'WhatsApp enquiries', icon: MessageCircle },
];

const WhyChooseUsPage = () => {
  const { siteContent, galleryImages = [], loading } = useData();

  const title =
    siteContent?.why_choose_title ||
    'A stay shaped around safety, comfort, and a real sense of belonging.';
  const description =
    siteContent?.why_choose_description ||
    'Cozy Way is built for guests who want more than a room. Our journey brings together peaceful surroundings, practical amenities, and thoughtful care for students, working women, and travelers in Dharamshala.';
  const points = `${siteContent?.why_choose_points || ''}`
    .split(/\r?\n/)
    .map((point) => point.trim())
    .filter(Boolean);
  const visiblePoints = points.length ? points : fallbackPoints;
  const whyChooseImage =
    galleryImages.find(
      (image) => String(image.category || '').toLowerCase() === 'why-choose-us'
    ) || null;

  const content = `
    <h2>Why Guests Choose Cozy Way</h2>
    <p>${description}</p>
    <h2>What Makes The Stay Better</h2>
    <ul>
      ${visiblePoints.map((point) => `<li>${point}</li>`).join('')}
    </ul>
  `;

  return (
    <ContentPageTemplate
      title="Why Choose Us"
      subtitle={description}
      metaTitle="Why Choose Us | Cozy Way Dharamshala"
      metaDescription="Learn why Cozy Way is a comfortable, safe, and convenient stay option in Dharamshala."
      content={content}
      loading={loading}
      heroLabel="Why Cozy Way"
      heroImage="/logo1234.jpeg"
      heroImageAlt="Cozy Way logo with warm mountain ambience"
      heroHighlights={[
        { label: 'Safe Managed Stay', icon: ShieldCheck },
        { label: 'Comfort For Daily Living', icon: Home },
        { label: 'My Place My Space', icon: Sparkles },
      ]}
      aside={
        <div className="space-y-5">
          <div className="surface-card overflow-hidden shadow-xl">
            <div className="relative h-80">
              <img
                src={whyChooseImage?.url || '/optimized/DSCN1706.JPG.webp'}
                alt={whyChooseImage?.alt || 'Cozy Way building and surroundings'}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                  Stay Confidence
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight font-display">
                  See the comfort before you arrive
                </h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm leading-7 text-muted-foreground">
                Cozy Way helps guests feel informed before booking, supported during enquiries, and comfortable after arrival.
              </p>
            </div>
          </div>

          <div className="surface-card p-5 shadow-xl">
            <div className="space-y-3">
              {trustStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-background/70 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-secondary">{item.value}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <section className="relative overflow-hidden rounded-[2rem] bg-[#17231f] p-6 text-white shadow-[0_30px_90px_-60px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/logo1234.jpeg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#17231f] via-[#17231f]/92 to-[#17231f]/70" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ffd166]">
              Why It Works
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl font-display">
              More than a room, it is a dependable living experience.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
              Cozy Way is designed for people who need comfort, safety, location, and support to come together in one simple stay decision.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {visiblePoints.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffd166]" />
                <span className="text-sm font-semibold text-white/90">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reasonCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group surface-card relative overflow-hidden p-6 shadow-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute right-5 top-5 text-5xl font-black text-secondary/10">
                0{index + 1}
              </div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-secondary font-display">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[20rem]">
            <img
              src="/logo1234.jpeg"
              alt="Cozy Way logo"
              className="absolute inset-0 h-full w-full object-contain bg-[#071820] p-4"
            />
          </div>
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              Next Step
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-secondary sm:text-4xl font-display">
              Understand the reason, then read the story behind it.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              The Why Choose Us page gives visitors clear confidence. The Our Journey page gives them the emotional story behind Cozy Way.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-secondary px-6 text-secondary-foreground">
                <Link to="/our-journey">
                  Read Our Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link to="/contact">Contact Cozy Way</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ContentPageTemplate>
  );
};

export default WhyChooseUsPage;
