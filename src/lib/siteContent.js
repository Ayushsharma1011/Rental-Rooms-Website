const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatInlineText = (value = '') =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

const convertPlainTextToHtml = (value = '', demoteH1 = false) => {
  const lines = value.split(/\r?\n/);
  const chunks = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    chunks.push(`<ul>${listItems.join('')}</ul>`);
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      listItems.push(`<li>${formatInlineText(line.replace(/^[-*]\s+/, ''))}</li>`);
      return;
    }

    flushList();

    if (/^###\s+/.test(line)) {
      chunks.push(`<h3>${formatInlineText(line.replace(/^###\s+/, ''))}</h3>`);
      return;
    }

    if (/^##\s+/.test(line)) {
      chunks.push(`<h2>${formatInlineText(line.replace(/^##\s+/, ''))}</h2>`);
      return;
    }

    if (/^#\s+/.test(line)) {
      const tagName = demoteH1 ? 'h2' : 'h1';
      chunks.push(`<${tagName}>${formatInlineText(line.replace(/^#\s+/, ''))}</${tagName}>`);
      return;
    }

    chunks.push(`<p>${formatInlineText(line)}</p>`);
  });

  flushList();

  return chunks.join('');
};

const unwrapNode = (node) => {
  const parent = node.parentNode;
  if (!parent) return;
  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }
  parent.removeChild(node);
};

const replaceTag = (node, nextTagName, documentRef) => {
  const replacement = documentRef.createElement(nextTagName);
  replacement.innerHTML = node.innerHTML;
  node.parentNode?.replaceChild(replacement, node);
  return replacement;
};

const sanitizeTree = (root, options = {}) => {
  const { demoteH1 = false } = options;
  const allowedTags = new Set(['H1', 'H2', 'H3', 'P', 'UL', 'LI', 'STRONG', 'EM', 'BR']);

  Array.from(root.childNodes).forEach((child) => {
    if (child.nodeType === 3) return;

    if (child.nodeType !== 1) {
      child.parentNode?.removeChild(child);
      return;
    }

    let currentNode = child;
    const tagName = currentNode.tagName.toUpperCase();

    if (!allowedTags.has(tagName)) {
      unwrapNode(currentNode);
      return;
    }

    if (demoteH1 && tagName === 'H1') {
      currentNode = replaceTag(currentNode, 'h2', root.ownerDocument);
    }

    Array.from(currentNode.attributes).forEach((attribute) => {
      currentNode.removeAttribute(attribute.name);
    });

    sanitizeTree(currentNode, options);
  });
};

export const sanitizeRichText = (value = '', options = {}) => {
  if (!value) return '';

  const textValue = `${value}`.trim();
  if (!textValue) return '';

  if (!/[<>]/.test(textValue)) {
    return convertPlainTextToHtml(textValue, options.demoteH1);
  }

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return convertPlainTextToHtml(textValue.replace(/<[^>]+>/g, ''), options.demoteH1);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${textValue}</div>`, 'text/html');
  const container = doc.body.firstElementChild;

  if (!container) {
    return convertPlainTextToHtml(textValue.replace(/<[^>]+>/g, ''), options.demoteH1);
  }

  sanitizeTree(container, options);
  return container.innerHTML.trim();
};

export const stripRichText = (value = '') => {
  if (!value) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return `${value}`.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${value}</div>`, 'text/html');
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() || '';
};

