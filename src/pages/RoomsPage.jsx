import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Bed,
  Wifi,
  Wind,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const IconWrapper = ({ name, ...props }) => {
  const icons = { Bed, Wifi, Wind, Sparkles, Users };
  const IconComponent = icons[name] || Sparkles;
  return <IconComponent {...props} />;
};

/* ✅ RESPONSIVE ROOM DETAIL MODAL */
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
        {/* ✅ Scroll container */}
        <div className="relative max-h-[92vh] overflow-y-auto">
          {/* ✅ Always visible close button */}

          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.2fr]">
            {/* ✅ Responsive Image */}
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

            {/* ✅ Responsive Content */}
            <div className="flex flex-col p-5 sm:p-7 lg:p-10">
              <h2 className="mb-3 text-2xl font-bold leading-tight text-secondary sm:text-3xl lg:text-4xl font-display">
                {room.name}
              </h2>

              <div
                className={`mb-4 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white ${
                  room.availability === "Available" ? "bg-green-500" : "bg-red-500"
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
                        {showAllAmenities ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ Responsive bottom */}
              <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Monthly Rent
                  </p>
                  <p className="text-3xl font-bold sm:text-4xl">
                  ₹{room.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/Month</span>
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const phoneNumber = "919816446709";
                    const message = `Hello Cozy Way! 👋%0A%0AI want to enquire about the availability of the room: *${room.name}* 🏨%0A%0ACan you please share availability + price details?`;
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
                    onOpenChange(false);
                  }}
                  className="soft-shadow hover:glow-shadow h-12 w-full rounded-full bg-secondary px-6 text-secondary-foreground sm:w-auto"
                >
                  Enquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ✅ RESPONSIVE ROOM CARD */
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
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-secondary">
            {room.name}
          </h3>

          <p className="text-muted-foreground mt-2 mb-4 text-xs sm:text-sm leading-relaxed flex-grow">
            {room.description?.substring(0, 110)}...
          </p>

          {/* ✅ Responsive bottom row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-4 border-t">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              ₹{room.price}
              <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                {" "}
                /Month
              </span>
            </p>

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

const RoomsPage = () => {
  const { rooms = [], loading } = useData();
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (availabilityFilter !== "all" && room.availability !== availabilityFilter) {
        return false;
      }
      return true;
    });
  }, [rooms, availabilityFilter]);

  const roomsPageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Rooms in Dharamshala | Cozy Way",
      url: "https://www.cozyway.in/rooms",
      description:
        "Explore affordable and comfortable rooms in Dharamshala at Cozy Way.",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: filteredRooms.slice(0, 12).map((room, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "HotelRoom",
            name: room.name,
            description: room.description,
            image: room.image_url,
          },
        })),
      },
    }),
    [filteredRooms]
  );

  return (
    <PageTransition>
      <Helmet>
        <title>Rooms in Dharamshala | Cozy Way</title>
        <meta
          name="description"
          content="Find rooms in Dharamshala at Cozy Way. Affordable room rent in Dharamshala with modern amenities, clean interiors, and mountain views."
        />
        <meta
          name="keywords"
          content="rooms in dharamshala, dharamshala room rent, room for rent dharamshala, room rent in dharamshala, dharamshala rooms, rooms in dharmashala, cozy way dharamshala"
        />
        <link rel="canonical" href="https://www.cozyway.in/rooms" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rooms in Dharamshala | Cozy Way" />
        <meta
          property="og:description"
          content="Affordable rooms in Dharamshala with comfort-focused amenities at Cozy Way."
        />
        <meta property="og:url" content="https://www.cozyway.in/rooms" />
        <meta property="og:image" content="https://www.cozyway.in/logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rooms in Dharamshala | Cozy Way" />
        <meta
          name="twitter:description"
          content="Book cozy, affordable room stays in Dharamshala at Cozy Way."
        />
        <meta name="twitter:image" content="https://www.cozyway.in/logo.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(roomsPageSchema)}
        </script>
      </Helmet>

      {/* ✅ HEADER */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
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
              Rooms & Suites
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-display text-white mt-3">
              Our Accommodations
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Cozy rooms crafted for relaxation, comfort and memorable stay
            </p>
          </motion.div>
        </div>
      </section>

      {/* ✅ ROOMS LIST */}
      <div className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-10 sm:mb-12">
            <Select onValueChange={setAvailabilityFilter} defaultValue="all">
              <SelectTrigger className="w-[220px] bg-card shadow-sm">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center pt-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex"
                >
                  <RoomCard room={room} onReadMore={setSelectedRoom} />
                </motion.div>
              ))}
            </div>
          )}

          {filteredRooms.length === 0 && !loading && (
            <p className="text-center text-muted-foreground mt-12">
              No rooms match the current filters.
            </p>
          )}
        </div>
      </div>

      {/* ✅ MODAL */}
      <RoomDetailModal
        room={selectedRoom}
        open={!!selectedRoom}
        onOpenChange={() => setSelectedRoom(null)}
      />
    </PageTransition>
  );
};

export default RoomsPage;
