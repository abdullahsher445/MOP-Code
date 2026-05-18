"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;

    if (!user || !user.token) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (user.roleId !== 1) {
      router.replace(`/${locale}/profile`);
      return;
    }

    setAuthorized(true);
  }, [locale, router]);

  if (!authorized) return null;

  return (
  <div className="min-h-screen bg-[#F5F5F5]">
    <AdminSidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />

    <div className="flex min-h-screen flex-col pl-[64px]">
      <AdminHeader />

      <main className="w-full max-w-full flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  </div>
);
}