import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const showSolid = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Nearby Spots", path: "/nearby-spots" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolid
          ? "glass-navbar py-3 sm:py-4"
          : "bg-transparent py-4 sm:py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div
              className={`h-10 w-16 sm:h-12 sm:w-20 md:h-14 md:w-24 rounded-xl p-1 ring-1 ${
                showSolid
                  ? "bg-background/90 ring-foreground/20"
                  : "bg-white/10 ring-white/40"
              }`}
            >
              <img
                src="/logo.jpg"
                alt="Cozy Way"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <span
                className={`block text-base sm:text-lg md:text-xl font-display font-bold drop-shadow-sm ${
                  showSolid ? "text-foreground" : "text-white"
                }`}
              >
                Cozy Way
              </span>
              <span
                className={`hidden sm:block text-[9px] md:text-[10px] uppercase tracking-[0.18em] ${
                  showSolid ? "text-foreground/70" : "text-white/80"
                }`}
              >
                My Place My Space
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-sm lg:text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? showSolid
                      ? "text-secondary"
                      : "text-white"
                    : showSolid
                      ? "text-foreground/70 hover:text-foreground"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              showSolid
                ? "text-foreground hover:bg-foreground/10"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="mobile-menu mt-4 mx-4 rounded-2xl shadow-2xl">
              <div className="flex flex-col py-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-6 py-3 text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-secondary bg-secondary/10"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
