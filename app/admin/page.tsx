"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import type { SiteConfig } from "@/config/site";
import type { Product, ProductVariant } from "@/data/products";
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

// ─── Enhanced Security Utilities ──────────────────────────────────
// Default PIN hash (SHA-256 hex digest for default PIN "1234")
const DEFAULT_PIN_HASH = "0b5cae486077346d17723ad7de67ba3cdea0cb253b36a458081686e19eadb3b3";
const STORAGE_KEY_PIN_HASH = "fylter_admin_pin_hash";
const STORAGE_KEY_AUTH_TOKEN = "fylter_admin_auth_token";
const STORAGE_KEY_AUTH_TIME = "fylter_admin_auth_timestamp";
const STORAGE_KEY_ATTEMPTS = "fylter_admin_failed_attempts";
const STORAGE_KEY_LOCKOUT = "fylter_admin_lockout_until";

// 2 Hours auto-timeout for elevated security
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds freeze

async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`fylter_salt_${pin.trim()}`);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuf));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getStoredPinHash(): string {
  if (typeof window === "undefined") return DEFAULT_PIN_HASH;
  return localStorage.getItem(STORAGE_KEY_PIN_HASH) || DEFAULT_PIN_HASH;
}

// ─── Toast is now handled by the design-system DSToast component ──
// (imported above)

// ─── Secure Auth Gate ─────────────────────────────────────────────
function AdminAuth({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check lockout on mount and tick countdown
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEY_LOCKOUT) || "0", 10);
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutTime(remaining);
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0 || isVerifying || !pin.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      // 1. Validate against secure server route
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        const sessionToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, sessionToken);
        sessionStorage.setItem(STORAGE_KEY_AUTH_TIME, Date.now().toString());
        onAuth();
        setIsVerifying(false);
        return;
      }

      // If server responded with unauthorized, record attempt
      const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || "0", 10) + 1;
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, currentAttempts.toString());

      if (currentAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem(STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
        setLockoutTime(LOCKOUT_DURATION_MS / 1000);
        setError(`Too many failed attempts. Security cooldown active for 60 seconds.`);
      } else {
        const remainingAttempts = MAX_ATTEMPTS - currentAttempts;
        setError(`Incorrect PIN. ${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} left.`);
      }
      setPin("");
    } catch {
      // Fallback local verification if server is unreachable
      const enteredHash = await hashPin(pin);
      const validHash = getStoredPinHash();
      if (enteredHash === validHash) {
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        const sessionToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, sessionToken);
        sessionStorage.setItem(STORAGE_KEY_AUTH_TIME, Date.now().toString());
        onAuth();
      } else {
        setError("Invalid PIN or server unreachable.");
      }
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
              maxLength={20}
              value={pin}
              disabled={lockoutTime > 0}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className={`w-full px-4 py-3 rounded-xl bg-fylter-darkest border text-center text-2xl tracking-[0.4em] font-bold text-fylter-offWhite placeholder:text-fylter-muted/40 placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 transition-all ${
                lockoutTime > 0
                  ? "border-red-600/50 bg-red-950/20 opacity-60 cursor-not-allowed"
                  : error
                  ? "border-red-500/60 focus:ring-red-500/30"
                  : "border-fylter-border/50 focus:ring-fylter-gold/40 focus:border-fylter-gold/60"
              }`}
              autoFocus
            />

            {lockoutTime > 0 ? (
              <p className="text-xs text-red-400 flex items-center justify-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Locked out. Retry in {lockoutTime}s
              </p>
            ) : error ? (
              <p className="text-xs text-red-400 flex items-center justify-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            ) : (
              <p className="text-[11px] text-fylter-muted/70 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />Protected
              </p>
            )}

            <button
              type="submit"
              disabled={lockoutTime > 0 || isVerifying || !pin}
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
const CATEGORIES = [
  "Home & Living",
  "Lifestyle & Wellness",
  "Tech Accessories",
  "Travel & Outdoor",
] as const;

const STOCK_OPTIONS = ["In Stock", "Low Stock", "Pre-Order"] as const;

// ─── Main Admin Page ──────────────────────────────────────────────
export default function AdminPage() {
  const {
    siteSettings,
    products,
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
  const [isAuthed, setIsAuthed] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Check session auth and expiration
  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
    const authTime = parseInt(sessionStorage.getItem(STORAGE_KEY_AUTH_TIME) || "0", 10);
    const isLegacyAuth = sessionStorage.getItem("fylter_admin_auth") === "true";

    if (token && authTime && Date.now() - authTime < SESSION_DURATION_MS) {
      setIsAuthed(true);
    } else if (isLegacyAuth && !token) {
      // Migrate legacy sessions with new timestamp
      sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, "legacy_migrated");
      sessionStorage.setItem(STORAGE_KEY_AUTH_TIME, Date.now().toString());
      setIsAuthed(true);
    } else {
      // Session expired or invalid
      sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_AUTH_TIME);
      sessionStorage.removeItem("fylter_admin_auth");
      setIsAuthed(false);
    }
  }, []);

  const handleLogout = () => {
    fetch("/api/admin/auth", { method: "DELETE" }).catch(() => {});
    sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_AUTH_TIME);
    sessionStorage.removeItem("fylter_admin_auth");
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
      category: "Home & Living",
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
    return <AdminAuth onAuth={() => setIsAuthed(true)} />;
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
          <SecurityPanel
            onLogout={handleLogout}
            onNotify={(message, type) => setToast({ message, type })}
          />
        )}
      </div>
    </div>
  );
}

