import React, { useMemo } from 'react';
import { sanitizeRichText } from '@/lib/siteContent';

const RichTextRenderer = ({ content = '', className = '', demoteH1 = false }) => {
  const html = useMemo(
    () => sanitizeRichText(content, { demoteH1 }),
    [content, demoteH1]
  );

  return (
    <div
      className={`rich-text-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextRenderer;