export const SITE_CONTENT_DEFAULTS = {
  hero_title: 'Comfortable and Affordable Accommodations for Every Need',
  hero_subtitle: 'Stay close to the mountains, connected to comfort, and surrounded by calm.',
  about_page_meta_title: 'About Cozy Way | Dharamshala Rental Rooms',
  about_page_meta_description:
    'Learn about Cozy Way, a Dharamshala rental rooms stay offering warm Himalayan hospitality.',
  about_page_content: `
    <h2>Hospitality That Feels Personal</h2>
    <p>Cozy Way was created to offer a calm, comfortable, and well-managed stay experience in Dharamshala for students, professionals, and travelers.</p>
    <p>We focus on clean rooms, useful amenities, and a peaceful environment that makes daily living simple and pleasant.</p>
    <h3>What Guests Can Expect</h3>
    <ul>
      <li>Comfortable furnished rooms with practical essentials</li>
      <li>Thoughtful amenities for long and short stays</li>
      <li>A location that keeps you connected to the city while feeling relaxed</li>
    </ul>
  `,
  contact_page_meta_title: 'Contact Cozy Way | Rooms in Dharamshala',
  contact_page_meta_description:
    'Contact Cozy Way to ask about room availability, amenities, bookings, and stay details in Dharamshala.',
  contact_page_content: `
    <h2>We Are Happy To Help</h2>
    <p>Reach out to us for room availability, monthly stay details, amenities, or any booking-related questions.</p>
    <ul>
      <li><strong>WhatsApp:</strong> Quick replies for enquiries and follow-ups</li>
      <li><strong>Email:</strong> Best for detailed requests and documentation</li>
      <li><strong>Phone:</strong> Direct support for urgent questions</li>
    </ul>
  `,
  privacy_policy_meta_title: 'Privacy Policy | Cozy Way',
  privacy_policy_meta_description: 'Read the privacy policy for Cozy Way in Dharamshala.',
  privacy_policy_content: `
    <h2>Information We Collect</h2>
    <p>We may collect information you share through our contact or booking forms, such as your name, email address, phone number, and message details.</p>
    <h2>How We Use Your Information</h2>
    <ul>
      <li>To respond to your enquiries</li>
      <li>To manage bookings and follow-up communication</li>
      <li>To improve the quality of our services and website experience</li>
    </ul>
    <h2>Data Protection</h2>
    <p>We take reasonable steps to keep your information secure and only use it for relevant hospitality and communication purposes.</p>
  `,
  terms_and_conditions_meta_title: 'Terms & Conditions | Cozy Way',
  terms_and_conditions_meta_description:
    'Review terms and conditions for Cozy Way in Dharamshala.',
  terms_and_conditions_content: `
    <h2>Bookings And Enquiries</h2>
    <p>All room enquiries and bookings are subject to confirmation, availability, and verification of stay details.</p>
    <h2>Guest Responsibilities</h2>
    <ul>
      <li>Provide accurate information while enquiring or booking</li>
      <li>Respect house rules and the comfort of other guests</li>
      <li>Use the property and amenities responsibly</li>
    </ul>
    <h2>Changes And Updates</h2>
    <p>Policies, amenities, and pricing may be updated when necessary. We recommend confirming current details before finalizing a stay.</p>
  `,
  our_journey_meta_title: 'Our Journey | Cozy Way',
  our_journey_meta_description:
    'Explore the story, growth, and vision behind Cozy Way in Dharamshala.',
  our_journey_content: `
    <h2>A Need We Could Clearly See</h2>
    <p>The journey of starting a room rental service for girls and working women in Dharamshala began with a simple yet powerful realization: there was a genuine need.</p>
    <p>Every year, many students, job seekers, and working professionals come to the city with dreams and ambitions, but often struggle to find safe, comfortable, and affordable accommodation.</p>
    <h2>Listening To Real Concerns</h2>
    <p>Witnessing these challenges firsthand sparked the idea. Conversations with students and working women revealed common concerns around safety, hygiene, accessibility, and a supportive environment.</p>
    <p>It became clear that accommodation was not just about a place to stay. It was about creating a space where individuals could feel secure, respected, and at ease while pursuing their goals.</p>
    <h2>From Thought To Mission</h2>
    <p>What started as a thought gradually turned into a mission: to provide a reliable and welcoming living space tailored specifically for girls and working women.</p>
    <p><strong>My Place, My Space</strong> is more than just a tagline. It reflects the heart of this initiative. It stands for independence, comfort, and the freedom to live on one's own terms in a safe and nurturing environment.</p>
    <h2>Building With Care</h2>
    <p>The journey involved careful planning, understanding needs, setting up facilities, and ensuring that every detail, from security to comfort, was thoughtfully addressed.</p>
    <p>There were challenges along the way, but each step strengthened the vision.</p>
    <h2>What This Journey Represents Today</h2>
    <p>Today, this initiative stands as a reflection of that journey: born out of necessity, shaped by empathy, and driven by the desire to make a meaningful difference.</p>
    <p>To capture this journey, a few photographs can beautifully showcase the transformation, from the initial setup to the final space, and the people who became part of this story. These images not only highlight the effort but also bring the vision to life.</p>
  `,
  youtube_channel_title: 'Watch Cozy Way On YouTube',
  youtube_channel_description:
    'Add your YouTube channel or video link from the admin panel to showcase room tours, local highlights, and stay updates here.',
  youtube_channel_embed_url: 'https://www.youtube.com/watch?v=s406qpED-VE',
  why_choose_label: 'Why Choose Us',
  why_choose_title: 'A stay shaped around safety, comfort, and a real sense of belonging.',
  why_choose_description:
    'Cozy Way is built for guests who want more than a room. Our journey brings together peaceful surroundings, practical amenities, and thoughtful care for students, working women, and travelers in Dharamshala.',
  why_choose_points: 'Safe managed stay\nPeaceful mountain setting\nComfort for daily living',
  why_choose_button_text: 'Read Our Journey',
  why_choose_image_label: 'See The Story',
  why_choose_image_title: 'From a need to a welcoming space',
};

