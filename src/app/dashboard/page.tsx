"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Mail, Award, CheckCircle, ShieldCheck } from "lucide-react";

export default function StudentDashboardPage() {
  const [bookings] = useState([
    {
      id: "bk-1",
      courseTitle: "Spoon Carving & Axe Workshop",
      date: "2026-07-11",
      time: "09:30 - 12:30",
      instructor: "David Green",
      location: "Devon Woodshop",
      status: "Confirmed",
      price: "£45"
    },
    {
      id: "bk-2",
      courseTitle: "Introduction to Hand-Cut Joinery",
      date: "2026-08-05",
      time: "09:00 - 17:00",
      instructor: "Marcus Miller",
      location: "Cornwall Coastal Barn",
      status: "Pending",
      price: "£135"
    }
  ]);

  const [certificates] = useState([
    {
      id: "cert-1",
      courseTitle: "Precision Tool Sharpening & Care",
      issuedBy: "Evelyn Wood",
      date: "May 2026",
      status: "Verified"
    }
  ]);

  return (
    <main className="min-h-screen bg-stone-50 py-16 sm:py-24" id="student-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-stone-100 rounded-3xl p-8 sm:p-12 shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-0" />
          <div className="relative z-10">
            <span className="text-amber-400 font-mono uppercase tracking-widest text-xs font-semibold block mb-2">
              Academy Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-display text-white mb-2">
              Welcome Back, Artisan Student
            </h1>
            <p className="text-stone-300 text-sm max-w-xl leading-relaxed">
              Track your booked workshop sessions, access historic certificates of guild completion, and message your master instructors.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Booking Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <h2 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-800" />
                  Your Active Workshop Bookings
                </h2>
                <Link href="/courses" className="text-xs font-bold text-amber-800 hover:text-amber-700">
                  Book another &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="p-5 rounded-xl border border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-stone-200 transition-colors"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 text-amber-950 uppercase mb-2">
                        {booking.location}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 mb-1">
                        {booking.courseTitle}
                      </h3>
                      <div className="text-xs text-stone-500 space-y-1">
                        <p>👤 Instructor: <strong className="text-stone-700">{booking.instructor}</strong></p>
                        <p>🕒 Date: <strong className="text-stone-700">{booking.date}</strong> at <strong className="font-mono">{booking.time}</strong></p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <span className="text-sm font-bold text-stone-900 font-mono">
                        {booking.price}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "Confirmed" 
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                          : "bg-amber-50 text-amber-800 border border-amber-100"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messaging Hub Promo */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
                <Mail className="w-5 h-5 text-amber-800" />
                Instructor Helpdesk &amp; Messages
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Got questions about tool lists, safety boots, or directions to the forest barns? Chat instantly with your scheduled instructors.
              </p>
              <Link
                href="/instructor/messages"
                className="inline-flex items-center gap-1.5 bg-stone-900 text-white hover:bg-amber-800 font-bold text-xs font-mono uppercase px-6 py-3.5 rounded-xl transition-all"
              >
                Go to Messaging Center &rarr;
              </Link>
            </div>
          </div>

          {/* Sidebar / Stats & Certificates */}
          <div className="space-y-8">
            {/* Achievements & Certificates */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-lg font-bold font-display text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
                <Award className="w-5 h-5 text-amber-800" />
                Guild Certificates
              </h2>

              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-900 text-lg font-bold">
                      🎓
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 leading-snug">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Issued by: {cert.issuedBy} • {cert.date}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-800 font-bold mt-2 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-max uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" />
                        {cert.status} Guild Graduate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Guidelines Badge */}
            <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-850 shadow-md">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Workshop Protection Rules
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Every hands-on woodworking masterclass includes storage cabinets, protective safety glasses, and organic wax polishes. Remember to wear hard toe leather boots.
              </p>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                🔒 Safe Studio Certified
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
