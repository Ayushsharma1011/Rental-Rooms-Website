import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Star, Send, MessageSquare } from "lucide-react";

import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { useData } from "@/contexts/DataContext";
import { supabase } from "@/lib/customSupabaseClient";

const TestimonialsPage = () => {
  const { testimonials = [], loading, refreshData } = useData();
  const { toast } = useToast();

  const approvedTestimonials = useMemo(() => {
    return testimonials.filter((t) => t.status === "approved");
  }, [testimonials]);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!name.trim() || !review.trim()) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter your name and review.",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("testimonials").insert([
      {
        name: name.trim(),
        text: review.trim(),
        status: "pending", // ✅ IMPORTANT: goes to admin for approval
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    } else {
      toast({
        title: "✅ Review submitted!",
        description: "Thanks! Your review is pending admin approval.",
      });

      setName("");
      setReview("");
      setShowForm(false);

      // ✅ Refresh list (optional)
      if (refreshData) await refreshData();
    }

    setSubmitting(false);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Testimonials | Cozy Way</title>
        <meta
          name="description"
          content="Read guest reviews of Cozy Way, a best homestay in Dharamshala with comfortable rooms in Dharamshala."
        />
        <meta
          name="keywords"
          content="dharamshala room rent, room for rent dharamshala, room rent in dharamshala, best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
        />
      </Helmet>

      {/* HEADER */}
      <section className="bg-accent pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold font-serif text-secondary mb-4">
              Guest Reviews
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Real experiences from our guests — only approved reviews are shown
              here.
            </p>

            <div className="flex justify-center mt-10">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => setShowForm((prev) => !prev)}
              >
                Leave a Review <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEAVE REVIEW FORM (SMALL BOX ON SAME PAGE) */}
      <AnimatePresence>
        {showForm && (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.35 }}
            className="bg-background py-12"
          >
            <div className="container mx-auto px-4 max-w-2xl">
              <Card className="glass-card shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-secondary text-center">
                    Leave a Review
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Ayush Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea
                        id="review"
                        rows={4}
                        placeholder="Write your experience..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setShowForm(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        className="rounded-full soft-shadow hover:glow-shadow"
                        disabled={submitting}
                      >
                        {submitting ? (
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
                  </form>

                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    ✅ Your review will appear after admin approval.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* APPROVED TESTIMONIALS LIST */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : approvedTestimonials.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {approvedTestimonials.map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="h-full"
                  >
                    <Card className="glass-card h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-bold text-secondary text-lg">
                            {t.name}
                          </p>

                          <div className="flex text-primary">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed flex-grow">
                          “{t.text}”
                        </p>

                        <p className="text-xs text-muted-foreground mt-4">
                          {t.created_at
                            ? new Date(t.created_at).toLocaleDateString()
                            : ""}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              No approved reviews yet. Be the first one to leave a review ✨
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default TestimonialsPage;