export const SITE_CONTENT_ADMIN_SECTIONS = [
  {
    title: 'Homepage',
    description: 'Primary homepage messaging and YouTube showcase content.',
    fields: [
      { key: 'hero_title', label: 'Hero Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'youtube_channel_title', label: 'YouTube Section Title', type: 'text' },
      { key: 'youtube_channel_description', label: 'YouTube Section Description', type: 'textarea' },
      { key: 'youtube_channel_embed_url', label: 'YouTube Link or Embed URL', type: 'text' },
    ],
  },
  {
    title: 'Homepage Why Choose Us',
    description: 'Text shown in the bold Why Choose Us section on the homepage.',
    fields: [
      { key: 'why_choose_label', label: 'Small Label', type: 'text' },
      { key: 'why_choose_title', label: 'Main Heading', type: 'textarea' },
      { key: 'why_choose_description', label: 'Description', type: 'textarea' },
      { key: 'why_choose_points', label: 'Key Points - one per line', type: 'textarea' },
      { key: 'why_choose_button_text', label: 'Button Text', type: 'text' },
      { key: 'why_choose_image_label', label: 'Image Overlay Label', type: 'text' },
      { key: 'why_choose_image_title', label: 'Image Overlay Title', type: 'text' },
    ],
  },
  {
    title: 'About Page',
    description: 'SEO metadata and structured body content for the About page.',
    fields: [
      { key: 'about_page_meta_title', label: 'Meta Title', type: 'text' },
      { key: 'about_page_meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'about_page_content', label: 'Page Content', type: 'richtext' },
    ],
  },
  {
    title: 'Contact Page',
    description: 'SEO metadata and structured intro content for the Contact page.',
    fields: [
      { key: 'contact_page_meta_title', label: 'Meta Title', type: 'text' },
      { key: 'contact_page_meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'contact_page_content', label: 'Page Content', type: 'richtext' },
    ],
  },
  {
    title: 'Privacy Policy Page',
    description: 'SEO metadata and structured policy content.',
    fields: [
      { key: 'privacy_policy_meta_title', label: 'Meta Title', type: 'text' },
      { key: 'privacy_policy_meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'privacy_policy_content', label: 'Page Content', type: 'richtext' },
    ],
  },
  {
    title: 'Terms & Conditions Page',
    description: 'SEO metadata and structured terms content.',
    fields: [
      { key: 'terms_and_conditions_meta_title', label: 'Meta Title', type: 'text' },
      { key: 'terms_and_conditions_meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'terms_and_conditions_content', label: 'Page Content', type: 'richtext' },
    ],
  },
  {
    title: 'Our Journey Page',
    description: 'SEO metadata and structured content for the new Our Journey page.',
    fields: [
      { key: 'our_journey_meta_title', label: 'Meta Title', type: 'text' },
      { key: 'our_journey_meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'our_journey_content', label: 'Page Content', type: 'richtext' },
    ],
  },
];

export const getContentValue = (siteContent, key) => {
  const value = siteContent?.[key];

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (value && typeof value !== 'string') {
    return value;
  }

  return SITE_CONTENT_DEFAULTS[key] ?? '';
};

export const getStructuredContent = (siteContent, key, options = {}) =>
  sanitizeRichText(getContentValue(siteContent, key), options);

export const getMetaValue = (siteContent, key) => `${getContentValue(siteContent, key)}`.trim();

export const getYouTubeEmbedUrl = (value = '') => {
  if (!value) return '';

  const trimmed = `${value}`.trim();
  if (!trimmed) return '';

  if (trimmed.includes('youtube.com/embed/')) return trimmed;

  const match =
    trimmed.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([\w-]{11})/) ||
    trimmed.match(/youtube\.com\/embed\/([\w-]{11})/);

  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : '';
};
