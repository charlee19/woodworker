"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckCircle2, X } from "lucide-react";
import BookingForm from "../BookingForm";
import { EmbedConfig, Booking, Course } from "../../types";

interface SecureEnrollButtonProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  course?: any;
}

export default function SecureEnrollButton({ courseId, courseTitle, coursePrice, course }: SecureEnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Default layout config for BookingForm embed
  const defaultConfig: EmbedConfig = {
    theme: "amber",
    primaryColor: "#d97706",
    font: "sans",
    showDifficulty: true,
    showInstructor: true,
    iframeHeight: 600,
  };

  const handleBookingSubmit = async (booking: Booking) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const fallbackUserStr = localStorage.getItem("guild_fallback_user");
      const headersInit: Record<string, string> = { "Content-Type": "application/json" };
      if (fallbackUserStr) {
        headersInit["x-user-session"] = encodeURIComponent(fallbackUserStr);
      }

      // 1. Submit checkout API request to enroll the student on the backend/supabase
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: headersInit,
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push(`/login`);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to finalize enrollment transaction");
      }

      // 2. Persist the detailed reservation details (selected date, seats, etc.) to student bookings
      const existingBookingsStr = localStorage.getItem("instructor_bookings") || "[]";
      let existingBookings = [];
      try {
        existingBookings = JSON.parse(existingBookingsStr);
      } catch (_) {}

      // Push new high-fidelity booking calendar details
      const detailedBooking = {
        ...booking,
        status: "Confirmed" as const
      };
      existingBookings.unshift(detailedBooking);
      localStorage.setItem("instructor_bookings", JSON.stringify(existingBookings));

      // Successfully enrolled!
      setEnrolled(true);
      setShowBookingModal(false);
      
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectEnroll = async () => {
    if (course) {
      // If we have course object, open our highly interactive booking calendar modal!
      setShowBookingModal(true);
    } else {
      // Fallback: regular direct instant checkout
      setLoading(true);
      setErrorMsg("");

      try {
        const fallbackUserStr = localStorage.getItem("guild_fallback_user");
        const headersInit: Record<string, string> = { "Content-Type": "application/json" };
        if (fallbackUserStr) {
          headersInit["x-user-session"] = encodeURIComponent(fallbackUserStr);
        }

        const res = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: headersInit,
          body: JSON.stringify({ courseId }),
        });

        const data = await res.json();

        if (res.status === 401) {
          router.push(`/login`);
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to finalize enrollment transaction");
        }

        setEnrolled(true);
        
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);

      } catch (err: any) {
        setErrorMsg(err.message || "Something went wrong during checkout.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (enrolled) {
    return (
      <div className="w-full bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-md">
        <CheckCircle2 className="w-4 h-4 text-emerald-100 animate-bounce" />
        Booking Confirmed &amp; Saved!
      </div>
    );
  }

  // Map DBCourse back to Course type interface safely for the interactive scheduler
  const mappedCourse: Course | null = course ? {
    id: course.id,
    title: course.title,
    description: course.description || "",
    durationType: "daily",
    durationLabel: course.durationLabel || "1 Day",
    price: course.price,
    capacity: course.capacity || 6,
    instructorId: course.instructorId || "inst_david",
    instructor: course.instructor || "Artisan Instructor",
    difficulty: (course.difficulty === "Advanced" ? "Advanced" : course.difficulty === "Intermediate" ? "Intermediate" : "Beginner"),
    materialsIncluded: !!course.materialsIncluded,
    location: course.locationId || "Devon",
    image: course.image,
    timeSlots: course.timeSlots || ["09:00 - 12:00", "13:00 - 16:00", "17:00 - 20:00"]
  } : null;

  return (
    <div className="space-y-2">
      <button
        onClick={handleDirectEnroll}
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl block text-center transition-all shadow-md active:translate-y-0 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Book &amp; Enroll Now &rarr;
          </>
        )}
      </button>

      {errorMsg && (
        <p className="text-[10px] text-red-400 font-mono text-center">
          ⚠ {errorMsg}
        </p>
      )}

      <p className="text-[9px] text-stone-400 font-sans text-center mt-2 font-medium">
        Processed securely with 128-bit Encryption &bull; Instant Dashboard Access
      </p>

      {/* RENDER DYNAMIC BOOKING CALENDAR MODAL */}
      {showBookingModal && mappedCourse && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Premium Header */}
            <div className="bg-stone-950 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block mb-1">
                  Artisan Woodworking Scheduler
                </span>
                <h3 className="text-lg font-display font-semibold tracking-tight text-white">
                  Reserve Spots for: {courseTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-stone-400 hover:text-white transition-colors bg-stone-900 hover:bg-stone-850 p-2 rounded-full cursor-pointer"
                title="Close Scheduler"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Booking Form Body */}
            <div className="flex-1 overflow-y-auto bg-stone-50 p-6">
              <BookingForm
                courses={[mappedCourse]}
                initialSelectedCourse={mappedCourse}
                config={defaultConfig}
                onSubmitBooking={handleBookingSubmit}
                onBackToDirectory={() => setShowBookingModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
