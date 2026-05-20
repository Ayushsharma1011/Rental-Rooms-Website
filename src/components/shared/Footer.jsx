import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Facebook, LogIn } from 'lucide-react';
import LogoLightbox from '@/components/shared/LogoLightbox';

const Footer = () => {
  const footerLinks = [
    { name: 'About', path: '/about' },
    { name: 'Why Choose Us', path: '/why-choose-us' },
    { name: 'Our Journey', path: '/our-journey' },
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-3 text-xl font-bold font-display">
              <LogoLightbox
                containerClassName="flex h-12 w-20 items-center justify-center rounded-xl bg-white/10 p-1 ring-1 ring-white/20"
                imageClassName="h-full w-full object-contain"
                alt="Cozy Way Logo"
              />
              <NavLink to="/" className="text-2xl">
                Cozy Way
              </NavLink>
            </div>

            <p className="text-sm leading-relaxed text-white/70">
              Looking for a hassle-free place to stay? Our rental rooms offer comfort, style,
              and convenience for students, travelers, and professionals alike.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <p className="mb-4 font-bold text-white">Explore</p>
              <nav className="flex flex-col gap-2">
                <NavLink to="/rooms" className="text-white/70 transition-colors hover:text-white">
                  Rooms
                </NavLink>
                <NavLink
                  to="/nearby-spots"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  Nearby Spots
                </NavLink>
                <NavLink to="/gallery" className="text-white/70 transition-colors hover:text-white">
                  Gallery
                </NavLink>
              </nav>
            </div>

            <div>
              <p className="mb-4 font-bold text-white">Company</p>
              <nav className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:col-span-1">
            <p className="mb-4 font-bold text-white">Follow Us</p>
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white/70 transition-colors hover:text-white"
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 text-sm text-white/60 sm:flex-row">
          <p className="text-center text-sm text-white/60 sm:text-left">
            (c) 2026 Cozy Way | Built by{' '}
            <a
              href="https://www.synergyayush.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 underline underline-offset-4 transition-colors hover:text-white"
            >
              SynergyAyush
            </a>
          </p>

          <NavLink
            to="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-white/80 transition-colors hover:border-white/40 hover:text-white"
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
