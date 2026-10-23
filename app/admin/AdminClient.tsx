"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { SiteConfig } from "@/config/site";
import { getProductPath, productCategories, type Product, type ProductVariant } from "@/data/products";
import Link from "next/link";
import { Toast as DSToast, Badge, Card } from "@/components/ui";
import {
  Settings,
  Package,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  X,
  Instagram,
  MessageCircle,
  Mail,
  Globe,
  Clock,
  MapPin,
  Tag,
  Image as ImageIcon,
  Star,
  ShieldCheck,
  Lock,
  LogOut,
  KeyRound,
} from "lucide-react";
import ProductImageManager from "@/components/admin/ProductImageManager";

// ─── Toast is now handled by the design-system DSToast component ──
// (imported above)

// ─── Secure Auth Gate ─────────────────────────────────────────────
function AdminAuth({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying || !pin.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      // 1. Validate against secure server route
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        onAuth();
        setIsVerifying(false);
        return;
      }

      if (res.status !== 401) {
        setError(data?.message || "Admin authentication is unavailable.");
        return;
      }

      setError("Incorrect PIN. Try again.");
      setPin("");
    } catch (requestError) {
      console.error("[Admin] Authentication request failed:", requestError);
      setError("Could not reach the authentication service. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-fylter-darkest flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-2xl glass-panel border border-fylter-gold/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl glass-gold flex items-center justify-center shadow-lg shadow-fylter-gold/10">
            <Lock className="w-8 h-8 text-fylter-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-fylter-offWhite tracking-tight">Admin Vault</h1>
            <p className="text-xs text-fylter-muted mt-1">Encrypted administrative access control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={128}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter admin passphrase"
              className={`w-full px-4 py-3 rounded-xl bg-fylter-darkest border text-center text-2xl tracking-[0.4em] font-bold text-fylter-offWhite placeholder:text-fylter-muted/40 placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500/60 focus:ring-red-500/30"
                  : "border-fylter-border/50 focus:ring-fylter-gold/40 focus:border-fylter-gold/60"
              }`}
              autoFocus
            />

            {error ? (
              <p className="text-xs text-red-400 flex items-center justify-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            ) : (
              <p className="text-[11px] text-fylter-muted/70 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />Server-verified sign-in
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || !pin}
              className="w-full py-3 rounded-xl btn-3d-gold font-bold text-sm tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              {isVerifying ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="pt-2 border-t border-fylter-border/30">
            <Link href="/" className="text-xs text-fylter-muted hover:text-fylter-gold transition-colors flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-3 h-3" /> Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category Options ─────────────────────────────────────────────
const CATEGORIES = productCategories;

const STOCK_OPTIONS = ["In Stock", "Low Stock", "Pre-Order"] as const;

// ─── Main Admin Page ──────────────────────────────────────────────
export default function AdminClient({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const {
    siteSettings,
    products,
    catalogStorage,
    catalogError,
    retryCatalogSync,
    updateSiteSettings,
    updateProduct,
    addProduct,
    deleteProduct,
    resetSiteSettings,
    resetProducts,
    resetAll,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<"site" | "products" | "security">("site");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isAuthed, setIsAuthed] = useState(initialAuthenticated);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Validate the server-signed session cookie before showing admin data.
  useEffect(() => {
    let active = true;
    void fetch("/api/admin/auth", { cache: "no-store" })
      .then((response) => {
        if (active) setIsAuthed(response.ok);
      })
      .catch((error: unknown) => {
        console.error("[Admin] Session verification failed:", error);
        if (active) setIsAuthed(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    void fetch("/api/admin/auth", { method: "DELETE" }).catch((error: unknown) => {
      console.error("[Admin] Could not end the server session:", error);
    });
    setIsAuthed(false);
    setToast({ message: "Admin vault safely locked.", type: "success" });
  };

  // ─── Site Settings Form State ─────────────────────────────────
  const [siteForm, setSiteForm] = useState<SiteConfig>(siteSettings);

  useEffect(() => {
    setSiteForm(siteSettings);
  }, [siteSettings]);

  const handleSiteSave = () => {
    updateSiteSettings(siteForm);
    setToast({ message: "Site settings saved successfully!", type: "success" });
  };

  const handleSiteReset = () => {
    resetSiteSettings();
    setToast({ message: "Site settings reset to defaults.", type: "success" });
  };

  // ─── Product Edit Handlers ────────────────────────────────────
  const handleProductFieldChange = (
    productId: string,
    field: keyof Product,
    value: string | number | boolean | string[] | ProductVariant[] | Record<string, string>
  ) => {
    updateProduct(productId, { [field]: value });
  };

  const handleAddNewProduct = () => {
    const nextId = `fyl-${String(products.length + 1).padStart(3, "0")}`;
    const newProduct: Product = {
      id: nextId,
      slug: `new-product-${Date.now()}`,
      sku: nextId.toUpperCase(),
      name: "New Product",
      category: "Smart Everyday",
      kidsCollection: false,
      isCombo: false,
      comboProductIds: [],
      price: 999,
      images: [],
      shortDescription: "Short description here...",
      description: "Full description here...",
      features: ["Feature 1"],
      specifications: {},
      featured: false,
      trending: false,
      newArrival: true,
      stockStatus: "In Stock",
    };
    addProduct(newProduct);
    setExpandedProduct(nextId);
    setToast({ message: "New product added! Edit its details below.", type: "success" });
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    setDeleteConfirm(null);
    setExpandedProduct(null);
    setToast({ message: "Product deleted.", type: "success" });
  };

  const handleResetProducts = () => {
    resetProducts();
    setExpandedProduct(null);
    setToast({ message: "All products reset to defaults.", type: "success" });
  };

  if (!isAuthed) {
    return <AdminAuth onAuth={() => window.location.assign("/admin")} />;
  }

  if (catalogStorage === "loading") {
    return (
      <div className="min-h-screen bg-fylter-darkest flex items-center justify-center px-4">
        <p className="text-sm font-medium text-fylter-muted" role="status" aria-live="polite">
          Loading the product catalog…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fylter-darkest">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-slide-down w-80">
          <DSToast
            message={toast.message}
            variant={toast.type === "success" ? "success" : "error"}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* ─── Admin Header ──────────────────────────────────── */}
      <div className="bg-fylter-dark border-b border-fylter-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-fylter-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-fylter-offWhite tracking-tight">FYLTER Admin</h1>
                  <Badge variant="emerald">Secured</Badge>
                </div>
              <p className="text-[11px] text-fylter-muted uppercase tracking-widest">Control Center & Content Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg glass-panel border border-fylter-border/50 text-xs text-fylter-paleGold hover:border-fylter-gold/50 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Store</span>
            </Link>
            <button
              onClick={() => {
                resetAll();
                setToast({ message: "Everything reset to factory defaults.", type: "success" });
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-950/30 text-xs text-red-300 hover:border-red-400/50 hover:bg-red-950/50 transition-all"
              title="Reset products and site config to factory state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-fylter-border/60 bg-fylter-darkest/70 text-xs text-fylter-muted hover:text-fylter-gold hover:border-fylter-gold/50 transition-all"
              title="Lock Admin Vault"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("site")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all border-b-2 ${
              activeTab === "site"
                ? "bg-fylter-dark border-fylter-gold text-fylter-gold"
                : "bg-transparent border-transparent text-fylter-muted hover:text-fylter-paleGold"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all border-b-2 ${
              activeTab === "products"
                ? "bg-fylter-dark border-fylter-gold text-fylter-gold"
                : "bg-transparent border-transparent text-fylter-muted hover:text-fylter-paleGold"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all border-b-2 ${
              activeTab === "security"
                ? "bg-fylter-dark border-fylter-gold text-fylter-gold"
                : "bg-transparent border-transparent text-fylter-muted hover:text-fylter-paleGold"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Vault Security</span>
          </button>
        </div>
      </div>

      {/* ─── Content Area ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <div
          className={`mb-5 rounded-xl border p-4 ${
            catalogStorage === "shared"
              ? "border-emerald-500/30 bg-emerald-950/20"
              : catalogStorage === "saving"
                ? "border-blue-400/30 bg-blue-950/20"
                : "border-amber-400/40 bg-amber-950/20"
          }`}
          role={catalogStorage === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-fylter-offWhite">
                {catalogStorage === "shared"
                  ? "Products are shared with your storefront"
                  : catalogStorage === "saving"
                    ? "Saving product changes…"
                    : catalogStorage === "error"
                      ? "Product sync needs attention"
                      : "Browser-only product storage"}
              </p>
              <p className="mt-1 text-xs text-fylter-muted">
                {catalogStorage === "shared"
                  ? "Product edits are saved to the shared catalog."
                  : catalogStorage === "saving"
                    ? "Your latest changes are being synced for all visitors."
                    : catalogStorage === "error"
                      ? catalogError
                      : "Edits only appear in this browser until Supabase is connected in Vercel."}
              </p>
            </div>
            {catalogStorage !== "shared" && catalogStorage !== "saving" ? (
              <button
                type="button"
                onClick={retryCatalogSync}
                className="min-h-10 rounded-lg border border-fylter-border/60 px-4 text-xs font-semibold text-fylter-offWhite transition-colors hover:border-fylter-gold"
              >
                {catalogStorage === "error" ? "Retry connection" : "Check connection"}
              </button>
            ) : null}
          </div>
        </div>
        {activeTab === "site" && (
          <SiteSettingsPanel
            form={siteForm}
            setForm={setSiteForm}
            onSave={handleSiteSave}
            onReset={handleSiteReset}
          />
        )}
        {activeTab === "products" && (
          <ProductsPanel
            products={products}
            expandedProduct={expandedProduct}
            setExpandedProduct={setExpandedProduct}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            onFieldChange={handleProductFieldChange}
            onAdd={handleAddNewProduct}
            onDelete={handleDeleteProduct}
            onReset={handleResetProducts}
          />
        )}
        {activeTab === "security" && (
          <SecurityPanel onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

// ─── Vault Security Panel ─────────────────────────────────────────
function SecurityPanel({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl glass-panel border border-fylter-gold/30">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Server-verified session
            </span>
            <h3 className="text-xl font-extrabold text-fylter-offWhite tracking-tight">
              Admin access settings
            </h3>
            <p className="text-xs text-fylter-muted mt-1 leading-relaxed">
              Admin access is checked by the server and expires after two hours. Keep your deployment secrets private.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-950/40 text-xs font-bold text-red-300 hover:bg-red-950/70 transition-all shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Session Now</span>
          </button>
        </div>
        <div className="mt-6 border-t border-fylter-border/30 pt-5">
          <h4 className="text-sm font-bold text-fylter-offWhite">Change the admin PIN</h4>
          <p className="mt-1 text-xs leading-relaxed text-fylter-muted">
            Update the ADMIN_PIN environment variable in Vercel, then redeploy. Never use a default or easily guessed PIN.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Input Field Components ──────────────────────────────────────
function FieldLabel({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-fylter-paleGold uppercase tracking-wider mb-1.5">
      <Icon className="w-3.5 h-3.5 text-fylter-gold" />
      {label}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite placeholder:text-fylter-muted/40 focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite placeholder:text-fylter-muted/40 focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all resize-y"
    />
  );
}

// ─── Site Settings Panel ─────────────────────────────────────────
function SiteSettingsPanel({
  form,
  setForm,
  onSave,
  onReset,
}: {
  form: SiteConfig;
  setForm: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onSave: () => void;
  onReset: () => void;
}) {
  const update = (field: keyof SiteConfig, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Brand & General */}
      <div className="p-6 rounded-2xl glass-panel border border-fylter-border/40">
        <h3 className="text-base font-bold text-fylter-offWhite mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-fylter-gold" />
          Brand & General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel icon={Tag} label="Brand Name" />
            <TextInput value={form.name} onChange={(v) => update("name", v)} placeholder="Fylter" />
          </div>
          <div>
            <FieldLabel icon={Tag} label="Tagline" />
            <TextInput value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="Little finds, big happy" />
          </div>
          <div className="md:col-span-2">
            <FieldLabel icon={Tag} label="Description" />
            <TextArea value={form.description} onChange={(v) => update("description", v)} rows={2} />
          </div>
          <div>
            <FieldLabel icon={Globe} label="Website URL" />
            <TextInput value={form.url} onChange={(v) => update("url", v)} placeholder="https://fylter.in" />
          </div>
          <div>
            <FieldLabel icon={MapPin} label="Location" />
            <TextInput value={form.location} onChange={(v) => update("location", v)} placeholder="India" />
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="p-6 rounded-2xl glass-panel border border-fylter-border/40">
        <h3 className="text-base font-bold text-fylter-offWhite mb-5 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          Contact & Social Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel icon={MessageCircle} label="WhatsApp Number (with country code)" />
            <TextInput
              value={form.whatsappNumber}
              onChange={(v) => update("whatsappNumber", v)}
              placeholder="919876543210"
            />
            <p className="text-[11px] text-fylter-muted mt-1">Format: country code + number without + or spaces (e.g., 919876543210)</p>
          </div>
          <div>
            <FieldLabel icon={MessageCircle} label="WhatsApp Display Number" />
            <TextInput
              value={form.whatsappDisplayNumber}
              onChange={(v) => update("whatsappDisplayNumber", v)}
              placeholder="+91 98765 43210"
            />
            <p className="text-[11px] text-fylter-muted mt-1">Shown to visitors in the footer and contact page</p>
          </div>
          <div>
            <FieldLabel icon={Instagram} label="Instagram Profile URL" />
            <TextInput
              value={form.instagramUrl}
              onChange={(v) => update("instagramUrl", v)}
              placeholder="https://instagram.com/fylter.in"
            />
          </div>
          <div>
            <FieldLabel icon={Instagram} label="Instagram Username" />
            <TextInput
              value={form.instagramUsername}
              onChange={(v) => update("instagramUsername", v)}
              placeholder="@fylter.in"
            />
          </div>
          <div>
            <FieldLabel icon={Mail} label="Support Email" />
            <TextInput value={form.email} onChange={(v) => update("email", v)} placeholder="support@fylter.in" />
          </div>
          <div>
            <FieldLabel icon={Clock} label="Operating Hours" />
            <TextInput
              value={form.operatingHours}
              onChange={(v) => update("operatingHours", v)}
              placeholder="10:00 AM – 8:00 PM IST"
            />
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="p-6 rounded-2xl glass-panel border border-fylter-border/40">
        <h3 className="text-base font-bold text-fylter-offWhite mb-5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-fylter-gold" />
          Currency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel icon={Tag} label="Currency Code" />
            <TextInput value={form.currency} onChange={(v) => update("currency", v)} placeholder="INR" />
          </div>
          <div>
            <FieldLabel icon={Tag} label="Currency Symbol" />
            <TextInput value={form.currencySymbol} onChange={(v) => update("currencySymbol", v)} placeholder="₹" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-fylter-border/50 text-sm text-fylter-muted hover:text-fylter-offWhite hover:border-fylter-border transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Default</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg btn-3d-gold text-sm font-bold tracking-wider uppercase"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}

// ─── Products Panel ──────────────────────────────────────────────
function ProductsPanel({
  products,
  expandedProduct,
  setExpandedProduct,
  deleteConfirm,
  setDeleteConfirm,
  onFieldChange,
  onAdd,
  onDelete,
  onReset,
}: {
  products: Product[];
  expandedProduct: string | null;
  setExpandedProduct: (id: string | null) => void;
  deleteConfirm: string | null;
  setDeleteConfirm: (id: string | null) => void;
  onFieldChange: (id: string, field: keyof Product, value: any) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Products Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-fylter-muted">
          Managing <span className="text-fylter-gold font-bold">{products.length}</span> products
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-fylter-border/50 text-xs text-fylter-muted hover:text-fylter-offWhite hover:border-fylter-border transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Products</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-lg btn-3d-gold text-xs font-bold tracking-wider uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product List */}
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-2xl glass-panel border border-fylter-border/40 overflow-hidden transition-all hover:border-fylter-gold/30"
        >
          {/* Collapsed Header */}
          <button
            onClick={() =>
              setExpandedProduct(expandedProduct === product.id ? null : product.id)
            }
            className="w-full flex items-center justify-between px-5 py-4 text-left group"
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-fylter-darkest border border-fylter-border/30 overflow-hidden shrink-0">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-fylter-muted/50" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-fylter-offWhite truncate group-hover:text-fylter-gold transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-fylter-muted">
                  <span>{product.sku}</span>
                  <span className="w-1 h-1 rounded-full bg-fylter-border" />
                  <span>₹{product.price.toLocaleString("en-IN")}</span>
                  <span className="w-1 h-1 rounded-full bg-fylter-border" />
                  <span className={`${
                    product.stockStatus === "In Stock" ? "text-emerald-400" :
                    product.stockStatus === "Low Stock" ? "text-amber-400" : "text-blue-400"
                  }`}>{product.stockStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {product.featured && (
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] bg-fylter-gold/15 text-fylter-gold font-bold uppercase">
                  Featured
                </span>
              )}
              {expandedProduct === product.id ? (
                <ChevronDown className="w-5 h-5 text-fylter-gold" />
              ) : (
                <ChevronRight className="w-5 h-5 text-fylter-muted group-hover:text-fylter-gold transition-colors" />
              )}
            </div>
          </button>

          {/* Expanded Editor */}
          {expandedProduct === product.id && (
            <div className="px-5 pb-6 pt-2 border-t border-fylter-border/30 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel icon={Tag} label="Product Name" />
                  <TextInput
                    value={product.name}
                    onChange={(v) => onFieldChange(product.id, "name", v)}
                  />
                </div>
                <div>
                  <FieldLabel icon={Tag} label="URL Slug" />
                  <TextInput
                    value={product.slug}
                    onChange={(v) => onFieldChange(product.id, "slug", v)}
                  />
                </div>
                <div>
                  <FieldLabel icon={Tag} label="SKU" />
                  <TextInput
                    value={product.sku}
                    onChange={(v) => onFieldChange(product.id, "sku", v)}
                  />
                </div>
                <div>
                  <FieldLabel icon={Tag} label="Category" />
                  <select
                    value={product.category}
                    onChange={(e) => onFieldChange(product.id, "category", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <section className="rounded-xl border border-fylter-gold/40 bg-fylter-gold/10 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-fylter-offWhite">Storefront collections</h5>
                    <p className="mt-1 text-xs text-fylter-muted">
                      Choose where this product appears. Turn on Kids Corner to show it in the Kids section.
                    </p>
                  </div>
                  <label className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-fylter-gold/40 bg-fylter-darkest/60 px-4 py-2.5 text-sm font-semibold text-fylter-offWhite cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.kidsCollection ?? false}
                      onChange={(e) => onFieldChange(product.id, "kidsCollection", e.target.checked)}
                      className="h-5 w-5 accent-fylter-gold"
                    />
                    <span>Show in Kids Corner</span>
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-fylter-border/40 bg-fylter-darkest/40 p-4 sm:p-5">
                <label className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-fylter-offWhite cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.isCombo ?? false}
                    onChange={(e) => {
                      onFieldChange(product.id, "isCombo", e.target.checked);
                      if (!e.target.checked) {
                        onFieldChange(product.id, "comboProductIds", []);
                      }
                    }}
                    className="h-5 w-5 accent-fylter-gold"
                  />
                  <span>Sell this product as a combo</span>
                </label>
                {product.isCombo && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-fylter-muted">
                      Select the existing products included at this combo&apos;s listed price.
                    </p>
                    {products.filter((candidate) => candidate.id !== product.id).length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {products
                          .filter((candidate) => candidate.id !== product.id)
                          .map((candidate) => {
                            const included = product.comboProductIds?.includes(candidate.id) ?? false;
                            return (
                              <label
                                key={candidate.id}
                                className="flex min-h-11 items-center gap-3 rounded-lg border border-fylter-border/30 bg-fylter-darkest/60 px-3 py-2 text-sm text-fylter-offWhite cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={included}
                                  onChange={(e) => {
                                    const current = product.comboProductIds ?? [];
                                    const next = e.target.checked
                                      ? [...current, candidate.id]
                                      : current.filter((id) => id !== candidate.id);
                                    onFieldChange(product.id, "comboProductIds", next);
                                  }}
                                  className="h-4 w-4 accent-fylter-gold"
                                />
                                <span className="min-w-0 flex-1 truncate">{candidate.name}</span>
                                <span className="shrink-0 text-xs text-fylter-muted">
                                  ₹{candidate.price.toLocaleString("en-IN")}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-xs text-fylter-muted">
                        Add another product before selecting combo items.
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <FieldLabel icon={Tag} label="Price (₹)" />
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => onFieldChange(product.id, "price", Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                  />
                </div>
                <div>
                  <FieldLabel icon={Tag} label="Old Price (₹)" />
                  <input
                    type="number"
                    value={product.oldPrice ?? ""}
                    onChange={(e) =>
                      onFieldChange(product.id, "oldPrice", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <FieldLabel icon={Tag} label="Discount (%)" />
                  <input
                    type="number"
                    value={product.discount ?? ""}
                    onChange={(e) =>
                      onFieldChange(product.id, "discount", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <FieldLabel icon={Tag} label="Short Description" />
                <TextArea
                  value={product.shortDescription}
                  onChange={(v) => onFieldChange(product.id, "shortDescription", v)}
                  rows={2}
                />
              </div>
              <div>
                <FieldLabel icon={Tag} label="Full Description" />
                <TextArea
                  value={product.description}
                  onChange={(v) => onFieldChange(product.id, "description", v)}
                  rows={4}
                />
              </div>

              {/* Images */}
              <div>
                <FieldLabel icon={ImageIcon} label="Product Imagery & Media" />
                <p className="text-xs text-fylter-muted mb-3">
                  Upload images by dragging and dropping from your computer, or paste public image links. Reorder images to set the primary storefront cover.
                </p>
                <ProductImageManager
                  images={product.images}
                  onChange={(newImages) => onFieldChange(product.id, "images", newImages)}
                />
              </div>

              {/* Features */}
              <div>
                <FieldLabel icon={Star} label="Features (one per line)" />
                <TextArea
                  value={product.features.join("\n")}
                  onChange={(v) =>
                    onFieldChange(
                      product.id,
                      "features",
                      v.split("\n").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  rows={4}
                />
              </div>

              {/* Specifications */}
              <div>
                <FieldLabel icon={Tag} label="Specifications (key: value, one per line)" />
                <TextArea
                  value={Object.entries(product.specifications)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("\n")}
                  onChange={(v) => {
                    const specs: Record<string, string> = {};
                    v.split("\n").forEach((line) => {
                      const idx = line.indexOf(":");
                      if (idx > 0) {
                        specs[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
                      }
                    });
                    onFieldChange(product.id, "specifications", specs);
                  }}
                  rows={4}
                  placeholder="Capacity: 450 ml&#10;Weight: 320g"
                />
              </div>

              {/* Flags & Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <FieldLabel icon={Tag} label="Stock Status" />
                  <select
                    value={product.stockStatus}
                    onChange={(e) => onFieldChange(product.id, "stockStatus", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                  >
                    {STOCK_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2.5 pt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(e) => onFieldChange(product.id, "featured", e.target.checked)}
                    className="w-4 h-4 accent-fylter-gold rounded"
                  />
                  <span className="text-sm text-fylter-offWhite">Featured</span>
                </label>
                <label className="flex items-center gap-2.5 pt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.trending}
                    onChange={(e) => onFieldChange(product.id, "trending", e.target.checked)}
                    className="w-4 h-4 accent-fylter-gold rounded"
                  />
                  <span className="text-sm text-fylter-offWhite">Trending</span>
                </label>
                <label className="flex items-center gap-2.5 pt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.newArrival}
                    onChange={(e) => onFieldChange(product.id, "newArrival", e.target.checked)}
                    className="w-4 h-4 accent-fylter-gold rounded"
                  />
                  <span className="text-sm text-fylter-offWhite">New Arrival</span>
                </label>
              </div>

              {/* Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel icon={Star} label="Rating (0-5)" />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={product.rating ?? ""}
                    onChange={(e) =>
                      onFieldChange(product.id, "rating", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                    placeholder="4.9"
                  />
                </div>
                <div>
                  <FieldLabel icon={Star} label="Reviews Count" />
                  <input
                    type="number"
                    value={product.reviewsCount ?? ""}
                    onChange={(e) =>
                      onFieldChange(product.id, "reviewsCount", e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50 transition-all"
                    placeholder="128"
                  />
                </div>
              </div>

              {/* Delete */}
              <div className="pt-4 border-t border-fylter-border/30 flex items-center justify-between">
                <Link
                  href={getProductPath(product)}
                  className="text-xs text-fylter-muted hover:text-fylter-gold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Product Page</span>
                </Link>

                {deleteConfirm === product.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400">Are you sure?</span>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 rounded-lg border border-fylter-border/50 text-xs text-fylter-muted hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
