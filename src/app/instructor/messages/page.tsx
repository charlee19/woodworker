"use client";

import React, { useState, useEffect } from "react";
import InstructorSidebar from "../../../components/InstructorSidebar";
import MessagingCenter from "../../../lib/MessagingCenter";
import { INITIAL_CREATORS, INITIAL_BOOKINGS, INITIAL_COURSES } from "../../../coursesData";
import { Booking } from "../../../types";
import { getCourses, getBookings } from "../../../lib/instructorData";
import { supabase } from "../../../lib/supabase";

export default function InstructorMessagesPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [instructorCoursesCount, setInstructorCoursesCount] = useState(4);
  const [instructorPendingBookingsCount, setInstructorPendingBookingsCount] = useState(2);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Read counts for Sidebar badges
    setInstructorCoursesCount(getCourses().length);
    setInstructorPendingBookingsCount(getBookings().filter(b => b.status === "Pending").length);

    async function checkProfile() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: profileData } = await supabase
            .from("instructor_profiles")
            .select("profile_completed")
            .eq("id", currentUser.id)
            .maybeSingle();
            
          if (profileData) {
            setProfileCompleted(profileData.profile_completed);
          } else {
            setProfileCompleted(false);
          }
        } else {
          // Fallback from localStorage
          if (typeof window !== "undefined") {
            const fallbackCompleted = localStorage.getItem("guild_fallback_profile_completed") === "true";
            setProfileCompleted(fallbackCompleted);
          }
        }
      } catch (err) {
        console.error("Error loading profile completion:", err);
      }
    }
    checkProfile();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-100" id="course-builder-dashboard">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <InstructorSidebar 
          coursesCount={instructorCoursesCount} 
          pendingBookingsCount={instructorPendingBookingsCount}
          profileCompleted={profileCompleted}
        />

        {/* MAIN PANEL CONTENT */}
        <main className="lg:col-span-9 p-8 space-y-8 flex flex-col justify-start" id="builder-form-panel">
          {/* TOP HEADER */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-850 uppercase">Woodworker Academy</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-stone-400 font-mono">Enquiry Center Active</span>
              </div>
              <h1 className="text-2xl font-display font-semibold text-stone-950 tracking-tight mt-1">
                Direct Enquiries & Messages
              </h1>
            </div>
          </header>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-3xs overflow-hidden flex-1 p-6">
            <MessagingCenter 
              activeRole="instructor"
              currentInstructorId="inst_david"
              currentStudent={null}
              creators={INITIAL_CREATORS}
              bookings={bookings}
              setBookings={setBookings as any}
              courses={INITIAL_COURSES}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
