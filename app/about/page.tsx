import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, getWhatsAppSupportUrl } from "@/config/site";
import { Sparkles, ShieldCheck, HeartHandshake, Eye, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";

export const metadata = {
  title: "About Us | Fylter",
  description:
    "Learn the story of Fylter and our mission to deliver Purely Filters with unmatched aesthetics and simplicity.",
};

const pillars = [
  {
    icon: <Eye className="w-5 h-5" />,
    iconClass: "text-fylter-gold",
    title: "Aesthetic Curation",
    body: "Every item in our catalog is chosen not just for its micron-level efficacy, but for how elegantly it sits on your desk, vanity, or kitchen counter.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    iconClass: "text-emerald-400",
    title: "Verified Integrity",
    body: "From DuPont SPE/PEM electrolysis membranes to H13 True HEPA filters, our specifications are honest, rigorous, and lab-verified.",
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-fylter-lightGold" />,
    iconClass: "text-fylter-lightGold",
    title: "Human Communication",
    body: "No robot gatekeepers. Message us directly on WhatsApp to confirm delivery dates, ask about replacement filters, and pay securely.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* ── Hero ── */}
        <div className="text-center space-y-4 animate-fade-in">
          <span className="section-label">
            <Sparkles className="w-3.5 h-3.5" />
            Our Origin
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-fylter-offWhite tracking-tight">
            The Philosophy of <span className="gold-gradient-text">Fylter</span>
          </h1>
          <p className="text-lg text-fylter-muted max-w-2xl mx-auto leading-relaxed">
            In a world inundated with micro-pollutants and complicated checkout funnels, Fylter was
            created with a single uncompromising mantra:{" "}
            <strong className="text-fylter-gold">Purely Filters.</strong>
          </p>
        </div>

        <hr className="section-divider" />

        {/* ── Mission + Image ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Image frame */}
          <div className="md:col-span-6">
            <Card className="rounded-2xl overflow-hidden border-fylter-gold/30 shadow-xl aspect-square p-0">
              <Image
                src="/assets/fylter-logo.jpeg"
                alt="FYLTER Brandmark"
                fill
                className="object-cover"
              />
            </Card>
          </div>

          {/* Copy */}
          <div className="md:col-span-6 space-y-4 text-sm text-fylter-muted leading-relaxed animate-slide-up">
            <h2 className="text-2xl font-bold text-fylter-offWhite">
              Designed For Intentional Living
            </h2>
            <p>
              We believe that filtration is not just an appliance feature—it is the baseline for how
              we experience our home, our water, our workspaces, and our travels.
            </p>
            <p>
              Traditional ecommerce platforms force shoppers through confusing cart flows, generic
              inventory catalogs, and impersonal customer support bots. We set out to build an
              intimate boutique experience: discovering thoughtfully curated lifestyle and filtration
              products, paired with instant one-on-one ordering on WhatsApp and Instagram.
            </p>
            <p>
              When you purchase from Fylter, you are speaking directly to dedicated specialists who
              verify your requirements, share actual product videos, and guarantee seamless doorstep
              delivery across India.
            </p>
          </div>
        </div>

        <hr className="section-divider" />

        {/* ── Pillars ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <Card
              key={p.title}
              className="p-6 rounded-2xl border-fylter-border/40 hover:border-fylter-gold/50 transition-all duration-300"
            >
              <div className="p-3 w-fit rounded-lg glass-gold border border-fylter-gold/30 mb-4">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-fylter-offWhite">{p.title}</h3>
              <p className="text-xs text-fylter-muted mt-2 leading-relaxed">{p.body}</p>
            </Card>
          ))}
        </div>

        <hr className="section-divider" />

        {/* ── CTA ── */}
        <div className="p-10 rounded-2xl glass-panel border border-fylter-gold/35 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-fylter-offWhite">
            Ready to upgrade your everyday?
          </h2>
          <p className="text-sm text-fylter-muted max-w-lg mx-auto">
            Explore our curated catalog or reach out to our team with any custom requests.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="btn-3d-gold px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getWhatsAppSupportUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-whatsapp px-6 py-3 text-white font-semibold text-xs uppercase tracking-wider"
            >
              Chat With Our Team
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
