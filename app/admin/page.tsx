import { cookies } from "next/headers";
import AdminClient from "@/app/admin/AdminClient";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const initialAuthenticated = isValidAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  return <AdminClient initialAuthenticated={initialAuthenticated} />;
}
