import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Facebook, LogIn } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-and-conditions' },
  ];

  const socialLinks = [
    {
      icon: <Instagram size={20} />,
      href: 'https://www.instagram.com/cozyw_ay?igsh=ejU3b2d4NmZzZmE0',
      label: 'Instagram',
    },
    {
      icon: <Facebook size={20} />,
      href: 'https://www.facebook.com/share/1FEwgECx46/',
      label: 'Facebook',
    },
  ];

  return (
    <footer className="bg-foreground text-background dark:bg-background dark:text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* LOGO + ABOUT */}
          <div className="md:col-span-1">
            <NavLink
              to="/"
              className="flex items-center gap-3 text-xl font-bold font-display mb-4"
            >
              {/* ✅ LOGO INSTEAD OF MOUNTAIN */}
              <div className="h-12 w-20 bg-white/10 rounded-xl flex items-center justify-center p-1 ring-1 ring-white/20">
                <img
                  src="/logo.jpg"
                  alt="Cozy Way Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-2xl">Cozy Way</span>
            </NavLink>

            <p className="text-sm text-white/70 leading-relaxed">
              Looking for a hassle-free place to stay? Our rental rooms offer comfort, style,
              and convenience for students, travelers, and professionals alike.
            </p>
          </div>

          {/* LINKS */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-white mb-4">Explore</p>
              <nav className="flex flex-col gap-2">
                <NavLink
                  to="/rooms"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Rooms
                </NavLink>
                <NavLink
                  to="/nearby-spots"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Nearby Spots
                </NavLink>
                <NavLink
                  to="/gallery"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Gallery
                </NavLink>
              </nav>
            </div>

            <div>
              <p className="font-bold text-white mb-4">Company</p>
              <nav className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* SOCIALS */}
          <div className="md:col-span-1">
            <p className="font-bold text-white mb-4">Follow Us</p>
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p className="text-sm text-white/60 text-center sm:text-left">
            (c) 2026 Cozy Way | Built by{" "}
            <a
              href="https://www.synergyayush.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white underline underline-offset-4 transition-colors"
            >
              SynergyAyush
            </a>
          </p>

          <NavLink
            to="/admin"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <LogIn size={16} />
            <span>Admin Login</span>
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
