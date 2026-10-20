import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppSupportUrl } from "@/config/site";
import { Sparkles, ShieldCheck, HeartHandshake, Eye, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { categoryMeta } from "@/data/products";

export const metadata = {
  title: "About Us | Fylter",
  description:
    "Meet Fylter: a happy little shop for aesthetic stationery, playful finds, and clever everyday things.",
};

const pillars = [
  {
    icon: <Eye className="w-5 h-5" />,
    iconClass: "text-fylter-gold",
    title: "Aesthetic Curation",
    body: "We look for the lovely details: playful paper goods, useful little upgrades, and gifts that feel special.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    iconClass: "text-emerald-400",
    title: "Little Details Matter",
    body: "We want every find to feel thoughtful, useful, and joyful to bring into your everyday.",
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-fylter-lightGold" />,
    iconClass: "text-fylter-lightGold",
    title: "Human Communication",
    body: "No robot gatekeepers. Message us directly on WhatsApp or Instagram whenever you need a hand.",
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
            A little delight, by <span className="gold-gradient-text">design.</span>
          </h1>
          <p className="text-lg text-fylter-muted max-w-2xl mx-auto leading-relaxed">
            Fylter is a happy little shop for things that make everyday life feel a bit more you:
            pretty paper, playful surprises, and clever finds.
          </p>
        </div>

        <hr className="section-divider" />

        {/* ── Mission + Image ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Image frame */}
          <div className="md:col-span-6">
            <Card className="rounded-2xl overflow-hidden border-fylter-gold/30 shadow-xl aspect-square p-0">
              <Image
                src={categoryMeta[0].image}
                alt="A cozy desk ready for creative moments"
                fill
                className="object-cover"
              />
            </Card>
          </div>

          {/* Copy */}
          <div className="md:col-span-6 space-y-4 text-sm text-fylter-muted leading-relaxed animate-slide-up">
            <h2 className="text-2xl font-bold text-fylter-offWhite">
              Made for your little everyday moments
            </h2>
            <p>
              We believe small things can make an ordinary day feel brighter: a notebook you love,
              a thoughtful gift, or a clever find that makes a routine easier.
            </p>
            <p>
              We built Fylter to make discovering those little things feel easy and personal.
              Explore the edit, find a new favourite, and reach out to a real person whenever
              you need a hand.
            </p>
            <p>
              Every order comes with thoughtful support and delivery across India, from our first
              hello to the moment your new find reaches your door.
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
            Ready to find your next little lovely?
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
