import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  MessageCircle,
  ArrowRight,
  Clock,
  Headphones,
} from "lucide-react";

import ContentPageTemplate from "@/components/shared/ContentPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";
import { useData } from "@/contexts/DataContext";
import { getMetaValue, getStructuredContent } from "@/lib/siteContent";

const ContactPage = () => {
  const { toast } = useToast();
  const { siteContent, loading: contentLoading } = useData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  const WHATSAPP_NUMBER = "919816446709";
  const DIRECT_EMAIL = "cozywayin@gmail.com";

  const carouselImages = [
    "/optimized/gallery10.webp",
    "/optimized/gallery11.webp",
    "/optimized/gallery12.webp",
    "/optimized/gallery16.webp",
    "/optimized/gallery9.webp",
    "/optimized/gallery3.webp",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3500);

    return () => clearTimeout(timer);
  }, [slide, carouselImages.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert([
      {
        name,
        email,
        phone,
        message,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Message not sent",
        description: "There was a problem sending your message. Please try again.",
      });
    } else {
      toast({
        title: "Message sent",
        description: "Thanks for reaching out. We will get back to you soon.",
      });
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }

    setLoading(false);
  };

  const handleWhatsApp = () => {
    const finalMessage = `Hello Cozy Way!

My Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Message:
${message || "N/A"}

Please contact me back. Thanks!`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    const subject = `Cozy Way Enquiry - ${name || "Guest"}`;
    const body = `Hello Cozy Way,

My Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Message:
${message || "N/A"}

Regards,
${name || "Guest"}`;

    window.location.href = `mailto:${DIRECT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const aside = (
    <>
      <div className="surface-card overflow-hidden rounded-[2rem] border border-white/40 bg-white/40 shadow-2xl backdrop-blur">
        <div className="relative h-[260px] sm:h-[320px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide}
              src={carouselImages[slide]}
              alt="Cozy Way contact preview"
              initial={{ opacity: 0.3, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-2xl font-bold font-display">Cozy Way, Dharamshala</p>
            <p className="mt-1 text-sm text-white/80">
              Your peaceful stay in the mountains.
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-[2rem] p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-bold font-display text-secondary">Direct Contact</h2>
        <div className="mt-5 space-y-4 text-sm text-muted-foreground sm:text-base">
          <div className="flex items-center gap-3">
            <Mail className="text-primary" />
            <span>{DIRECT_EMAIL}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-primary" />
            <span>+91 98164 46709</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 text-primary" />
            <span>Dharamshala, Himachal Pradesh, India</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ContentPageTemplate
      title="Contact Cozy Way"
      subtitle="Reach out for room availability, amenities, long-stay details, or booking help."
      metaTitle={getMetaValue(siteContent, "contact_page_meta_title")}
      metaDescription={getMetaValue(siteContent, "contact_page_meta_description")}
      content={getStructuredContent(siteContent, "contact_page_content", { demoteH1: true })}
      loading={contentLoading}
      heroLabel="Contact"
      heroImage="/logo1234.jpeg"
      heroImageAlt="Cozy Way logo and warm contact ambience"
      heroHighlights={[
        { label: "Fast WhatsApp Replies", icon: MessageCircle },
        { label: "Direct Booking Help", icon: Headphones },
        { label: "Open For Enquiries", icon: Clock },
      ]}
      aside={aside}
    >
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="surface-card rounded-[2rem] p-6 shadow-2xl sm:p-8 md:p-10"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-display text-secondary sm:text-3xl">
            Send a Message
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            We usually reply within a few hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 rounded-2xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98164 46709"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 rounded-2xl"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-sm">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Write your message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              rows={5}
              className="mt-2 rounded-2xl"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-secondary text-lg font-semibold text-secondary-foreground shadow-lg transition-all hover:scale-[1.01] hover:shadow-2xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <Button
              type="button"
              onClick={handleWhatsApp}
              className="rounded-full bg-[#1fa855] font-semibold text-white hover:bg-[#1b924b]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
            <Button
              type="button"
              onClick={handleEmail}
              className="rounded-full bg-[#2f5d50] font-semibold text-white hover:bg-[#294f44]"
            >
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Button>
            <Button
              type="button"
              onClick={() => (window.location.href = "tel:+919816446709")}
              className="rounded-full bg-secondary font-semibold text-secondary-foreground"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can still contact Cozy Way directly by WhatsApp, email, or phone even before filling the full form.
          </p>
        </form>
      </motion.section>
    </ContentPageTemplate>
  );
};

export default ContactPage;
