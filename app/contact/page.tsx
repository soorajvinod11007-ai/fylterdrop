"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { getWhatsAppSupportUrl, getWhatsAppContactInquiryUrl } from "@/config/site";
import { MessageCircle, Instagram, Mail, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Input, Toast } from "@/components/ui";

export default function ContactPage() {
  const { siteSettings } = useAdmin();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waUrl = getWhatsAppContactInquiryUrl({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    });
    window.open(waUrl, "_blank");
    setSubmitted(true);
  };

  const field = "w-full px-4 py-2.5 rounded-xl bg-fylter-darkest/90 border border-fylter-border/60 text-fylter-offWhite text-sm focus:outline-none focus:border-fylter-gold transition-colors";

  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3 animate-fade-in">
          <span className="section-label">Direct Concierge</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fylter-offWhite tracking-tight">
            Connect With <span className="gold-gradient-text">Fylter</span>
          </h1>
          <p className="text-sm sm:text-base text-fylter-muted">
            We love speaking directly with our customers. Reach out through WhatsApp, Instagram, or
            send us a quick note below.
          </p>
        </div>

        <hr className="section-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ── Direct channels ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp */}
            <a
              href={getWhatsAppSupportUrl(undefined, {
                whatsappNumber: siteSettings.whatsappNumber,
                brandName: siteSettings.name,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl glass-card card-3d border border-emerald-500/30 hover:border-emerald-400 block transition-all group shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-600/30 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fylter-offWhite group-hover:text-emerald-300 transition-colors">
                    Official WhatsApp Ordering
                  </h3>
                  <p className="text-xs text-fylter-muted mt-1">
                    Instant inquiries, live product videos, and quick checkout assistance.
                  </p>
                  <span className="text-xs font-semibold text-emerald-400 mt-2 block">
                    {siteSettings.whatsappDisplayNumber} →
                  </span>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl glass-card card-3d border border-fylter-gold/30 hover:border-fylter-gold block transition-all group shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl glass-gold border border-fylter-gold/30 text-fylter-gold group-hover:bg-fylter-gold group-hover:text-fylter-darkest transition-colors shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-fylter-offWhite group-hover:text-fylter-gold transition-colors">
                    Instagram Direct Messages
                  </h3>
                  <p className="text-xs text-fylter-muted mt-1">
                    Follow product drops, tag us in stories, or send screenshots to order.
                  </p>
                  <span className="text-xs font-semibold text-fylter-paleGold mt-2 block">
                    {siteSettings.instagramUsername} →
                  </span>
                </div>
              </div>
            </a>

            {/* Operating info */}
            <div className="p-6 rounded-2xl glass-panel border border-fylter-border/30 space-y-4 text-xs text-fylter-muted">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-fylter-gold shrink-0" />
                <span>
                  Operating Hours:{" "}
                  <strong className="text-fylter-offWhite">{siteSettings.operatingHours}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-fylter-gold shrink-0" />
                <span>
                  Official Email:{" "}
                  <strong className="text-fylter-offWhite">{siteSettings.email}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-fylter-gold shrink-0" />
                <span>
                  Dispatch Centers:{" "}
                  <strong className="text-fylter-offWhite">Pan-India Warehouses</strong>
                </span>
              </div>
            </div>
          </div>

          {/* ── Inquiry Form ── */}
          <div className="lg:col-span-7 p-8 rounded-2xl glass-panel border border-fylter-border/50">
            <h2 className="text-xl font-bold text-fylter-offWhite mb-1">Send a Direct Note</h2>
            <p className="text-xs text-fylter-muted mb-6">
              Fill in your details below and click Send. This will instantly format your request and
              open our direct WhatsApp conversation.
            </p>

            {submitted && (
              <div className="mb-6">
                <Toast
                  variant="success"
                  message="Your WhatsApp chat has opened with the formatted inquiry! Our team will respond shortly."
                  onClose={() => setSubmitted(false)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-fylter-muted mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className={field}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fylter-muted mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fylter-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className={field}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fylter-muted mb-1.5">
                  How can we help you? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the product you are interested in or questions about delivery..."
                  className={`${field} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="btn-3d-gold w-full sm:w-auto px-8 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp Concierge</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
