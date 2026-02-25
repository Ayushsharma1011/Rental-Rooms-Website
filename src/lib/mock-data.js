import React from 'react';

export const rooms = [
  {
    id: 1,
    name: 'Mountain View Suite',
    type: 'Suite',
    price: 150,
    description: 'A luxurious suite offering panoramic views of the Himalayan range. Features a private balcony, a king-sized bed, and a modern-art-decorated living area.',
    amenities: ['wifi', 'tv', 'balcony', 'heater'],
    images: [
      { id: 1, url: 'Mountain-facing bedroom with large glass windows', alt: 'Spacious suite with mountain view' },
      { id: 2, url: 'Private balcony overlooking snowy peaks', alt: 'Balcony with a view' },
      { id: 3, url: 'Modern bathroom with a rain shower', alt: 'Modern suite bathroom' },
    ],
    availability: 'Available',
  },
  {
    id: 2,
    name: 'Garden Cottage',
    type: 'Cottage',
    price: 120,
    description: 'A cozy cottage nestled in our lush gardens. Perfect for couples seeking a romantic and private retreat with a personal patio.',
    amenities: ['wifi', 'patio', 'heater', 'kitchenette'],
    images: [
      { id: 1, url: 'Charming cottage surrounded by green foliage', alt: 'Exterior of Garden Cottage' },
      { id: 2, url: 'Cozy interior with a queen-sized bed and fireplace', alt: 'Cozy cottage interior' },
      { id: 3, url: 'Private patio with garden furniture', alt: 'Patio of the cottage' },
    ],
    availability: 'Available',
  },
  {
    id: 3,
    name: 'Deluxe Valley Room',
    type: 'Deluxe',
    price: 100,
    description: 'A comfortable and stylish room with a stunning view of the valley. Equipped with all modern amenities for a relaxing stay.',
    amenities: ['wifi', 'tv', 'heater'],
    images: [
      { id: 1, url: 'Elegant room with a large window overlooking a green valley', alt: 'Deluxe Valley Room view' },
      { id: 2, url: 'Comfortable double bed with plush pillows', alt: 'Bed in Deluxe Valley Room' },
      { id: 3, url: 'Work desk with a view of the mountains', alt: 'Work desk in the room' },
    ],
    availability: 'Booked',
  },
  {
    id: 4,
    name: 'Family Loft',
    type: 'Loft',
    price: 200,
    description: 'Spacious two-level loft perfect for families. Features a master bedroom, a separate sleeping area for kids, and a large living space.',
    amenities: ['wifi', 'tv', 'heater', 'kitchenette', 'sofa-bed'],
    images: [
      { id: 1, url: 'Large open-plan loft with high ceilings and wooden beams', alt: 'Family Loft living area' },
      { id: 2, url: 'Master bedroom on the upper level of the loft', alt: 'Master bedroom in the loft' },
      { id: 3, url: 'Bunk beds in a cozy nook for children', alt: 'Kids sleeping area' },
    ],
    availability: 'Available',
  },
];

export const galleryImages = {
  interior: [
    { id: 'int1', url: 'Modern hotel lobby with a large abstract painting', alt: 'Lobby' },
    { id: 'int2', url: 'Restaurant interior with panoramic windows overlooking mountains', alt: 'Restaurant' },
    { id: 'int3', url: 'Cozy library with a fireplace and comfortable armchairs', alt: 'Library' },
  ],
  exterior: [
    { id: 'ext1', url: 'The hotel building at dusk with warm lights', alt: 'Hotel Exterior' },
    { id: 'ext2', url: 'Infinity pool overlooking the Himalayan range', alt: 'Infinity Pool' },
    { id: 'ext3', url: 'Manicured garden with walking paths and benches', alt: 'Hotel Garden' },
  ],
  nature: [
    { id: 'nat1', url: 'Sunrise over the Dhauladhar mountain range', alt: 'Dhauladhar Sunrise' },
    { id: 'nat2', url: 'Bhagsu Waterfall in full flow during monsoon', alt: 'Bhagsu Waterfall' },
    { id: 'nat3', url: 'Paragliders soaring over the Kangra Valley', alt: 'Paragliding in Bir Billing' },
  ],
};

export const nearbySpots = [
  {
    id: 1,
    name: 'Dalai Lama Temple',
    description: 'The spiritual heart of McLeod Ganj.',
    image: 'Tibetan temple with prayer flags and monks',
    location: { lat: 32.2410, lng: 76.3235 }
  },
  {
    id: 2,
    name: 'Bhagsu Nag Waterfall',
    description: 'A scenic cascade with a historic temple.',
    image: 'A large waterfall cascading down rocky cliffs',
    location: { lat: 32.2500, lng: 76.3325 }
  },
  {
    id: 3,
    name: 'Triund Trek',
    description: 'A popular trek offering stunning views.',
    image: 'Hikers on a mountain ridge with snowy peaks in the background',
    location: { lat: 32.2618, lng: 76.3384 }
  },
    {
    id: 4,
    name: 'Naddi Viewpoint',
    description: 'Panoramic views of the Dhauladhar range.',
    image: 'A viewpoint balcony overlooking a vast mountain range at sunset',
    location: { lat: 32.2570, lng: 76.3050 }
  }
];