import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const LogoLightbox = ({ imageClassName = '', containerClassName = '', alt = 'Cozy Way logo' }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={containerClassName}
        aria-label="Open Cozy Way logo"
      >
        <img src="/logo.jpg" alt={alt} className={imageClassName} decoding="async" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-white/10 bg-black/95 p-3 shadow-2xl sm:p-4">
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/logo.jpg"
              alt={alt}
              className="max-h-[80vh] w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoLightbox;
