"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminPanel from "@/components/AdminPanel";
import { INITIAL_COURSES } from "@/coursesData";
import { Course, Booking } from "@/types";
import { Shield, Key, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b1",
      courseId: "c1",
      courseTitle: "Spoon Carving & Axe Workshop",
      instructorId: "inst_david",
      durationType: "hourly",
      customerName: "Charles Wright",
      customerEmail: "charlee19071@gmail.com",
      customerPhone: "07700 900077",
      bookingDate: "2026-07-11",
      notes: "Sloyd knife enthusiast, looking forward to it!",
      totalPrice: 45,
      status: "Confirmed",
      createdAt: "2026-06-24T18:00:00.000Z"
    },
    {
      id: "b2",
      courseId: "c3",
      courseTitle: "Introduction to Hand-Cut Joinery",
      instructorId: "inst_marcus",
      durationType: "daily",
      customerName: "Eleanor Green",
      customerEmail: "eleanor@example.com",
      customerPhone: "07700 900123",
      bookingDate: "2026-08-05",
      notes: "No woodworking background, hope to learn pull-saw basics.",
      totalPrice: 135,
      status: "Pending",
      createdAt: "2026-06-24T12:00:00.000Z"
    }
  ]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.replace("/login");
          return;
        }

        // Fetch user role from public "User" table with fallback to metadata
        let role = (user.user_metadata?.role || "").toUpperCase();
        try {
          const { data: dbUser, error: dbError } = await supabase
            .from("User")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!dbError && dbUser) {
            role = (dbUser.role || "").toUpperCase();
          }
        } catch (dbErr) {
          console.warn("Could not fetch user role in admin verification:", dbErr);
        }

        if (role === "ADMIN" || role === "SUPERADMIN") {
          setAuthorized(true);
        } else if (role === "INSTRUCTOR" || role === "CREATOR") {
          router.replace("/instructor");
        } else if (role === "CUSTOMER") {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch (e) {
        console.error("Auth verification failed:", e);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const addCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateBookingStatus = (id: string, status: "Pending" | "Confirmed" | "Cancelled") => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4 text-center">
          <Shield className="w-12 h-12 text-amber-600 mx-auto animate-bounce" />
          <h2 className="text-lg font-medium text-stone-700 font-display">Verifying administrative credentials...</h2>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-stone-200 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-50 text-red-600 mb-6 border border-red-100">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-stone-950 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed">
            This workspace deck is restricted to administrative staff only. Your current account does not have <strong>ADMIN</strong> privileges.
          </p>
          <div className="pt-6 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-amber-900 hover:bg-amber-800 transition-all cursor-pointer shadow-sm"
            >
              <Key className="w-4 h-4 mr-2" />
              Sign in with Admin Credentials
            </Link>
            <Link
              href="/"
              className="w-full flex justify-center items-center py-3 px-4 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-stone-400" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-10" id="admin-page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500 text-stone-950 px-4 py-3 rounded-2xl mb-6 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
          <span>🛡️</span>
          <span>Security Notice: You are accessing the administrative control deck of Woodworker Guild.</span>
        </div>

        <AdminPanel
          courses={courses}
          bookings={bookings}
          addCourse={addCourse}
          deleteCourse={deleteCourse}
          updateBookingStatus={updateBookingStatus}
          deleteBooking={deleteBooking}
        />
      </div>
    </main>
  );
}
