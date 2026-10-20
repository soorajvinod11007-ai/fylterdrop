# FYLTER — Purely Filters

A modern, high-end product catalog and discovery web experience for **FYLTER** ("PURELY FILTERS"). Built with Next.js 14, TypeScript, and Tailwind CSS.

Engineered around Fylter's brand visual identity:
- **Primary Deep Teal**: `#0A2D2F`, `#062326`
- **Champagne Gold Accents**: `#C5A566`, `#D8BC7A`
- **Frictionless Social Commerce**: Instant ordering via **WhatsApp** and **Instagram** without traditional cart checkouts or card payment gateways.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js v18.17+ or v20+
- npm v9+

### 2. Development Server
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ How to Change Brand & Contact Details

All site-wide contact info, WhatsApp numbers, and social links are centralized in a single configuration file:
👉 **[`config/site.ts`](file:///c:/Users/ADMIN/OneDrive/fylter/config/site.ts)**

```typescript
export const siteConfig = {
  name: "Fylter",
  tagline: "Purely Filters",
  // Change your WhatsApp order receiving number (country code + number, NO plus sign):
  whatsappNumber: "919876543210",
  whatsappDisplayNumber: "+91 98765 43210",
  // Change your Instagram profile:
  instagramUrl: "https://instagram.com/fylter.in",
  instagramUsername: "@fylter.in",
  email: "support@fylter.in",
  currencySymbol: "₹",
  ...
};
```

When customers click **"Order on WhatsApp"**, it automatically generates a pre-formatted message sent to this WhatsApp number with the product name, SKU, price, variant, and product URL.

---

## 📦 How to Add, Edit, or Remove Products

All products are defined in:
👉 **[`data/products.ts`](file:///c:/Users/ADMIN/OneDrive/fylter/data/products.ts)**

### To Add a New Product:
Simply add a new object to the `products` array:

```typescript
{
  id: "fyl-013",
  slug: "ceramic-mineral-gravity-water-filter", // Unique URL slug: /products/your-slug
  sku: "FYL-013",                             // Product SKU shown on website & WhatsApp
  name: "Ceramic Mineral Gravity Water Filter",
  category: "Home & Living",                  // "Home & Living" | "Lifestyle & Wellness" | "Tech Accessories" | "Travel & Outdoor"
  price: 2499,                                // Price in INR
  oldPrice: 3499,                             // Optional original price for strike-through
  discount: 28,                               // Discount percentage badge
  images: [
    "/products/fyl-013-1.webp",               // Primary image
    "/products/fyl-013-2.webp"                // Gallery images
  ],
  shortDescription: "Gravity-fed benchtop water purifier with natural activated carbon and silver-infused ceramic.",
  description: "Detailed description of the product, materials, and benefits...",
  features: [
    "0.2 Micron ceramic filtration",
    "Removes 99.9% of bacteria and heavy metals",
    "No electricity or plumbing required"
  ],
  specifications: {
    "Capacity": "12 Liters",
    "Filter Lifespan": "12 Months (5,000 Liters)",
    "Body Material": "Food-grade 304 Stainless Steel"
  },
  variants: [
    { name: "Capacity", values: ["8.5 Liters", "12 Liters"] },
    { name: "Finish", values: ["Brushed Steel", "Teal Powder Coat"] }
  ],
  featured: true,    // Set to true to show on Home page "Curated For You"
  trending: true,    // Set to true to show in the "Trending Now" carousel
  newArrival: true,  // Set to true to mark with a "New" badge
  stockStatus: "In Stock", // "In Stock" | "Low Stock" | "Pre-Order"
  rating: 4.9,
  reviewsCount: 42
}
```

### To Change a Price:
Open [`data/products.ts`](file:///c:/Users/ADMIN/OneDrive/fylter/data/products.ts), locate the product, and update `price` and `oldPrice`.

### To Add Product Images:
1. Place image files into [`public/products/`](file:///c:/Users/ADMIN/OneDrive/fylter/public/products/) (e.g. `public/products/fyl-013-1.webp`).
2. Add the path in the product's `images` array: `["/products/fyl-013-1.webp", "/products/fyl-013-2.webp"]`.
3. High-resolution WebP, JPG, or PNG formats are supported.

---

## 📱 WhatsApp & Instagram Ordering Flow

1. **WhatsApp Order**:
   - Product name, SKU, price, selected variant, and canonical product link are URL-encoded into:
   - `https://wa.me/{WHATSAPP_NUMBER}?text={ENCODED_MESSAGE}`
2. **Instagram Order**:
   - Customers click "ORDER ON INSTAGRAM" to open your profile.
   - Built-in "Copy Product Code" copies the SKU directly to the clipboard with one tap so customers can paste it into Instagram DMs.
3. **Sticky Mobile Order Bar**:
   - On mobile devices, a sticky bar remains pinned to the bottom of the product page for instant order placement without obscuring specifications.

---

## 🏛️ Architecture & Data Flow

```
┌─────────────────────────────────┐       ┌───────────────────────────────┐
│  data/products.ts &             │       │      Browser LocalStorage     │
│  config/site.ts                 │       │    (fylter_admin_* keys)      │
└───────────────┬─────────────────┘       └───────────────┬───────────────┘
                │                                         │
                ▼                                         ▼
      ┌─────────────────────────────────────────────────────────┐
      │          AdminContext (context/AdminContext.tsx)        │
      │    - Hydrates initial products and config               │
      │    - Merges local edits in real time                    │
      └───────┬──────────────────┬──────────────────┬───────────┘
              │                  │                  │
              ▼                  ▼                  ▼
      ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
      │  Home Page    │  │   Shop Page   │  │Product Detail │
      │(app/page.tsx) │  │(app/shop/...) │  │(app/products) │
      └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ WhatsApp Direct Order │
                     │   (wa.me URL action)  │
                     └───────────────────────┘
```

1. **State Hydration:** When a user visits the storefront, [AdminContext.tsx](file:///c:/Users/ADMIN/OneDrive/fylter/context/AdminContext.tsx) bootstraps defaults from [data/products.ts](file:///c:/Users/ADMIN/OneDrive/fylter/data/products.ts) and [config/site.ts](file:///c:/Users/ADMIN/OneDrive/fylter/config/site.ts).
2. **Unified Data Source:** Home (`/`), Shop (`/shop`), and Product Detail (`/products/[slug]`) pages read through `AdminContext`.
3. **Checkout Transformation:** Selecting variants and clicking **"Order on WhatsApp"** executes `getWhatsAppOrderUrl()` which generates an encoded payload including SKU, Title, Variant, and canonical link directly to the merchant's WhatsApp.

---

## 🔐 Environment Configuration

Copy [.env.example](file:///c:/Users/ADMIN/OneDrive/fylter/.env.example) to `.env.local` to override brand details or admin settings without editing code:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_NAME` | Brand Name displayed across pages | `Fylter` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Receiving phone number for orders (no +) | `919747378958` |
| `NEXT_PUBLIC_WHATSAPP_DISPLAY` | Human-readable formatted phone number | `+91 97473 78958` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Direct profile URL for Instagram orders | `https://instagram.com/fylter.in` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Official support email | `fyltershipping@gmail.com` |

---

## 🛡️ Error Tracking & Live Telemetry

* **Client Error Boundary:** [`app/error.tsx`](file:///c:/Users/ADMIN/OneDrive/fylter/app/error.tsx) catches uncaught client-side rendering exceptions, displays a fallback recovery interface, and automatically POSTs stack traces and URL metadata to the server telemetry pipeline.
* **Server Telemetry Endpoint:** [`app/api/telemetry/error/route.ts`](file:///c:/Users/ADMIN/OneDrive/fylter/app/api/telemetry/error/route.ts) logs caught client exceptions to server stdout and forwards alerts to `ERROR_WEBHOOK_URL` (Discord / Slack / Sentry / Datadog) if defined in `.env.local`.
* **Sentry Integration:** For comprehensive performance tracking and session replays:
  ```bash
  npx @sentry/wizard@latest -i nextjs
  ```

---

## 🔒 Security & Admin Authentication

* **Server-side PIN Verification:** [`app/api/admin/auth/route.ts`](file:///c:/Users/ADMIN/OneDrive/fylter/app/api/admin/auth/route.ts) validates PIN entries against `ADMIN_PIN` from server environment variables rather than relying solely on client-side hash comparison.
* **HttpOnly Session Cookies:** Validated admin sessions receive an `httpOnly`, `sameSite=lax` cookie with a 2-hour sliding window.
#   f y l t e r d r o p  
 #   f y l t e r d r o p  
 