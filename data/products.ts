/**
 * FYLTER - Product Catalog Dataset
 * 
 * To add, edit, or remove products:
 * 1. Add a new object following the Product interface.
 * 2. Ensure `slug` is unique (used in URL /products/slug).
 * 3. Set `featured: true` to use a product image in the Home page hero.
 * 4. Set `kidsCollection: true` to include the product in the Kids Corner.
 * 5. Set `trending: true` for the trending shop filter.
 * 6. Set `newArrival: true` to display under New Arrivals.
 */

export interface ProductVariant {
  name: string;
  values: string[];
}

export const productCategories = [
  "Aesthetic Stationery",
  "Cute Novelty",
  "Smart Everyday",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: ProductCategory;
  kidsCollection?: boolean;
  price: number;
  oldPrice?: number;
  discount?: number; // percentage
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  stockStatus: "In Stock" | "Low Stock" | "Pre-Order";
  rating?: number;
  reviewsCount?: number;
}

export function getProductPath(product: Pick<Product, "id" | "slug">): string {
  const identifier = product.slug.trim() || product.id.trim();
  return `/products/${encodeURIComponent(identifier)}`;
}

export const products: Product[] = [
  {
    id: "fyl-001",
    slug: "puremist-ultrasonic-air-humidifier",
    sku: "FYL-001",
    name: "PureMist Ultrasonic Nano Air Humidifier & Diffuser",
    category: "Smart Everyday",
    price: 1499,
    oldPrice: 2299,
    discount: 35,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1608248597359-5613532b2f6b?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Ultra-quiet ultrasonic cold-mist diffuser with dual ceramic purification filters and ambient warm gold night glow.",
    description: "The PureMist Nano transforms dry indoor spaces into soothing sanctuaries of balanced moisture. Engineered with medical-grade ultrasonic vibration plates and an active ceramic micro-filter, it purifies water minerals before releasing fine 2.5-micron vapor. Ideal for bedrooms, home studios, and workspace desks.",
    features: [
      "Micro-porous ceramic mineral filtration core",
      "Whisper-silent acoustic performance (< 24dB)",
      "Dual ambient warm gold lighting modes",
      "Smart auto shut-off upon water depletion",
      "Type-C universal fast-charging port"
    ],
    specifications: {
      "Capacity": "450 ml",
      "Coverage Area": "Up to 25 sq. meters",
      "Mist Output": "40-60 ml/hour",
      "Power Input": "5V / 2A Type-C",
      "Dimensions": "140 x 90 x 90 mm",
      "Weight": "320g"
    },
    variants: [
      { name: "Color", values: ["Matte Emerald Teal", "Champagne Gold", "Obsidian Black"] }
    ],
    featured: true,
    trending: true,
    newArrival: false,
    stockStatus: "In Stock",
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: "fyl-002",
    slug: "hydroaura-hydrogen-mineral-infuser-bottle",
    sku: "FYL-002",
    name: "HydroAura SPE Electrolysis Hydrogen Water Bottle",
    category: "Smart Everyday",
    price: 2999,
    oldPrice: 4499,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Ion-exchange SPE/PEM filtered hydrogen infusion bottle with dual-wall borosilicate glass and brushed gold metallic base.",
    description: "Elevate daily hydration with molecular hydrogen enrichment. HydroAura uses DuPont proton exchange membranes (PEM) to filter out residual ozone and chlorine, saturating purified water with up to 1600 PPB of active antioxidant hydrogen in just 3 minutes.",
    features: [
      "Advanced SPE/PEM technology with zero chlorine byproduct",
      "Shock-resistant high borosilicate thermal glass",
      "1600 PPB molecular hydrogen saturation in 3 mins",
      "Magnetic gold charging dock included",
      "Leak-proof silicone pressure seal"
    ],
    specifications: {
      "Volume": "420 ml",
      "Hydrogen Concentration": "1200 - 1600 PPB",
      "Battery": "1400mAh Li-ion (approx. 15 cycles/charge)",
      "Body Material": "Borosilicate Glass & SUS304",
      "Weight": "480g"
    },
    variants: [
      { name: "Finish", values: ["Brushed Teal Gold", "Matte Slate Gold"] }
    ],
    featured: true,
    trending: true,
    newArrival: true,
    stockStatus: "In Stock",
    rating: 4.8,
    reviewsCount: 94
  },
  {
    id: "fyl-003",
    slug: "aerohepa-desktop-air-purifier",
    sku: "FYL-003",
    name: "AeroHepa H13 True HEPA Compact Desktop Air Purifier",
    category: "Smart Everyday",
    price: 3499,
    oldPrice: 4999,
    discount: 30,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "360-degree 3-stage filtration system capturing 99.97% of airborne dust, smoke, pet dander, and micro-pollutants.",
    description: "Designed specifically for modern urban living, AeroHepa combines a medical-grade H13 True HEPA filter with an activated coconut-shell carbon matrix. Quietly recirculates and purifies the air around your work desk or bedside, keeping your breathing zone pristine.",
    features: [
      "True H13 HEPA & active charcoal honeycomb layer",
      "3-speed touch control with Sleep Mode (20dB)",
      "Filter replacement status indicator",
      "Subtle gold perimeter accent ring",
      "Low power consumption (10W max)"
    ],
    specifications: {
      "CADR Rating": "90 m³/h",
      "Coverage": "15-20 sq. meters",
      "Noise Level": "20dB - 48dB",
      "Filter Lifespan": "6-8 months",
      "Dimensions": "165 x 165 x 260 mm"
    },
    variants: [
      { name: "Accent", values: ["Deep Teal & Gold", "Classic Alabaster White"] }
    ],
    featured: true,
    trending: false,
    newArrival: false,
    stockStatus: "In Stock",
    rating: 4.9,
    reviewsCount: 215
  },
  {
    id: "fyl-004",
    slug: "showerspa-15stage-chlorine-water-filter",
    sku: "FYL-004",
    name: "ShowerSpa 15-Stage Hard Water & Chlorine Filter",
    category: "Smart Everyday",
    price: 1199,
    oldPrice: 1799,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Universal high-output shower filter cartridge targeting chlorine, heavy metals, scale, and hardness for glowing skin and healthier hair.",
    description: "Municipal and groundwater across Indian cities often contains harsh minerals and chlorine that dry out hair and irritate sensitive skin. ShowerSpa neutralizes chlorine, retains essential minerals, and softens water via KDF-55, calcium sulfite, and activated carbon.",
    features: [
      "15-stage multi-density catalytic filtration",
      "Universal 1/2\" brass threaded connector fits all shower heads",
      "Restores hair shine and reduces skin redness",
      "Tool-free 2-minute installation",
      "Includes 1 spare replacement cartridge"
    ],
    specifications: {
      "Thread Size": "Standard G 1/2\" fitting",
      "Operating Pressure": "20-80 PSI",
      "Operating Temperature": "4°C - 80°C",
      "Cartridge Life": "40,000 Liters (approx. 4-6 months)",
      "Finish": "Brushed Champagne Gold & Chrome"
    },
    variants: [
      { name: "Pack Option", values: ["Single Filter + 1 Cartridge", "Duo Pack (2 Filters + 4 Cartridges)"] }
    ],
    featured: true,
    trending: true,
    newArrival: false,
    stockStatus: "In Stock",
    rating: 4.7,
    reviewsCount: 88
  },
  {
    id: "fyl-005",
    slug: "blueshield-magnetic-privacy-anti-glare-filter",
    sku: "FYL-005",
    name: "BlueShield Magnetic Anti-Glare & Blue Light Filter",
    category: "Smart Everyday",
    price: 1799,
    oldPrice: 2499,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Snap-on magnetic micro-louver privacy and 95% blue-light filtration shield for laptops and workstations.",
    description: "Keep confidential screens private in cafes, flights, and open offices. BlueShield narrows the viewing angle to ±30 degrees while filtering harmful blue frequencies and reducing eye fatigue over long working sessions.",
    features: [
      "Instant magnetic attachment with zero sticky adhesives",
      "±30° micro-louver confidential privacy protection",
      "Blocks up to 95% high-energy visible (HEV) blue light",
      "Reversible matte (anti-glare) or glossy (enhanced clarity) sides",
      "Scratch-resistant 9H oleophobic coating"
    ],
    specifications: {
      "Thickness": "0.38 mm",
      "Privacy Angle": "60° total cone of vision",
      "Blue Light Cut": "420nm - 460nm band blocked",
      "Compatibility": "MacBook Air/Pro, Dell XPS, Lenovo ThinkPad"
    },
    variants: [
      { name: "Screen Size", values: ["13.3 - 13.6 inch", "14.0 - 14.2 inch", "15.6 - 16.0 inch"] }
    ],
    featured: true,
    trending: false,
    newArrival: true,
    stockStatus: "In Stock",
    rating: 4.9,
    reviewsCount: 62
  },
  {
    id: "fyl-006",
    slug: "aeropour-precision-mesh-coffee-filter",
    sku: "FYL-006",
    name: "AeroPour Double-Mesh Titanium Pour-Over Coffee Filter",
    category: "Smart Everyday",
    price: 999,
    oldPrice: 1499,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Ultra-fine reusable titanium-coated laser cut mesh cone for zero-paper specialty coffee brewing.",
    description: "Eliminate wasteful paper filters while letting natural aromatic coffee oils flow seamlessly into your cup. AeroPour features a dual-layer surgical mesh that prevents sediment from escaping while ensuring rich body and tasting notes.",
    features: [
      "0.2mm micro-laser mesh eliminates coffee grounds grit",
      "Eco-conscious lifetime reusable construction",
      "Heat-resistant silicone safety grip handle",
      "Universal base fits mugs, carafes, and Chemex brewers",
      "Dishwasher safe and effortless to rinse"
    ],
    specifications: {
      "Material": "SUS316 Food-grade Stainless Steel with Titanium PVD",
      "Capacity": "1-4 cups (approx. 800ml)",
      "Cone Diameter": "125 mm",
      "Base Diameter": "105 mm",
      "Weight": "115g"
    },
    variants: [
      { name: "Finish", values: ["Champagne Gold Titanium", "Matte Emerald PVD"] }
    ],
    featured: false,
    trending: true,
    newArrival: false,
    stockStatus: "In Stock",
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: "fyl-007",
    slug: "nomadpure-survival-straw-water-filter",
    sku: "FYL-007",
    name: "NomadPure Ultra-Filter Outdoor Survival Straw",
    category: "Smart Everyday",
    price: 1299,
    oldPrice: 1899,
    discount: 31,
    images: [
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "0.01 micron hollow-fiber membrane straw filter purifying stream and lake water on hiking expeditions.",
    description: "An indispensable tool for trekkers, adventurers, and emergency preparedness. Drink directly from freshwater streams, lakes, or bottles. Removes 99.9999% of waterborne bacteria, microplastics, and protozoan parasites without batteries or chemicals.",
    features: [
      "0.01 Micron medical-grade UF hollow fiber membrane",
      "Purifies up to 5,000 Liters of natural freshwater",
      "Integrated 28mm standard bottle thread",
      "Ultra-lightweight (65g) with carabiner strap included",
      "Zero chemicals, iodine, or battery power needed"
    ],
    specifications: {
      "Filter Pore Size": "0.01 Microns",
      "Filtration Capacity": "5,000 Liters",
      "Flow Rate": "550 ml/min",
      "Dimensions": "200 x 30 mm",
      "Weight": "65g"
    },
    variants: [
      { name: "Color", values: ["Tactical Forest Teal", "Camp Sand Beige"] }
    ],
    featured: true,
    trending: true,
    newArrival: true,
    stockStatus: "In Stock",
    rating: 4.9,
    reviewsCount: 76
  },
  {
    id: "fyl-008",
    slug: "crystalclean-faucet-water-purifier",
    sku: "FYL-008",
    name: "CrystalClean Transparent Tap Ceramic Water Purifier",
    category: "Smart Everyday",
    price: 899,
    oldPrice: 1399,
    discount: 35,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Quick-mount kitchen and bathroom faucet filter with washable diatom ceramic element and visible sediment chamber.",
    description: "Upgrade any standard tap in seconds. CrystalClean removes rust particles, residual chlorine, heavy sediment, and pipe contaminants while preserving beneficial minerals for washing fruits, vegetables, and face rinsing.",
    features: [
      "Washable natural diatomaceous ceramic core",
      "Dual toggle: filtered water stream & regular tap spray",
      "High transparency housing lets you see filtration in real-time",
      "Includes 6 universal faucet adapter collars",
      "Eco-friendly washable filter lasts up to 6 months"
    ],
    specifications: {
      "Working Pressure": "0.1 - 0.4 MPa",
      "Water Flow": "2.0 L/min",
      "Filter Material": "Diatomite Ceramic & Coconut Shell Carbon",
      "Mounting Compatibility": "Fits 98% of kitchen faucets"
    },
    variants: [
      { name: "Pack", values: ["Standard (1 Cartridge)", "Plus (3 Cartridges Included)"] }
    ],
    featured: false,
    trending: false,
    newArrival: true,
    stockStatus: "In Stock",
    rating: 4.6,
    reviewsCount: 45
  },
  {
    id: "fyl-009",
    slug: "dustshield-precision-vacuum-filter",
    sku: "FYL-009",
    name: "DustShield Precision Desk & Keyboard Vacuum Purifier",
    category: "Smart Everyday",
    price: 1199,
    oldPrice: 1699,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Cordless rechargeable handheld vacuum with micro-mesh HEPA air exhaust filtration for pristine desk setups.",
    description: "Keeps high-end mechanical keyboards, camera gear, and studio desks completely dust-free without exhausting fine particulate back into the room. Features a high-speed brushless turbine with washable micro-mesh air filters.",
    features: [
      "9,000Pa powerful vortex suction",
      "Dual micro-sponge + HEPA exhaust filtration",
      "Interchangeable brush & narrow crevice nozzles",
      "USB-C rechargeable 2000mAh battery",
      "Ergonomic matte teal body with gold trim accents"
    ],
    specifications: {
      "Motor Power": "120W",
      "Suction Force": "9,000 Pa",
      "Battery Capacity": "2,000 mAh",
      "Run Time": "25-30 minutes",
      "Weight": "285g"
    },
    variants: [
      { name: "Color", values: ["Deep Emerald", "Slate Grey"] }
    ],
    featured: false,
    trending: true,
    newArrival: false,
    stockStatus: "In Stock",
    rating: 4.7,
    reviewsCount: 53
  },
  {
    id: "fyl-010",
    slug: "solaris-uvc-self-cleaning-smart-flask",
    sku: "FYL-010",
    name: "Solaris UV-C Self-Cleaning Insulated Water Bottle",
    category: "Smart Everyday",
    price: 2499,
    oldPrice: 3499,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Cap-integrated 280nm deep UV-C LED that sanitizes water and eliminates bio-odor every 2 hours automatically.",
    description: "No more stale water bottle odor. Solaris integrates a germicidal UV-C LED inside its champagne gold cap, activating automatically every 2 hours to sterilize 99.9% of bacteria and keep water crystal fresh on flights and road trips.",
    features: [
      "280nm deep UV-C sterilization cap",
      "Self-cleaning cycle every 2 hours",
      "Double-wall vacuum insulation keeps cold 24h / hot 12h",
      "Magnetic waterproof charging cable included",
      "Food-grade 304 stainless steel interior"
    ],
    specifications: {
      "Capacity": "500 ml",
      "Thermal Insulation": "24h Cold / 12h Hot",
      "Battery Life": "Up to 30 days per charge",
      "Material": "SUS304 Stainless Steel & Matte Powder Coating",
      "Weight": "350g"
    },
    variants: [
      { name: "Colorway", values: ["Nordic Teal & Gold", "Matte Obsidian", "Pure Ivory"] }
    ],
    featured: true,
    trending: true,
    newArrival: true,
    stockStatus: "In Stock",
    rating: 4.9,
    reviewsCount: 110
  },
  {
    id: "fyl-011",
    slug: "soundpure-studio-magnetic-pop-filter",
    sku: "FYL-011",
    name: "SoundPure Studio Dual-Layer Metal Acoustic Pop Filter",
    category: "Smart Everyday",
    price: 849,
    oldPrice: 1299,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Dual-layer micro-perforated acoustic filter eliminating harsh vocal plosives and breath distortion.",
    description: "Designed for content creators, podcast hosts, and vocalists. SoundPure replaces ugly fabric screens with a sleek curved metal grille that stops air bursts while preserving high-frequency vocal clarity.",
    features: [
      "Dual-layer micro-mesh metal screen",
      "Heavy-duty 360-degree flexible gooseneck clamp",
      "Eliminates 'P' and 'B' vocal popping artifacts",
      "Champagne gold outer bezel rim",
      "Universal clamp fits all desk boom arms"
    ],
    specifications: {
      "Filter Diameter": "135 mm",
      "Gooseneck Length": "350 mm",
      "Clamp Width": "Up to 35 mm",
      "Material": "Carbon Steel & Brass"
    },
    variants: [
      { name: "Finish", values: ["Studio Gold & Black", "Stealth Black"] }
    ],
    featured: false,
    trending: false,
    newArrival: false,
    stockStatus: "In Stock",
    rating: 4.8,
    reviewsCount: 39
  },
  {
    id: "fyl-012",
    slug: "zenbreeze-aroma-filtered-personal-fan",
    sku: "FYL-012",
    name: "ZenBreeze Aromatherapy Filtered Desktop Fan",
    category: "Smart Everyday",
    price: 1349,
    oldPrice: 1999,
    discount: 32,
    images: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
    ],
    shortDescription: "Turbine bladed silent personal cooler with essential oil diffuser chamber and washable dust filter pad.",
    description: "Enjoy a cool, fragrant breeze with zero airborne dust. ZenBreeze pulls ambient air through a rear washable filter pad and circulates it through an essential oil diffusion chamber, producing calm, natural circulation.",
    features: [
      "Washable rear particulate pre-filter",
      "Built-in aromatherapy sponge tray",
      "3 whisper-quiet speed modes",
      "4000mAh battery for up to 10 hours runtime",
      "Minimalist retro-modern aesthetic with champagne gold dials"
    ],
    specifications: {
      "Battery": "4,000 mAh Li-ion",
      "Charging Time": "3.5 hours via USB-C",
      "Noise Level": "< 28 dB",
      "Dimensions": "180 x 140 x 85 mm",
      "Weight": "390g"
    },
    variants: [
      { name: "Color", values: ["Deep Pine Teal", "Warm Sand White"] }
    ],
    featured: false,
    trending: true,
    newArrival: true,
    stockStatus: "In Stock",
    rating: 4.7,
    reviewsCount: 82
  }
];

export const categories = [
  "All",
  ...productCategories,
] as const;

export type Category = (typeof categories)[number];

export interface CategoryInfo {
  name: ProductCategory;
  description: string;
  image: string;
}

export const categoryMeta: CategoryInfo[] = [
  {
    name: "Aesthetic Stationery",
    description: "Pretty paper goods, desk accessories, and little details to make every note feel special.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Cute Novelty",
    description: "Unexpected, joyful little finds that are as fun to give as they are to keep.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Smart Everyday",
    description: "Clever little upgrades for your routines, your space, and everything in between.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.trending);
}

export function getNewArrivalProducts(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getRelatedProducts(currentSlug: string, category: string, limit = 4): Product[] {
  return products
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}
