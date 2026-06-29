"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar, DollarSign, BookOpen, Clock, Tag, Plus, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function InstructorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("instructor_profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (data) {
            const isComplete = !!(
              data.full_name?.trim() &&
              data.address?.trim() &&
              data.postcode?.trim() &&
              data.phone_number?.trim() &&
              data.email?.trim() &&
              data.website?.trim()
            );
            setProfileComplete(isComplete);
          } else {
            setProfileComplete(false);
          }
        }
      } catch (err) {
        console.error("Error loading profile on dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    checkProfile();
  }, []);

  const [stats] = useState({
    totalStudents: 14,
    activeCourses: 3,
    pendingPayouts: "£420.00",
    totalEarnings: "£1,250.00",
  });

  const [myCourses] = useState([
    {
      id: "c1",
      title: "Spoon Carving & Axe Workshop",
      location: "Devon Woodshop",
      price: 45,
      capacity: 6,
      studentsCount: 6,
      status: "Fully Booked"
    },
    {
      id: "c2",
      title: "Precision Tool Sharpening & Care",
      location: "Devon Woodshop",
      price: 35,
      capacity: 8,
      studentsCount: 4,
      status: "Active"
    }
  ]);

  return (
    <main className="min-h-screen bg-stone-50 py-16 sm:py-24" id="instructor-portal-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-stone-100 rounded-3xl p-8 sm:p-12 shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-0" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-amber-400 font-mono uppercase tracking-widest text-xs font-semibold block mb-2">
                Instructor Workspace
              </span>
              <h1 className="text-3xl sm:text-4xl font-display text-white mb-2">
                Artisan Instructor Studio
              </h1>
              <p className="text-stone-300 text-sm max-w-xl leading-relaxed">
                Manage your scheduled masterclasses, track student attendance, configure tool storage slots, and review payout status.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              {loading || !profileComplete ? (
                <span
                  id="build-workshop-disabled"
                  className="inline-flex items-center gap-1.5 bg-stone-300 text-stone-500 font-bold text-xs font-mono uppercase px-6 py-4 rounded-xl cursor-not-allowed opacity-75 select-none shadow-none"
                  title="Please complete your profile first"
                >
                  <Plus className="w-4 h-4" />
                  Build New Workshop &rarr;
                </span>
              ) : (
                <Link
                  id="build-workshop-enabled"
                  href="/course-builder"
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs font-mono uppercase px-6 py-4 rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Build New Workshop &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Complete Profile Warning Banner */}
        {!loading && !profileComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs animate-fade-in" id="profile-incomplete-warning">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0 mt-0.5">
                ⚠️
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-display">
                  Instructor Profile Incomplete
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  You must complete your required profile details (Full Name, Address, Postcode, Telephone, Email, and Website) before you can build new workshops.
                </p>
              </div>
            </div>
            <Link
              href="/instructor/profile"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs font-mono uppercase px-5 py-3.5 rounded-xl transition-all shadow-md shrink-0 self-end md:self-center"
              id="btn-complete-profile"
            >
              Complete Profile &rarr;
            </Link>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Total Students</span>
              <strong className="text-3xl font-display font-medium text-stone-900 mt-1 block">{stats.totalStudents}</strong>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
              👥
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Active Courses</span>
              <strong className="text-3xl font-display font-medium text-stone-900 mt-1 block">{stats.activeCourses}</strong>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
              🔨
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Pending Payouts</span>
              <strong className="text-3xl font-display font-medium text-stone-900 mt-1 block font-mono">{stats.pendingPayouts}</strong>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
              💰
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Total Earnings</span>
              <strong className="text-3xl font-display font-medium text-stone-900 mt-1 block font-mono">{stats.totalEarnings}</strong>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xl">
              📈
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-4 mb-6">
                <BookOpen className="w-5 h-5 text-amber-800" />
                Your Woodworking Listings
              </h2>

              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="p-5 rounded-xl border border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-base font-bold text-stone-900 mb-1">
                        {course.title}
                      </h3>
                      <div className="text-xs text-stone-500 flex items-center gap-3 mt-1.5 font-mono">
                        <span>📍 {course.location}</span>
                        <span>•</span>
                        <span>Price: £{course.price}</span>
                        <span>•</span>
                        <span>Capacity: {course.capacity} max</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span className="text-xs text-stone-500">
                        👥 <strong>{course.studentsCount}</strong>/{course.capacity} students
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        course.status === "Fully Booked" 
                          ? "bg-stone-900 text-stone-100" 
                          : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructor Actions Sidebar */}
          <div className="space-y-8">
            {/* Communication Hub */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-base font-bold font-display text-stone-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-800" />
                Student Inquiries
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Verify active messages and questions from students regarding tools, safety, and parking slots.
              </p>
              <Link
                href="/instructor/messages"
                className="w-full bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold font-mono uppercase py-3 rounded-xl transition-all block text-center shadow-sm"
              >
                Open Messages Inbox &rarr;
              </Link>
            </div>

            {/* Verification Badge */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-stone-900 p-6 rounded-2xl shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-800" />
                Guild Compliance Verified
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Your instructor credentials are fully verified for liability protection and sloyd knife certification.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
