import type { Product } from "@/data/products";

const CATALOG_ROW_ID = "main";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? { url, serviceRoleKey } : null;
}

export function isSharedCatalogConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

async function supabaseRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Shared catalog storage is not configured.");
  }

  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}

export async function readSharedCatalog(): Promise<Product[]> {
  const response = await supabaseRequest(
    `storefront_catalog?id=eq.${CATALOG_ROW_ID}&select=products`,
  );
  if (!response.ok) {
    throw new Error(`Supabase catalog read failed (${response.status}).`);
  }

  const rows = (await response.json()) as Array<{ products: Product[] }>;
  if (rows.length > 0 && Array.isArray(rows[0].products)) {
    return rows[0].products;
  }

  return [];
}

export async function writeSharedCatalog(products: Product[]): Promise<void> {
  const response = await supabaseRequest("storefront_catalog?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: CATALOG_ROW_ID, products }),
  });
  if (!response.ok) {
    throw new Error(`Supabase catalog save failed (${response.status}).`);
  }
}

export async function checkAdminLoginAttempt(ipHash: string): Promise<boolean> {
  const response = await supabaseRequest("rpc/check_admin_login_attempt", {
    method: "POST",
    body: JSON.stringify({ p_ip_hash: ipHash }),
  });
  if (!response.ok) {
    throw new Error(`Supabase admin login check failed (${response.status}).`);
  }
  return (await response.json()) === true;
}

export async function clearAdminLoginAttempts(ipHash: string): Promise<void> {
  const response = await supabaseRequest("rpc/clear_admin_login_attempts", {
    method: "POST",
    body: JSON.stringify({ p_ip_hash: ipHash }),
  });
  if (!response.ok) {
    throw new Error(`Supabase admin login reset failed (${response.status}).`);
  }
}
