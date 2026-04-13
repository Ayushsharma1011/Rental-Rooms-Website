import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";

const WHATSAPP_NUMBER = "919816446709";
const DIRECT_EMAIL = "cozywayin@gmail.com";
const PROPERTY_ADDRESS =
  "CozyWay, Gokhle Marg, Depot-Bazar Rd, Dharamshala, Himachal Pradesh 176215";

const starterQuestions = [
  "What rooms are available?",
  "What is the price of rooms?",
  "Where is Cozy Way located?",
  "How can I contact you?",
];

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatAmenityList = (amenities = []) => {
  if (!amenities.length) return "No amenities are listed for this room yet.";
  return amenities.map((amenity) => amenity.name).join(", ");
};
const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const createReply = (question, data) => {
  const text = normalizeText(question);
  const {
    rooms,
    amenities,
    nearbySpots,
    galleryImages,
    siteContent,
    approvedTestimonials,
  } = data;

  const matchedRoom = rooms.find((room) => {
    const roomName = normalizeText(room.name);
    return roomName && text.includes(roomName);
  });

  const matchedAmenity = amenities.find((amenity) =>
    text.includes(normalizeText(amenity.name))
  );

  const matchedSpot = nearbySpots.find((spot) =>
    text.includes(normalizeText(spot.name))
  );

  if (!text) {
    return "Ask me about rooms, prices, availability, amenities, location, nearby spots, or contact details for Cozy Way.";
  }

  if (matchedRoom) {
    return `${matchedRoom.name} is currently ${matchedRoom.availability?.toLowerCase() || "listed"} at Rs. ${matchedRoom.price}/month. ${matchedRoom.description} Amenities: ${formatAmenityList(matchedRoom.amenities)}.`;
  }

  if (
    text.includes("available") ||
    text.includes("availability") ||
    text.includes("vacant")
  ) {
    const availableRooms = rooms.filter(
      (room) => normalizeText(room.availability) === "available"
    );

    if (!availableRooms.length) {
      return "I couldn't find any rooms marked available right now. You can still contact Cozy Way on WhatsApp at +91 98164 46709 for the latest update.";
    }

    return `Currently available rooms: ${availableRooms
      .map((room) => `${room.name} (Rs. ${room.price}/month)`)
      .join(", ")}.`;
  }

  if (
    text.includes("price") ||
    text.includes("rent") ||
    text.includes("cost") ||
    text.includes("budget")
  ) {
    if (!rooms.length) {
      return "Room pricing is not loaded right now, but you can ask Cozy Way directly on WhatsApp at +91 98164 46709.";
    }

    return `Here are the current room prices on the website: ${rooms
      .map((room) => `${room.name}: Rs. ${room.price}/month`)
      .join(", ")}.`;
  }

  if (
    text.includes("room") ||
    text.includes("stay") ||
    text.includes("accommodation")
  ) {
    if (!rooms.length) {
      return "Room details are loading right now. Please try again in a moment.";
    }

    return `Cozy Way currently lists ${rooms.length} rooms on the website: ${rooms
      .map((room) => `${room.name} (${room.availability})`)
      .join(", ")}. Ask me about a specific room name for details.`;
  }

  if (matchedAmenity || text.includes("amenit") || text.includes("wifi")) {
    const roomAmenities = rooms
      .map((room) => `${room.name}: ${formatAmenityList(room.amenities)}`)
      .join(" | ");

    return roomAmenities
      ? `Amenities listed on the site include ${amenities
          .map((amenity) => amenity.name)
          .join(", ")}. By room: ${roomAmenities}.`
      : "I couldn't find amenity details right now.";
  }

  if (
    text.includes("contact") ||
    text.includes("call") ||
    text.includes("phone") ||
    text.includes("email") ||
    text.includes("whatsapp")
  ) {
    return `You can contact Cozy Way by phone or WhatsApp at +91 98164 46709, or by email at ${DIRECT_EMAIL}. The contact page also lets visitors send a message directly from the website.`;
  }

  if (
    text.includes("book") ||
    text.includes("booking") ||
    text.includes("reserve") ||
    text.includes("enquiry")
  ) {
    return "For booking or enquiry, the website directs guests to WhatsApp at +91 98164 46709. You can also use the Contact page form or email cozywayin@gmail.com.";
  }

  if (
    text.includes("where") ||
    text.includes("location") ||
    text.includes("address") ||
    text.includes("map")
  ) {
    return `Cozy Way is located at ${PROPERTY_ADDRESS}. The home page also includes a map link for directions.`;
  }

  if (matchedSpot || text.includes("nearby") || text.includes("place")) {
    if (!nearbySpots.length) {
      return "Nearby place details are not available right now.";
    }

    if (matchedSpot) {
      return `${matchedSpot.name}: ${matchedSpot.description}`;
    }

    return `Nearby spots shown on the website include ${nearbySpots
      .map((spot) => spot.name)
      .join(", ")}.`;
  }

  if (
    text.includes("gallery") ||
    text.includes("photo") ||
    text.includes("image") ||
    text.includes("picture")
  ) {
    return galleryImages.length
      ? `The gallery page currently shows ${galleryImages.length} property photos. You can open the Gallery page to browse them.`
      : "The website has a Gallery page for property photos.";
  }

  if (
    text.includes("review") ||
    text.includes("testimonial") ||
    text.includes("feedback")
  ) {
    return approvedTestimonials.length
      ? `The website currently has ${approvedTestimonials.length} approved guest testimonials.`
      : "The website includes a testimonials section for guest feedback.";
  }

  if (
    text.includes("about") ||
    text.includes("cozy way") ||
    text.includes("cozyway")
  ) {
    const aboutText = stripHtml(siteContent.about_page_content || "");
    return aboutText
      ? aboutText
      : "Cozy Way is presented on this website as a Dharamshala stay with comfortable rooms, mountain views, and local attractions nearby.";
  }

  return "I can answer only about this website: rooms, prices, availability, amenities, location, nearby spots, gallery, testimonials, and contact or booking details for Cozy Way.";
};

