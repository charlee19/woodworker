import React from "react";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Access the Guild - Woodworking Marketplace",
  description: "Sign in to your guild account to manage bookings, track student progress, or update course offerings.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white" id="login-page-container">
      {/* LEFT SIDE: Full-height inspirational image (hidden on smaller screens) */}
      <div className="hidden lg:block lg:col-span-5 relative bg-stone-900" id="login-left-panel">
        <Image
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
          alt="Fine Wood Joinery"
          fill
          priority
          sizes="40vw"
          className="object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-stone-950/30" />
        
        {/* Quote overlay on the bottom */}
        <div className="absolute bottom-16 left-12 right-12 text-white space-y-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-md inline-block">
            Legacy Workshop
          </span>
          <h2 className="text-3xl font-display font-medium leading-tight">
            "To shape wood is to converse with time itself. Welcome back to the bench."
          </h2>
          <div className="pt-2 border-t border-stone-700/60 flex items-center justify-between">
            <span className="text-xs text-stone-300 font-mono">
              The Masterclasses Guild
            </span>
            <span className="text-xs text-amber-400 font-mono">
              Est. 1892
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive login form */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 overflow-y-auto" id="login-right-panel">
        {/* Header branding */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪓</span>
            <span className="font-display font-bold text-stone-900 text-sm tracking-widest uppercase">
              Woodworking Guild
            </span>
          </div>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
