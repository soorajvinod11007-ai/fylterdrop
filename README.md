# FYLTER — Little finds, big happy

A Pinterest-inspired lifestyle shop for aesthetic stationery, cute novelty finds, smart everyday products, and a dedicated Kids Corner. Built with Next.js 14, TypeScript, and Tailwind CSS.

Customers can discover products by collection and order through **WhatsApp** or **Instagram**.

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

## 🚀 Deploying to Vercel with Shared Product Storage

The storefront can run without a database, but product edits will then remain in the current browser. To share products across visitors and devices:

1. Create a Supabase project and run all SQL migrations in `supabase/migrations/` in order using its SQL Editor. This sets up the shared catalog, admin rate limiting, and the public-read `product-images` bucket.
2. Import this repository into Vercel and configure these server-side environment variables for Production (and Preview if needed):
   - `SUPABASE_URL` — the Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` — the project service-role key. Keep it server-only; never use a `NEXT_PUBLIC_` prefix.
   - `ADMIN_PIN` — a private passphrase of at least 12 characters.
   - `ADMIN_SESSION_SECRET` — a random secret used to sign admin sessions (at least 32 random bytes, e.g. generated with `openssl rand -base64 48`).
   - `NEXT_PUBLIC_SITE_URL` — `https://fylter.in`.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the Supabase anon/public API key. This is safe to expose in the browser; never use the service-role key here.
3. Deploy the project. The first catalog request initializes the shared catalog with the products in `data/products.ts` if the database row is empty.
4. In Vercel project settings, add `fylter.in` and `www.fylter.in` if desired. Update the domain registrar with the exact DNS records Vercel displays, then wait for Vercel to verify the domain and issue HTTPS.
5. Open `/admin` and sign in using `ADMIN_PIN`. Product changes are shared when the Admin page reports that the shared catalog is connected. Login attempts are rate-limited using the Supabase-backed migration.

Do not commit real environment values or put Supabase service-role credentials in client-side variables. The `.env.example` file contains blank placeholders only. If Supabase is unavailable or not configured, product edits stay in that browser and the Admin page displays the storage status.

### Product Image Uploads

Admin image uploads are optimized to WebP (up to 1200 px) and uploaded directly to the Supabase `product-images` bucket using short-lived signed upload URLs. The bucket is public-read so storefront visitors can load product photos; only the authenticated admin API can create upload URLs. Individual source files are limited to 10 MB, and Supabase free-tier storage and bandwidth quotas still apply. Existing externally hosted image URLs continue to work.

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
  slug: "pastel-desk-planner",                // Unique URL slug: /products/your-slug
  sku: "FYL-013",                             // Product SKU shown on website & WhatsApp
  name: "Pastel Desk Planner",
  category: "Aesthetic Stationery",            // "Aesthetic Stationery" | "Cute Novelty" | "Smart Everyday"
  kidsCollection: false,                      // Set true to also show it in Kids Corner
  price: 499,                                  // Price in INR
  oldPrice: 699,                               // Optional original price for strike-through
  discount: 29,                                // Discount percentage badge
  images: [
    "/products/fyl-013-1.webp",               // Primary image
    "/products/fyl-013-2.webp"                // Gallery images
  ],
  shortDescription: "A soft pastel planner for happy, organized days.",
  description: "Describe the product, materials, and benefits...",
  features: [
    "Undated weekly and monthly layouts",
    "Smooth, easy-to-write pages",
    "Compact size for a desk or tote"
  ],
  specifications: {
    "Pages": "120",
    "Cover": "Soft-touch cardstock",
    "Size": "A5"
  },
  variants: [
    { name: "Color", values: ["Blush Pink", "Lavender"] }
  ],
  featured: true,    // Set to true to feature on the home page
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
Storefront pages ──> AdminContext ──> /api/catalog ──> Supabase catalog
                           │
                           └── browser localStorage fallback when shared storage is unavailable
Admin UI ──> signed HTTP-only admin session ──> authenticated catalog writes
Admin image upload ──> signed upload URL ──> Supabase Storage
```

1. **State Hydration:** [AdminContext.tsx](file:///c:/Users/ADMIN/OneDrive/fylter/context/AdminContext.tsx) loads shared catalog data through `/api/catalog`; [data/products.ts](file:///c:/Users/ADMIN/OneDrive/fylter/data/products.ts) seeds a new catalog, while localStorage is a browser-only fallback.
2. **Unified Data Source:** Storefront pages read products through `AdminContext`; Admin edits are written to Supabase only after server-side session validation.
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