const WebsiteChatbot = () => {
  const navigate = useNavigate();
  const { rooms, amenities, nearbySpots, galleryImages, siteContent, testimonials } =
    useData();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi, I’m the Cozy Way assistant. Ask me about rooms, pricing, availability, amenities, location, nearby places, or how to contact and book.",
    },
  ]);
  const messagesEndRef = useRef(null);

  const chatbotData = useMemo(
    () => ({
      rooms,
      amenities,
      nearbySpots,
      galleryImages,
      siteContent,
      approvedTestimonials: testimonials.filter(
        (testimonial) => testimonial.status === "approved"
      ),
    }),
    [amenities, galleryImages, nearbySpots, rooms, siteContent, testimonials]
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const pushConversation = (question) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const botReply = createReply(trimmedQuestion, chatbotData);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: trimmedQuestion,
      },
      {
        id: `bot-${Date.now() + 1}`,
        sender: "bot",
        text: botReply,
      },
    ]);
    setInput("");
  };

  return (
    <>
      <div className="fixed bottom-4 left-3 right-3 z-[80] sm:bottom-8 sm:left-auto sm:right-8">
        {isOpen && (
          <div className="chatbot-panel mb-3 flex w-full flex-col overflow-hidden rounded-[24px] border border-border/70 bg-background/95 shadow-2xl backdrop-blur-xl sm:mb-4 sm:w-[24rem] sm:max-h-[42rem] sm:rounded-[28px]">
            <div className="sticky top-0 z-10 bg-secondary px-4 py-4 text-secondary-foreground sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary-foreground/70 sm:text-sm sm:tracking-[0.24em]">
                    <Sparkles className="h-4 w-4" />
                    Cozy Way Chat
                  </p>
                  <h3 className="mt-2 pr-2 text-lg font-bold sm:text-xl">Website Assistant</h3>
                  <p className="mt-1 max-w-[16rem] text-xs text-secondary-foreground/80 sm:max-w-none sm:text-sm">
                    Answers are limited to this website&apos;s information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:max-h-[24rem] sm:px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed sm:max-w-[85%] sm:px-4 sm:py-3 sm:text-sm ${
                      message.sender === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-accent text-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border/60 px-3 py-4 sm:px-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                {starterQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => pushConversation(question)}
                    className="shrink-0 rounded-full border border-border bg-accent px-3 py-1.5 text-[11px] font-medium text-foreground transition hover:border-secondary hover:text-secondary sm:text-xs"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  pushConversation(input);
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about this website..."
                  className="min-w-0 rounded-full text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-full bg-secondary text-secondary-foreground"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full sm:w-auto"
                  onClick={() => navigate("/rooms")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View rooms
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full sm:w-auto"
                  onClick={() => {
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button
          type="button"
          onClick={() => setIsOpen((currentState) => !currentState)}
          className="ml-auto h-12 w-12 rounded-full border border-white/35 bg-secondary px-0 text-secondary-foreground shadow-[0_22px_50px_-20px_rgba(194,97,59,0.85)] transition-transform hover:scale-105 sm:h-14 sm:w-auto sm:min-w-[11.5rem] sm:gap-3 sm:rounded-full sm:px-5 sm:ring-8 sm:ring-white/55"
          aria-label="Open Cozy Way assistant"
        >
          <MessageCircle className="h-5 w-5 shrink-0 sm:h-5 sm:w-5" />
          <span className="hidden text-sm font-semibold sm:inline">
            Chat With Us
          </span>
        </Button>
      </div>
    </>
  );
};

export default WebsiteChatbot;
