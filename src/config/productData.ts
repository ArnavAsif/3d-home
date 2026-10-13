export interface ProductVariant {
  id: string;
  name: string;
  woodFinish: string;
  badge: string;
  price: number;
  compareAtPrice: number;
  available: boolean;
  sku: string;
  shopifyVariantId?: string;
}

export interface ProductData {
  id: string;
  title: string;
  tagline: string;
  handle: string;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specs: { [key: string]: string };
  variants: ProductVariant[];
  shopifyProductId?: string;
  // Position in the 3D room directly in front of the door
  roomPosition: [number, number, number];
  roomRotation: [number, number, number];
  interactionDistance: number;
}

export const HELMET_HANGER_PRODUCT: ProductData = {
  id: 'prod_helmet_hanger_01',
  title: 'Handcrafted Hardwood & Iron Pipe Motorcycle Helmet Hanger',
  tagline: 'Premium Wall-Mounted Helmet Display Rack with Precision Emblem',
  handle: 'motorcycle-helmet-hanger-wood-iron',
  price: 79.00,
  compareAtPrice: 99.00,
  rating: 4.9,
  reviewCount: 128,
  images: [
    '/images/helmet-hanger.jpg'
  ],
  description:
    'Showcase your helmet like a masterpiece. Handcrafted from solid furniture-grade hardwood and industrial heavy-gauge black iron pipe, this wall-mounted helmet rack protects your helmet interior while adding authentic artisan style to your home, garage, or showroom.',
  features: [
    'Solid 3/4" furniture-grade hardwood mounting backplate with bevelled edges',
    'Heavy-gauge 1/2" industrial matte black cast-iron pipe, elbow, and wall flange',
    'Turned round hardwood helmet rest pad prevents interior EPS foam compression',
    'Precision relief-carved motorcycle brand emblem badge',
    'Heavy-duty wall mounting hardware and anchors included (supports up to 45 lbs)',
    'Finished with hand-rubbed organic Danish oil and protective satin wax'
  ],
  specs: {
    'Backplate Dimensions': '18.5" H × 6.5" W × 0.75" D (47cm × 16.5cm × 2cm)',
    'Pipe Projection': '10.5" from wall (26.7cm)',
    'Helmet Pad Diameter': '5.5" (14cm)',
    'Materials': 'Solid White Oak / Black Cast-Iron Pipe',
    'Weight Capacity': '45 lbs (20.5 kg)',
    'Compatibility': 'Full-face, Modular, Motocross, Dual-Sport & Open-Face helmets'
  },
  variants: [
    {
      id: 'var_hayabusa_oak',
      name: 'Hayabusa Kanji (隼) • Natural Oak',
      woodFinish: 'Natural Oak',
      badge: 'Hayabusa (隼)',
      price: 79.00,
      compareAtPrice: 99.00,
      available: true,
      sku: 'HH-HAYA-OAK',
      shopifyVariantId: 'gid://shopify/ProductVariant/44010001'
    },
    {
      id: 'var_suzuki_walnut',
      name: 'Suzuki Sport • Dark Walnut',
      woodFinish: 'Dark Walnut',
      badge: 'Suzuki Sport',
      price: 79.00,
      compareAtPrice: 99.00,
      available: true,
      sku: 'HH-SUZ-WAL',
      shopifyVariantId: 'gid://shopify/ProductVariant/44010002'
    },
    {
      id: 'var_ktm_cherry',
      name: 'KTM Racing • Vintage Cherry',
      woodFinish: 'Vintage Cherry',
      badge: 'KTM Racing',
      price: 79.00,
      compareAtPrice: 99.00,
      available: true,
      sku: 'HH-KTM-CHE',
      shopifyVariantId: 'gid://shopify/ProductVariant/44010003'
    },
    {
      id: 'var_ryker_black',
      name: 'Ryker Emblem • Carbon Black Oak',
      woodFinish: 'Carbon Black Oak',
      badge: 'Ryker',
      price: 84.00,
      compareAtPrice: 105.00,
      available: true,
      sku: 'HH-RYK-BLK',
      shopifyVariantId: 'gid://shopify/ProductVariant/44010004'
    }
  ],
  shopifyProductId: 'gid://shopify/Product/88020001',
  // Wall-mounted directly beside the entrance door on the east wall at eye height
  roomPosition: [9.15, 1.62, 1.35],
  roomRotation: [0, -Math.PI * 0.5, 0], // Facing into the room (-X)
  interactionDistance: 3.8 // Player can target from ~3.8m away
};