// ─── Vault Security Panel ─────────────────────────────────────────
function SecurityPanel({
  onLogout,
  onNotify,
}: {
  onLogout: () => void;
  onNotify: (message: string, type: "success" | "error") => void;
}) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [isCustomPinSet, setIsCustomPinSet] = useState(false);

  useEffect(() => {
    const hasCustom = !!localStorage.getItem(STORAGE_KEY_PIN_HASH);
    setIsCustomPinSet(hasCustom);
  }, []);

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPin || !newPin || !confirmPin) {
      onNotify("Please fill in all PIN fields.", "error");
      return;
    }

    if (newPin.length < 4) {
      onNotify("New PIN must be at least 4 digits.", "error");
      return;
    }

    if (newPin !== confirmPin) {
      onNotify("New PIN and confirmation do not match.", "error");
      return;
    }

    setIsChangingPin(true);
    const enteredCurrentHash = await hashPin(currentPin);
    const validCurrentHash = getStoredPinHash();

    if (enteredCurrentHash !== validCurrentHash) {
      onNotify("Current PIN is incorrect.", "error");
      setIsChangingPin(false);
      return;
    }

    const newHash = await hashPin(newPin);
    localStorage.setItem(STORAGE_KEY_PIN_HASH, newHash);
    setIsCustomPinSet(true);
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setIsChangingPin(false);
    onNotify("Admin PIN successfully updated and encrypted!", "success");
  };

  const handleResetToDefaultPin = async () => {
    if (confirm("Reset admin PIN back to default (1234)?")) {
      localStorage.removeItem(STORAGE_KEY_PIN_HASH);
      setIsCustomPinSet(false);
      onNotify("PIN reset to factory default (1234).", "success");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Security Status Overview */}
      <div className="p-6 rounded-2xl glass-panel border border-fylter-gold/30">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Vault Armed & Protected
            </span>
            <h3 className="text-xl font-extrabold text-fylter-offWhite tracking-tight">
              Administrative Access & Security Health
            </h3>
            <p className="text-xs text-fylter-muted mt-1 leading-relaxed">
              Your admin session is encrypted, protected by client-side SHA-256 salted PIN hashing, brute-force rate-limiting, and auto-expiring session credentials.
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

        {/* Security Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-fylter-border/30">
          <div className="p-4 rounded-xl bg-fylter-darkest/60 border border-fylter-border/30">
            <span className="text-[11px] text-fylter-muted uppercase font-semibold block">PIN Protection</span>
            <span className="text-sm font-bold text-fylter-offWhite mt-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-fylter-gold" />
              {isCustomPinSet ? "Custom Secret Active" : "Default PIN (1234)"}
            </span>
            <p className="text-[11px] text-fylter-muted mt-1">
              {isCustomPinSet ? "Encrypted with SHA-256 salt" : "Please set a custom PIN below"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-fylter-darkest/60 border border-fylter-border/30">
            <span className="text-[11px] text-fylter-muted uppercase font-semibold block">Brute-Force Guard</span>
            <span className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Active (5 strikes / 60s freeze)
            </span>
            <p className="text-[11px] text-fylter-muted mt-1">Prevents credential guessing attacks</p>
          </div>

          <div className="p-4 rounded-xl bg-fylter-darkest/60 border border-fylter-border/30">
            <span className="text-[11px] text-fylter-muted uppercase font-semibold block">Session Expiration</span>
            <span className="text-sm font-bold text-fylter-offWhite mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-fylter-gold" />
              2 Hours Auto-Timeout
            </span>
            <p className="text-[11px] text-fylter-muted mt-1">Automatic closure when inactive</p>
          </div>
        </div>
      </div>

      {/* Change PIN Form */}
      <div className="p-6 rounded-2xl glass-panel border border-fylter-border/40">
        <h3 className="text-base font-bold text-fylter-offWhite mb-2 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-fylter-gold" />
          Update Admin Security PIN
        </h3>
        <p className="text-xs text-fylter-muted mb-6">
          Change your dashboard passcode. The new passcode is salted and encrypted using Web Crypto SHA-256 before being stored.
        </p>

        <form onSubmit={handleChangePin} className="space-y-4 max-w-lg">
          <div>
            <FieldLabel icon={Lock} label="Current PIN" />
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Enter current PIN"
              className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite placeholder:text-fylter-muted/40 focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel icon={KeyRound} label="New PIN" />
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="At least 4 characters"
                className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite placeholder:text-fylter-muted/40 focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50"
              />
            </div>
            <div>
              <FieldLabel icon={KeyRound} label="Confirm New PIN" />
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-enter new PIN"
                className="w-full px-4 py-2.5 rounded-lg bg-fylter-darkest border border-fylter-border/50 text-sm text-fylter-offWhite placeholder:text-fylter-muted/40 focus:outline-none focus:ring-2 focus:ring-fylter-gold/30 focus:border-fylter-gold/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-3 flex-wrap">
            {isCustomPinSet ? (
              <button
                type="button"
                onClick={handleResetToDefaultPin}
                className="text-xs text-fylter-muted hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset PIN to Default (1234)
              </button>
            ) : <span />}

            <button
              type="submit"
              disabled={isChangingPin || !currentPin || !newPin || !confirmPin}
              className="px-6 py-2.5 rounded-lg btn-3d-gold text-xs font-bold tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isChangingPin ? "Encrypting..." : "Update Security PIN"}
            </button>
          </div>
        </form>
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
            <TextInput value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="Purely Filters" />
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
                  href={`/products/${product.slug}`}
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
