import React from "react";

export const metadata = {
  title: "Admin Dashboard | FYLTER",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Admin pages render without the store Navbar/Footer */}
      {children}
    </>
  );
}
