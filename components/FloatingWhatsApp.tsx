"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { getWhatsAppSupportUrl } from "@/config/site";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const { siteSettings } = useAdmin();
  const whatsappUrl = getWhatsAppSupportUrl(undefined, {
    whatsappNumber: siteSettings.whatsappNumber,
    brandName: siteSettings.name,
  });

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with the ${siteSettings.name} team on WhatsApp`}
      className="floating-concierge"
    >
      <MessageCircle aria-hidden="true" />
      <span>Talk to us</span>
    </a>
  );
}
