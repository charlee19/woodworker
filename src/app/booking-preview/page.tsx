"use client";

import React, { useState } from "react";
import BookingForm from "../../components/BookingForm";
import coursesJson from "../../data/courses.json";
import { Course, Booking, EmbedConfig } from "../../types";
import { Sparkles, Calendar, Settings, ShieldCheck, Heart, User, CheckCircle2, RotateCcw } from "lucide-react";

export default function BookingPreviewPage() {
  // Map local JSON data to clean Course types
  const mappedCourses: Course[] = coursesJson.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    durationType: "daily",
    durationLabel: c.durationLabel || "1 Day",
    price: c.price,
    capacity: c.capacity || 6,
    instructorId: "inst_david",
    instructor: c.instructor || "Artisan Instructor",
    difficulty: (c.difficulty === "Advanced" ? "Advanced" : c.difficulty === "Intermediate" ? "Intermediate" : "Beginner"),
    materialsIncluded: !!c.materialsIncluded,
    location: c.locationSlug || "devon",
    image: c.image,
    timeSlots: ["09:00 - 12:00", "13:00 - 16:00", "17:00 - 20:00"]
  }));

  // Stateful interactive configuration
  const [theme, setTheme] = useState<"amber" | "emerald" | "stone" | "slate">("amber");
  const [primaryColor, setPrimaryColor] = useState("#d97706");
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [showInstructor, setShowInstructor] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(mappedCourses[0] || null);
  const [formKey, setFormKey] = useState(0); // For resetting/re-mounting form to test states

  // Capture list of bookings generated in the live session
  const [localSessionBookings, setLocalSessionBookings] = useState<Booking[]>([]);

  // Config object to supply to the BookingForm component
  const currentConfig: EmbedConfig = {
    theme,
    primaryColor,
    font: "sans",
    showDifficulty,
    showInstructor,
    iframeHeight: 650
  };

  // Submission handler
  const handleBookingSubmit = (booking: Booking) => {
    // Also save in local storage to sync with student portal dashboard if desired
    const existingBookingsStr = localStorage.getItem("instructor_bookings") || "[]";
    let existingBookings = [];
    try {
      existingBookings = JSON.parse(existingBookingsStr);
    } catch (_) {}

    const detailedBooking = {
      ...booking,
      status: "Confirmed" as const
    };
    existingBookings.unshift(detailedBooking);
    localStorage.setItem("instructor_bookings", JSON.stringify(existingBookings));

    // Update state to render on the live debug feed
    setLocalSessionBookings((prev) => [detailedBooking, ...prev]);
  };

  const handleResetForm = () => {
    setFormKey((k) => k + 1);
  };

  const handlePresetColor = (t: "amber" | "emerald" | "stone" | "slate", hex: string) => {
    setTheme(t);
    setPrimaryColor(hex);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col pb-16">

      {/* Main Content Arena */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Controls & Sandbox Variables */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* Header Card */}
          <div className="bg-stone-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-stone-850">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-mono font-bold tracking-wider uppercase">
                Active Sandbox
              </span>
            </div>
            <h1 className="text-2xl font-display font-semibold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              Booking Widget
            </h1>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              This sandbox page lets you view, test, and style the checkout calendar flow. Modify settings below to dynamically alter visual modes.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-sm font-semibold text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Settings className="w-4 h-4 text-amber-600" />
              Embed Customization
            </h2>

            {/* Theme Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 block">Theme Palette & Presets</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handlePresetColor("amber", "#d97706")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === "amber" ? "bg-amber-50 border-amber-500 ring-2 ring-amber-200" : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-600" />
                  <span className="text-[10px] font-bold text-stone-700">Amber</span>
                </button>

                <button
                  onClick={() => handlePresetColor("emerald", "#059669")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === "emerald" ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200" : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-600" />
                  <span className="text-[10px] font-bold text-stone-700">Emerald</span>
                </button>

                <button
                  onClick={() => handlePresetColor("stone", "#57534e")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === "stone" ? "bg-stone-50 border-stone-500 ring-2 ring-stone-200" : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-stone-700" />
                  <span className="text-[10px] font-bold text-stone-700">Stone</span>
                </button>

                <button
                  onClick={() => handlePresetColor("slate", "#475569")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    theme === "slate" ? "bg-slate-50 border-slate-500 ring-2 ring-slate-200" : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-600" />
                  <span className="text-[10px] font-bold text-stone-700">Slate</span>
                </button>
              </div>
            </div>

            {/* Hex Customizer */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 block">Primary Color Accent</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-stone-200 overflow-hidden"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono uppercase tracking-widest text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Display Feature Toggles */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-stone-500 block">Toggle Course Elements</label>
              
              <label className="flex items-center gap-2.5 text-xs text-stone-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDifficulty}
                  onChange={(e) => setShowDifficulty(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                Show Difficulty Badges
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInstructor}
                  onChange={(e) => setShowInstructor(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                Show Instructor Info
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={handleResetForm}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Reset Form"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Widget
              </button>
            </div>
          </div>

          {/* Real-time Webhooks / Submissions Log */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center justify-between">
              <span>Local Session Bookings</span>
              <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-[10px]">
                {localSessionBookings.length} Submitted
              </span>
            </h3>

            {localSessionBookings.length === 0 ? (
              <p className="text-xs text-stone-400 italic text-center py-6 border border-dashed border-stone-100 rounded-2xl bg-stone-50">
                No orders processed yet in this sandbox instance. Submit the form on the right to trigger real-time simulated webhooks.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {localSessionBookings.map((b) => (
                  <div key={b.id} className="p-3 bg-stone-50 border border-stone-150 rounded-xl text-xs space-y-1 relative">
                    <span className="absolute right-2 top-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] rounded-full font-bold uppercase">
                      Confirmed
                    </span>
                    <p className="font-semibold text-stone-800 leading-tight pr-14">{b.courseTitle}</p>
                    <p className="text-stone-500 font-mono text-[10px]">Date: {b.bookingDate} • {b.timeSlot}</p>
                    <p className="text-stone-500">Student: {b.customerName} ({b.customerEmail})</p>
                    <p className="text-stone-600 font-medium">Phone: {b.customerPhone} • Total: £{b.totalPrice}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The Interactive Live Booking Form Embed */}
        <div className="flex-1 bg-white rounded-3xl border border-stone-200/80 shadow-md overflow-hidden flex flex-col">
          {/* Top Bar Decoration */}
          <div className="bg-stone-50 border-b border-stone-200/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs font-semibold text-stone-500 font-mono ml-2">
                BookingForm.tsx Viewport
              </span>
            </div>
            <div className="text-[10px] text-stone-400 font-mono">
              Theme: {theme.toUpperCase()}
            </div>
          </div>

          {/* Form wrapper */}
          <div className="p-6 md:p-8 flex-1 bg-white" key={formKey}>
            <BookingForm
              courses={mappedCourses}
              initialSelectedCourse={selectedCourse}
              config={currentConfig}
              onSubmitBooking={handleBookingSubmit}
              onBackToDirectory={() => alert("Simulation: onBackToDirectory triggered!")}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
