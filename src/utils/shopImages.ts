// Shop images utility - provides random images for smoke shops
export const shopImages = [
  '/images/shops/shop1.jpg',
  '/images/shops/shop2.jpg',
  '/images/shops/shop3.jpg',
  '/images/shops/shop4.jpg',
  '/images/shops/shop5.jpg',
  '/images/shops/shop6.jpg',
  '/images/shops/shop7.jpg',
  '/images/shops/shop8.jpg',
];

// Function to get a random shop image
export const getRandomShopImage = (): string => {
  const randomIndex = Math.floor(Math.random() * shopImages.length);
  return shopImages[randomIndex];
};

// Product images by category
export const productImages = {
  'CBD': [
    '/images/products/cbd1.jpg',
    '/images/products/cbd2.jpg',
    '/images/products/cbd3.jpg',
  ],
  'Delta 8': [
    '/images/products/delta8-1.jpg',
    '/images/products/delta8-2.jpg',
  ],
  'THCA Flower': [
    '/images/products/flower1.jpg',
    '/images/products/flower2.jpg',
    '/images/products/flower3.jpg',
  ],
  'Vapes': [
    '/images/products/vape1.jpg',
    '/images/products/vape2.jpg',
  ],
  'Accessories': [
    '/images/products/accessory1.jpg',
    '/images/products/accessory2.jpg',
    '/images/products/accessory3.jpg',
  ],
  'Edibles': [
    '/images/products/edible1.jpg',
    '/images/products/edible2.jpg',
  ],
  'THCP': [
    '/images/products/thcp1.jpg',
  ],
  'Delta 9': [
    '/images/products/delta9-1.jpg',
  ],
  'Glass Pipes': [
    '/images/products/glass1.jpg',
    '/images/products/glass2.jpg',
  ],
  'Rolling Papers': [
    '/images/products/paper1.jpg',
  ]
};

// Function to get a random product image by category
export const getRandomProductImage = (category: string): string => {
  const categoryImages = productImages[category as keyof typeof productImages] || productImages['Accessories'];
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return categoryImages[randomIndex];
}; 