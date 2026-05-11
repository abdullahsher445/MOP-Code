"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Categories", path: "/admin/categories", icon: FolderOpen },
  { label: "Use Cases", path: "/admin/use-cases", icon: Briefcase },
  { label: "Gallery", path: "/admin/gallery", icon: ImageIcon },
  //{ label: "Blogs", path: "/admin/blogs", icon: FileText },
];

type AdminSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale as string;

  return (
    <>
      {/* Dim background only when sidebar is expanded */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[1px]"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen shadow-sm transition-all duration-300 ${
          sidebarOpen
            ? "w-[220px] bg-[#1F8F50]/95"
            : "w-[64px] bg-[#F1EFEF]"
        }`}
      >
        <div className="flex items-center px-3 py-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle admin sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-black transition hover:bg-white/20"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="space-y-2 px-2 pt-3">
          {menuItems.map((item) => {
            const href = `/${locale}${item.path}`;
            const isActive = pathname === href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={href}
                title={!sidebarOpen ? item.label : ""}
                onClick={() => setSidebarOpen(false)}
                className={`flex min-h-[42px] items-center rounded-lg transition-all duration-200 ${
                  sidebarOpen ? "gap-3 px-3 py-2" : "justify-center px-0 py-2"
                } ${
                  isActive
                    ? "bg-white text-[#1F8F50]"
                    : sidebarOpen
                    ? "text-white hover:bg-white/20"
                    : "text-black hover:bg-black/5"
                }`}
              >
                <Icon size={18} className="shrink-0" />

                {sidebarOpen && (
                  <span className="truncate text-sm font-medium leading-tight">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}