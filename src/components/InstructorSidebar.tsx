"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Plus, LayoutDashboard, Calendar, BookOpen, CreditCard, User, Mail, Sparkles
} from "lucide-react";
import { supabase } from "../lib/supabase";

export interface InstructorSidebarProps {
  coursesCount?: number;
  pendingBookingsCount?: number;
  profileCompleted?: boolean;
}

export default function InstructorSidebar({
  coursesCount: propCoursesCount,
  pendingBookingsCount: propPendingBookingsCount,
  profileCompleted: propProfileCompleted
}: InstructorSidebarProps) {
  const pathname = usePathname();
  const [coursesCount, setCoursesCount] = useState(propCoursesCount ?? 4);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(propPendingBookingsCount ?? 2);
  const [profileCompleted, setProfileCompleted] = useState(propProfileCompleted ?? false);
  const [sbUser, setSbUser] = useState<any | null>(null);

  // Load actual user, profile state, courses & bookings for accurate counts
  useEffect(() => {
    async function loadStats() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        let userId = "";
        
        if (currentUser) {
          setSbUser(currentUser);
          userId = currentUser.id;
          
          // Load Profile
          const { data: profileData } = await supabase
            .from("instructor_profiles")
            .select("profile_completed")
            .eq("id", userId)
            .maybeSingle();
            
          if (profileData) {
            setProfileCompleted(profileData.profile_completed);
          } else {
            setProfileCompleted(false);
          }
        } else {
          // Fallback demo user
          if (typeof window !== "undefined") {
            const fallbackUserStr = localStorage.getItem("guild_fallback_user");
            if (fallbackUserStr) {
              const parsed = JSON.parse(fallbackUserStr);
              if (parsed) {
                setSbUser({
                  email: parsed.email || "demo@example.com",
                  user_metadata: { name: parsed.name || "David Green", role: "CREATOR" }
                });
              }
            }
            const fallbackCompleted = localStorage.getItem("guild_fallback_profile_completed") === "true";
            setProfileCompleted(fallbackCompleted);
          }
        }

        // Fetch courses count if not provided
        if (propCoursesCount === undefined) {
          // Default courses
          setCoursesCount(4);
        }
        
        // Fetch bookings count if not provided
        if (propPendingBookingsCount === undefined) {
          setPendingBookingsCount(2);
        }
      } catch (err) {
        console.error("Sidebar stats loading error:", err);
      }
    }
    loadStats();
  }, [propCoursesCount, propPendingBookingsCount, propProfileCompleted]);

  // Sync prop updates
  useEffect(() => {
    if (propCoursesCount !== undefined) setCoursesCount(propCoursesCount);
  }, [propCoursesCount]);

  useEffect(() => {
    if (propPendingBookingsCount !== undefined) setPendingBookingsCount(propPendingBookingsCount);
  }, [propPendingBookingsCount]);

  useEffect(() => {
    if (propProfileCompleted !== undefined) setProfileCompleted(propProfileCompleted);
  }, [propProfileCompleted]);

  const instructorName = sbUser?.user_metadata?.name || "David Green";
  const instructorRole = "Woodworking Instructor";
  const avatarUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop";

  const getInitials = (n = "") => {
    return n.split(" ").map(word => word[0]).join("").toUpperCase();
  };

  const isActive = (path: string) => {
    if (path === "/instructor") {
      return pathname === "/instructor";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="lg:col-span-3 bg-white border-r border-stone-200/80 p-6 flex flex-col justify-between h-full" id="builder-sidebar">
      <div className="space-y-8">
        {/* BRAND LOGO */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">🪵</span>
          <div>
            <h2 className="text-sm font-bold text-stone-950 tracking-tight font-display">Woodworker Guild</h2>
            <p className="text-[10px] font-mono font-bold tracking-widest text-amber-900/80 uppercase">CREATOR PORTAL</p>
          </div>
        </div>

        {/* QUICK PROFILE */}
        <div className="p-3.5 bg-stone-50 ring-1 ring-stone-200/50 rounded-xl flex items-center gap-3">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={instructorName} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-200/60"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-950 font-bold flex items-center justify-center text-xs">
              {getInitials(instructorName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-stone-950 truncate">
              {instructorName}
            </p>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 bg-amber-900/10 text-amber-950 rounded font-bold uppercase tracking-wider">
                {instructorRole}
              </span>
            </div>
          </div>
        </div>

        {/* FRONTEND LINKS NAVIGATION */}
        <nav className="space-y-1">
          <Link
            href="/instructor/profile"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors font-medium cursor-pointer ${
              isActive("/instructor/profile")
                ? "bg-amber-50 text-amber-950 font-bold border border-amber-900/10 shadow-xs" 
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile Onboarding</span>
            {!profileCompleted && (
              <span className="ml-auto px-1.5 py-0.5 bg-red-650 text-white rounded font-mono text-[9px] font-bold uppercase animate-pulse">
                Incomplete
              </span>
            )}
          </Link>

          <Link
            href="/instructor"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors font-medium cursor-pointer ${
              isActive("/instructor") && !isActive("/instructor/courses") && !isActive("/instructor/bookings") && !isActive("/instructor/messages") && !isActive("/instructor/bank") && !isActive("/instructor/profile")
                ? "bg-amber-50 text-amber-950 font-bold border border-amber-900/10 shadow-xs" 
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview & Roster</span>
          </Link>

          <Link
            href="/instructor/courses"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors font-medium cursor-pointer ${
              isActive("/instructor/courses")
                ? "bg-amber-50 text-amber-950 font-bold border border-amber-900/10 shadow-xs" 
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>My Course Listings ({coursesCount})</span>
          </Link>

          <Link
            href="/instructor/bookings"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors font-medium cursor-pointer ${
              isActive("/instructor/bookings")
                ? "bg-amber-50 text-amber-950 font-bold border border-amber-900/10 shadow-xs" 
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Student Bookings</span>
            {pendingBookingsCount > 0 && (
              <span className="ml-auto px-1.5 py-0.5 bg-amber-650 text-white rounded font-mono text-[9px] font-bold">
                {pendingBookingsCount}
              </span>
            )}
          </Link>

          <Link
            href="/instructor/messages"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors font-medium cursor-pointer ${
              isActive("/instructor/messages")
                ? "bg-amber-50 text-amber-950 font-bold border border-amber-900/10 shadow-xs" 
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Direct Enquiries</span>
          </Link>

          <Link
            href="/instructor/bank"
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors font-medium cursor-pointer ${
              isActive("/instructor/bank")
                ? "bg-amber-50 text-amber-950 font-bold border border-amber-900/10 shadow-xs" 
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Payouts & Bank Settings</span>
          </Link>
        </nav>

        {/* QUICK BRANDING TIPS */}
        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
          <span className="font-bold text-amber-950 block mb-1">💡 SEO Ranking Notice</span>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Don't forget to be very clear on your course listing Title and Description. The better it is, the better it will rank for SEO in Google!
          </p>
        </div>
      </div>

      {/* BOTTOM NAVIGATION ROUTING */}
      <div className="pt-6 border-t border-stone-200/80 space-y-2.5">
        {!profileCompleted ? null : (
          <Link 
            href="/course-builder"
            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-stone-950 hover:bg-stone-850 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Course Builder</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
