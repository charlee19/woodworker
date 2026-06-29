"use client";

import React, { useState, useEffect } from "react";
import InstructorSidebar from "../../../components/InstructorSidebar";
import { getCourses, getBookings } from "../../../lib/instructorData";
import { supabase } from "../../../lib/supabase";
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function InstructorProfilePage() {
  const [instructorCoursesCount, setInstructorCoursesCount] = useState(4);
  const [instructorPendingBookingsCount, setInstructorPendingBookingsCount] = useState(2);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Messages
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Read counts for Sidebar badges
    try {
      setInstructorCoursesCount(getCourses().length);
      setInstructorPendingBookingsCount(getBookings().filter(b => b.status === "Pending").length);
    } catch (e) {
      console.error("Error loading counts for sidebar:", e);
    }

    async function loadProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Pre-fill email with authenticated email by default
          setEmail(user.email || "");

          const { data, error: profileError } = await supabase
            .from("instructor_profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profileError) {
            throw profileError;
          }

          if (data) {
            setFullName(data.full_name || "");
            setAddress(data.address || "");
            setPostcode(data.postcode || "");
            setPhoneNumber(data.phone_number || "");
            setEmail(data.email || user.email || "");
            setWebsite(data.website || "");
            
            // Check if profile is actually complete (all required fields exist and are not empty)
            const isComplete = !!(
              data.full_name?.trim() &&
              data.address?.trim() &&
              data.postcode?.trim() &&
              data.phone_number?.trim() &&
              data.email?.trim() &&
              data.website?.trim()
            );
            setProfileCompleted(isComplete);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load existing profile information. Please reload the page.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    // Validate inputs locally
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = "Full Name is required";
    if (!address.trim()) errors.address = "Address is required";
    if (!postcode.trim()) errors.postcode = "Postcode is required";
    if (!phoneNumber.trim()) errors.phoneNumber = "Telephone is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!website.trim()) errors.website = "Website is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSaving(false);
      setError("Please fill in all required fields.");
      return;
    }

    setValidationErrors({});

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to save your profile.");
      }

      const profileData = {
        id: user.id,
        full_name: fullName.trim(),
        address: address.trim(),
        postcode: postcode.trim(),
        phone_number: phoneNumber.trim(),
        email: email.trim(),
        website: website.trim(),
        profile_completed: true,
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from("instructor_profiles")
        .upsert(profileData);

      if (upsertError) {
        throw upsertError;
      }

      setSuccess(true);
      setProfileCompleted(true);
      
      // Update fallback completed in localStorage just in case sidebar reads it
      if (typeof window !== "undefined") {
        localStorage.setItem("guild_fallback_profile_completed", "true");
      }
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "An error occurred while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-100" id="instructor-profile-dashboard">
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
                <span className="text-xs font-mono font-bold tracking-widest text-amber-850 uppercase">Instructor Center</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-stone-400 font-mono">Profile Management</span>
              </div>
              <h1 className="text-2xl font-display font-semibold text-stone-950 tracking-tight mt-1">
                Instructor Profile Onboarding
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/instructor"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold font-mono uppercase rounded-xl transition-all shadow-3xs"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Link>
            </div>
          </header>

          {/* MAIN FORM CONTAINER */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-3xs overflow-hidden max-w-4xl p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold font-display text-stone-900 mb-2">Required Contact & Guild Details</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Before creating workshops, the Guild of Woodworkers requires you to submit valid contact information for safety registry, local liability protection, and tax invoicing.
              </p>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                <p className="text-xs text-stone-500 font-mono">Loading your profile details...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6" id="profile-form">
                
                {/* SUCCESS MESSAGE */}
                {success && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl flex items-start gap-3 animate-fade-in" id="success-alert">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold block">Profile Saved Successfully!</strong>
                      <span className="text-[11px] text-emerald-800 leading-relaxed mt-1 block">
                        Your instructor profile is now complete. You can head back to the dashboard and start building your workshops right away.
                      </span>
                    </div>
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-950 rounded-xl flex items-start gap-3 animate-fade-in" id="error-alert">
                    <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold block">Action Required</strong>
                      <span className="text-[11px] text-red-800 leading-relaxed mt-1 block">
                        {error}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* FULL NAME */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. David Green"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full bg-stone-50 border ${validationErrors.fullName ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-amber-600 focus:ring-amber-600"} focus:ring-1 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-600 text-[11px] mt-1.5 font-mono">{validationErrors.fullName}</p>
                    )}
                  </div>

                  {/* TELEPHONE */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Telephone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="e.g. +44 7911 123456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full bg-stone-50 border ${validationErrors.phoneNumber ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-amber-600 focus:ring-amber-600"} focus:ring-1 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all`}
                    />
                    {validationErrors.phoneNumber && (
                      <p className="text-red-600 text-[11px] mt-1.5 font-mono">{validationErrors.phoneNumber}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. david@greenwoodwork.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-stone-50 border ${validationErrors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-amber-600 focus:ring-amber-600"} focus:ring-1 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-[11px] mt-1.5 font-mono">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* WEBSITE */}
                  <div>
                    <label htmlFor="website" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="website"
                      type="text"
                      placeholder="e.g. https://greenwoodwork.co.uk"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className={`w-full bg-stone-50 border ${validationErrors.website ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-amber-600 focus:ring-amber-600"} focus:ring-1 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all`}
                    />
                    {validationErrors.website && (
                      <p className="text-red-600 text-[11px] mt-1.5 font-mono">{validationErrors.website}</p>
                    )}
                  </div>

                  {/* ADDRESS */}
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Physical Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="e.g. Unit 3, The Old Sawmill, Dartington Hall Estate"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full bg-stone-50 border ${validationErrors.address ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-amber-600 focus:ring-amber-600"} focus:ring-1 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all`}
                    />
                    {validationErrors.address && (
                      <p className="text-red-600 text-[11px] mt-1.5 font-mono">{validationErrors.address}</p>
                    )}
                  </div>

                  {/* POSTCODE */}
                  <div>
                    <label htmlFor="postcode" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      placeholder="e.g. TQ9 6EL"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className={`w-full bg-stone-50 border ${validationErrors.postcode ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-amber-600 focus:ring-amber-600"} focus:ring-1 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all`}
                    />
                    {validationErrors.postcode && (
                      <p className="text-red-600 text-[11px] mt-1.5 font-mono">{validationErrors.postcode}</p>
                    )}
                  </div>

                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                  <Link
                    href="/instructor"
                    className="px-5 py-3 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold font-mono uppercase rounded-xl transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-stone-950 hover:bg-stone-850 text-white font-bold text-xs font-mono uppercase px-6 py-3 rounded-xl transition-all shadow-md disabled:bg-stone-400 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Profile & Unlock
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
