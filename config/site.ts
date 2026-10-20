/**
 * FYLTER - Central Site Configuration
 * 
 * Update these details to change brand contacts, WhatsApp numbers,
 * and social profiles across the entire website in one place.
 */

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  whatsappNumber: string; // Format: country code + number, e.g. 919876543210
  whatsappDisplayNumber: string;
  instagramUrl: string;
  instagramUsername: string;
  email: string;
  currency: string;
  currencySymbol: string;
  location: string;
  operatingHours: string;
}

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Fylter",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Purely Filters",
  description: "Curated everyday essentials, aesthetic finds, and high-performance filters worth bringing home.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fylter.in",
  // Change your WhatsApp ordering number here (include country code without +):
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919747378958",
  whatsappDisplayNumber: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+91 9747378958",
  // Change your Instagram profile link here:
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/fylter.in",
  instagramUsername: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "@fylter.in",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "fyltershipping@gmail.com",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "INR",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹",
  location: "India",
  operatingHours: "10:00 AM – 8:00 PM IST (Mon–Sat)",
};

/**
 * Generate a pre-filled WhatsApp ordering URL with product metadata.
 */
export function getWhatsAppOrderUrl({
  productName,
  sku,
  price,
  selectedVariant,
  productUrl,
  whatsappNumber,
  brandName,
}: {
  productName: string;
  sku: string;
  price: number;
  selectedVariant?: string;
  productUrl?: string;
  whatsappNumber?: string;
  brandName?: string;
}): string {
  const targetNumber = whatsappNumber || siteConfig.whatsappNumber;
  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");
  const targetBrand = brandName || siteConfig.name;

  let message = `Hello ${targetBrand} 👋\n\nI am interested in ordering this product:\n\n• Product: ${productName}\n• SKU: ${sku}\n• Price: ₹${price.toLocaleString("en-IN")}`;

  if (selectedVariant) {
    message += `\n• Selected Variant: ${selectedVariant}`;
  }

  if (productUrl) {
    message += `\n• Link: ${productUrl}`;
  }

  message += `\n\nPlease share availability, delivery details, and payment options. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a general WhatsApp inquiry URL.
 */
export function getWhatsAppSupportUrl(topic?: string, options?: { whatsappNumber?: string; brandName?: string }): string {
  const targetNumber = options?.whatsappNumber || siteConfig.whatsappNumber;
  const targetBrand = options?.brandName || siteConfig.name;
  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");
  const text = topic
    ? `Hello ${targetBrand} 👋 I have a question regarding: ${topic}`
    : `Hello ${targetBrand} 👋 I would like to ask about your products and services.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a formatted inquiry URL from contact form submissions.
 */
export function getWhatsAppContactInquiryUrl({
  name,
  phone,
  email,
  message,
  whatsappNumber,
  brandName,
}: {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  whatsappNumber?: string;
  brandName?: string;
}): string {
  const targetNumber = whatsappNumber || siteConfig.whatsappNumber;
  const targetBrand = brandName || siteConfig.name;
  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");
  const msg = `Hello ${targetBrand} Team 👋\n\nNew Inquiry from Website Contact Form:\n• Name: ${name}\n• Phone: ${phone || "N/A"}\n• Email: ${email || "N/A"}\n\nMessage:\n"${message}"`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
}

