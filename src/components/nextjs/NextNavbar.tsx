"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function NextNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: sbUser }, error } = await supabase.auth.getUser();
      if (sbUser && !error) {
        const mappedUser = {
          name: sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "User",
          role: sbUser.user_metadata?.role || "CUSTOMER",
        };
        setUser(mappedUser);
        localStorage.setItem("guild_fallback_user", JSON.stringify(mappedUser));
      } else {
        const fallbackUserStr = localStorage.getItem("guild_fallback_user");
        if (fallbackUserStr) {
          setUser(JSON.parse(fallbackUserStr));
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      const fallbackUserStr = localStorage.getItem("guild_fallback_user");
      if (fallbackUserStr) {
        try {
          setUser(JSON.parse(fallbackUserStr));
        } catch (_) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("guild_fallback_user");
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200" id="next-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                🪓
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-medium tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors font-display">
                  Woodworker
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono -mt-1">
                  Marketplace &amp; Academy
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Home
            </Link>
            <Link href="/courses" className="hover:text-amber-800 transition-colors">
              Courses
            </Link>
            <Link href="/course-builder" className="hover:text-amber-800 font-semibold text-stone-700 transition-colors">
              🔨 Course Builder
            </Link>
            <Link href="/instructor" className="px-3 py-1.5 bg-amber-50 text-amber-950 font-bold border border-amber-250/50 rounded-xl hover:bg-amber-100 transition-all text-xs flex items-center gap-1 tracking-tight">
              👤 Instructors Portal
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 bg-stone-100 text-stone-950 font-bold border border-stone-200 rounded-xl hover:bg-stone-200 transition-all text-xs flex items-center gap-1 tracking-tight">
              🎓 Student Portal
            </Link>
            <Link href="/booking-preview" className="px-3 py-1.5 bg-amber-600 text-white font-extrabold rounded-xl hover:bg-amber-700 transition-all text-xs flex items-center gap-1 tracking-tight">
              📅 Booking Form Preview
            </Link>
            <Link href="/categories" className="hover:text-amber-800 transition-colors">
              Categories
            </Link>
            <Link href="/locations" className="hover:text-amber-800 transition-colors">
              Locations
            </Link>
            <Link href="/blog" className="hover:text-amber-800 transition-colors">
              Blog
            </Link>
            <Link href="/admin" className="hover:text-amber-850 font-bold text-amber-900 transition-colors">
              ⚙️ Admin
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-5">
                {user.role === "SUPERADMIN" && (
                  <Link
                    href="/admin"
                    className="text-stone-100 hover:text-stone-50 transition-colors font-bold text-sm bg-amber-800 hover:bg-amber-900 px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    ⚙️ Admin Ledger
                  </Link>
                )}
                <Link
                  href={user.role === "CREATOR" ? "/instructor" : "/dashboard"}
                  className="text-stone-700 hover:text-amber-800 transition-colors font-bold text-sm flex items-center gap-1.5 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-600" />
                  Dashboard ({user.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-stone-500 hover:text-red-750 font-medium text-sm flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-stone-700 hover:text-amber-800 transition-colors font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-amber-900 hover:text-amber-700 font-semibold text-sm cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Simple Mobile Navigation Links */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/course-builder"
              className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-2 rounded-lg font-bold cursor-pointer"
            >
              🔨 Builder
            </Link>
            <Link
              href="/admin"
              className="text-xs bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-2 rounded-lg font-bold cursor-pointer"
            >
              ⚙️ Admin
            </Link>
            {user ? (
              <>
                {user.role === "SUPERADMIN" && (
                  <Link
                    href="/admin"
                    className="text-xs text-amber-800 font-bold px-1.5 py-2 cursor-pointer"
                  >
                    👑 Ledger
                  </Link>
                )}
                <Link
                  href={user.role === "CREATOR" ? "/instructor" : "/dashboard"}
                  className="text-xs text-amber-900 font-bold px-2 py-2 cursor-pointer flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                  Dash
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-xs text-stone-700 font-semibold px-2 py-2 cursor-pointer flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                Login
              </Link>
            )}
             <Link
              href="/booking-preview"
              className="text-xs bg-amber-600 text-white px-2.5 py-2 rounded-lg font-bold cursor-pointer"
            >
              📅 Booking
            </Link>
            <Link
              href="/courses"
              className="text-xs bg-stone-900 text-stone-100 px-3 py-2 rounded-lg font-semibold cursor-pointer"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
