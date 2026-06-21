import React from 'react';

const CozywayAnimatedLogo = () => (
  <div className="cozyway-splash min-h-screen overflow-hidden bg-gradient-to-b from-white to-yellow-50">
    <div className="relative flex flex-col items-center">
      <div className="cozyway-splash-glow absolute h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />

      <div className="cozyway-splash-logo-wrap relative">
        <img
          src="/logo.jpg"
          alt="Cozyway Logo"
          className="cozyway-splash-logo w-72 drop-shadow-2xl md:w-96"
          decoding="async"
        />

        <span className="cozyway-sparkle cozyway-sparkle-one" />
        <span className="cozyway-sparkle cozyway-sparkle-two" />
        <span className="cozyway-sparkle cozyway-sparkle-three" />
      </div>

      <h1 className="cozyway-splash-title mt-8 text-5xl font-bold tracking-[0.3em] text-slate-800 md:text-6xl">
        COZYWAY
      </h1>

      <p className="cozyway-splash-tagline mt-4 text-xl tracking-[0.4em] text-slate-600 md:text-2xl">
        MY PLACE MY SPACE
      </p>

      <div className="cozyway-splash-line mt-6 h-1 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300" />
    </div>
  </div>
);

export default CozywayAnimatedLogo;
