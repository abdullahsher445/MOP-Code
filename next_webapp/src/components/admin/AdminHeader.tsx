"use client";

import { Bell, Search, UserCircle2, Settings, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function AdminHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    router.push(`/${locale}`);
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] w-full items-center justify-between border-b border-[#D9D9D9] bg-[#F1EFEF] px-3 sm:min-h-[72px] sm:px-4 md:px-6">
      {/* Logo */}
      <div className="flex shrink-0 items-center">
        <Link href={`/${locale}`} aria-label="Go to home page">
          <Image
            src="/img/new-logo-green.png"
            alt="Chameleon Logo"
            width={90}
            height={36}
            className="h-auto w-[58px] cursor-pointer object-contain sm:w-[72px] md:w-[90px]"
            priority
          />
        </Link>
      </div>

      {/* Search bar */}
      <div className="mx-2 hidden min-w-0 flex-1 items-center rounded-lg border border-[#D9D9D9] bg-white px-3 py-2 sm:flex sm:max-w-[260px] md:mx-4 md:max-w-[420px] lg:max-w-[520px]">
        <Search size={16} className="shrink-0 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Search data"
          className="ml-2 w-full min-w-0 bg-transparent text-sm outline-none"
        />
      </div>

      {/* Mobile search icon only */}
      <button
        type="button"
        aria-label="Search"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#4ADE80] transition hover:bg-white/50 sm:hidden"
      >
        <Search size={20} />
      </button>

      {/* Right icons */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#4ADE80] transition hover:bg-white/50"
        >
          <Bell size={20} className="sm:h-[22px] sm:w-[22px]" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            aria-label="User profile"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#4ADE80] transition hover:bg-white/50"
          >
            <UserCircle2 size={26} className="sm:h-[30px] sm:w-[30px]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
              <Link
                href={`/${locale}/admin/settings`}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] transition hover:bg-[#F3F4F6]"
              >
                <Settings size={16} />
                Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}