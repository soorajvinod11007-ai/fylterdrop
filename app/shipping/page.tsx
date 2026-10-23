import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";
import { shippingPolicy } from "@/config/site";

export const metadata = {
  title: "Shipping Information",
  description: "Learn about Fylter's delivery timelines, courier partners, and pan-India shipping policy.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-fylter-darkest py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-fylter-gold font-semibold">
            Customer Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fylter-offWhite mt-1">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-fylter-muted mt-2">
            Last updated: October 2026 • Applicable across all states & union territories of India.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-xl bg-fylter-secondary/40 border border-fylter-border/40">
            <Truck className="w-5 h-5 text-fylter-gold mb-2" />
            <h3 className="text-sm font-bold text-fylter-offWhite">Free Express Shipping</h3>
            <p className="text-xs text-fylter-muted mt-1">
              Orders of ₹{shippingPolicy.freeShippingMinimum} and above qualify for free shipping.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-fylter-secondary/40 border border-fylter-border/40">
            <Clock className="w-5 h-5 text-fylter-gold mb-2" />
            <h3 className="text-sm font-bold text-fylter-offWhite">{shippingPolicy.deliveryTime} Delivery</h3>
            <p className="text-xs text-fylter-muted mt-1">
              Delivery typically takes {shippingPolicy.deliveryTime} across India.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-fylter-secondary/40 border border-fylter-border/40">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="text-sm font-bold text-fylter-offWhite">Insured Transit</h3>
            <p className="text-xs text-fylter-muted mt-1">Every package is securely sealed and insured against transit damages.</p>
          </div>
          <div className="p-5 rounded-xl bg-fylter-secondary/40 border border-fylter-border/40">
            <MapPin className="w-5 h-5 text-fylter-gold mb-2" />
            <h3 className="text-sm font-bold text-fylter-offWhite">Order Charges</h3>
            <p className="text-xs text-fylter-muted mt-1">
              Orders below ₹{shippingPolicy.freeShippingMinimum} have a ₹{shippingPolicy.lowOrderHandlingCharge} handling charge.
              Cash on Delivery adds ₹{shippingPolicy.cashOnDeliveryCharge}.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-fylter-muted leading-relaxed border-t border-fylter-border/30 pt-8">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">1. Order Processing Time</h2>
            <p>
              Once your order is confirmed via WhatsApp or Instagram, our dispatch warehouse verifies stock and packages your items within 24 to 48 hours. Orders placed on Sundays or national holidays are dispatched on the following business day.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">2. Live Tracking Updates</h2>
            <p>
              Immediately upon carrier handover (Blue Dart, Delhivery, DTDC, or Xpressbees), we send your Air Waybill (AWB) number and direct tracking link right inside your active WhatsApp or Instagram conversation. You can track your shipment door-to-door at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">3. Delivery Fees</h2>
            <p>
              Orders totaling ₹{shippingPolicy.freeShippingMinimum} or more qualify for free doorstep shipping across India. Orders below ₹{shippingPolicy.freeShippingMinimum} have a ₹{shippingPolicy.lowOrderHandlingCharge} handling charge. Cash on Delivery orders have an additional ₹{shippingPolicy.cashOnDeliveryCharge} COD charge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">4. Cash on Delivery</h2>
            <p>
              Cash on Delivery is available for eligible orders and pin codes and adds a ₹{shippingPolicy.cashOnDeliveryCharge} charge to the order.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-fylter-offWhite">5. Damaged or Tampered Parcels</h2>
            <p>
              If your parcel appears visibly torn or tampered upon arrival, please take a quick photo before opening and notify our team on WhatsApp within 24 hours. We will initiate an immediate replacement dispatch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
