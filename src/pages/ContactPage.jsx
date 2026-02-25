import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";

const ContactPage = () => {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const WHATSAPP_NUMBER = "919816446709";
  const DIRECT_EMAIL = "cozywayin@gmail.com";

  /* ✅ RIGHT SIDE CAROUSEL IMAGES */
  const carouselImages = [
    "/gallery10.png",
    "/gallery11.png",
    "/gallery12.png",
    "/gallery16.png",
    "/gallery9.png",
    "/gallery3.png",
  ];

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearTimeout(t);
  }, [slide, carouselImages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message. Please try again.",
      });
    } else {
      toast({
        title: "Message Sent! ✨",
        description: "Thanks for reaching out! We'll get back to you soon.",
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }

    setLoading(false);
  };

  const handleWhatsApp = () => {
    const finalMessage = `Hello Cozy Way! 👋

My Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Message:
${message || "N/A"}

Please contact me back. Thanks! 😊`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      finalMessage
    )}`;
    window.open(url, "_blank");
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

  const handleCall = () => {
    window.location.href = `tel:+919816446709`;
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Contact Cozy Way | Rooms in Dharamshala</title>
        <meta
          name="description"
          content="Contact Cozy Way, a best homestay in Dharamshala, to book rooms in Dharamshala or ask about availability."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
        />
      </Helmet>

      {/* ✅ TOP HERO */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-frame px-6 sm:px-10 py-12 sm:py-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f2a24] via-[#2f3f35] to-[#4b5c4a] opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 grain-overlay" />
            </div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/70">
              Contact Us
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-display text-white tracking-wide mt-4">
              Let’s Talk
            </h1>

            <p className="text-white/80 mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Have questions or want to book your stay? Send us a message or contact
              directly on WhatsApp & Email.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ✅ MAIN CONTENT */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* ✅ LEFT: FORM */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="surface-card p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold font-display text-secondary mb-2">
                  Send a Message
                </h2>
                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                  We usually reply within a few hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98164 46709"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-2xl"
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
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="rounded-2xl"
                    />
                  </div>

                  {/* ✅ SEND MESSAGE */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full text-lg font-semibold bg-secondary text-secondary-foreground shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
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

                  {/* ✅ DIRECT CONTACT BUTTONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
                    <Button
                      type="button"
                      onClick={handleWhatsApp}
                      className="rounded-full bg-[#1fa855] hover:bg-[#1b924b] text-white font-semibold"
                      disabled={!name || !email || !message}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>

                    <Button
                      type="button"
                      onClick={handleEmail}
                      className="rounded-full bg-[#2f5d50] hover:bg-[#294f44] text-white font-semibold"
                      disabled={!name || !email || !message}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Email
                    </Button>

                    <Button
                      type="button"
                      onClick={handleCall}
                      className="rounded-full bg-secondary text-secondary-foreground font-semibold"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center pt-3">
                    ✅ Fill Name, Email & Message to enable WhatsApp/Email buttons.
                  </p>
                </form>
              </div>
            </motion.div>

            {/* ✅ RIGHT: CAROUSEL + CONTACT INFO */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* ✅ IMAGE CAROUSEL */}
              <div className="relative overflow-hidden rounded-3xl h-[280px] sm:h-[320px] md:h-[420px] shadow-2xl border border-white/40 bg-white/40 backdrop-blur">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide}
                    src={carouselImages[slide]}
                    alt="Cozy Way Contact Images"
                    initial={{ opacity: 0.3, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xl md:text-2xl font-bold font-display">
                    Cozy Way, Dharamshala 🌄
                  </p>
                  <p className="text-sm md:text-base text-white/80 mt-1">
                    Your peaceful stay in the mountains.
                  </p>
                </div>
              </div>

              {/* ✅ CONTACT INFO CARD */}
              <div className="surface-card rounded-3xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-2xl font-bold font-display text-secondary mb-4">
                  Direct Info
                </h3>

                <div className="space-y-4 text-muted-foreground text-sm sm:text-base">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" />
                    <span>{DIRECT_EMAIL}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" />
                    <span>+91 98164 46709</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1" />
                    <span>Dharamshala, Himachal Pradesh, India</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;
