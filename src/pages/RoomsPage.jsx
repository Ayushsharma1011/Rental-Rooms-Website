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
  X,
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
      <DialogContent
        className="
          w-[95vw] sm:w-[90vw] max-w-4xl
          p-0 bg-card border-border/60
          max-h-[90vh] overflow-hidden
          rounded-3xl
        "
      >
        {/* ✅ Scroll container */}
        <div className="relative max-h-[90vh] overflow-y-auto">
          {/* ✅ Always visible close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* ✅ Responsive Image */}
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

            {/* ✅ Responsive Content */}
            <div className="p-5 sm:p-7 md:p-8 flex flex-col">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-secondary mb-2">
                {room.name}
              </h2>

              <div
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-white self-start mb-4 ${
                  room.availability === "Available" ? "bg-green-500" : "bg-red-500"
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
                    <h4 className="font-semibold mb-2 text-secondary">Amenities:</h4>

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

              {/* ✅ Responsive bottom */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-auto pt-5 border-t">
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{room.price}
                  <span className="text-sm font-normal text-muted-foreground">/Month</span>
                </p>

                <Button
                  onClick={() => {
                    const phoneNumber = "919816446709";
                    const message = `Hello Cozy Way! 👋%0A%0AI want to enquire about the availability of the room: *${room.name}* 🏨%0A%0ACan you please share availability + price details?`;
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
                    onOpenChange(false);
                  }}
                  className="soft-shadow hover:glow-shadow w-full sm:w-auto rounded-full bg-secondary text-secondary-foreground"
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
