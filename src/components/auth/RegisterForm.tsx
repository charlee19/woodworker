"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import RoleSelector from "./RoleSelector";
import SocialButtons from "./SocialButtons";

export default function RegisterForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"customer" | "instructor" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Field validation helper
  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;
  const passwordsMatch = password === confirmPassword;
  const isFormValid = selectedRole !== null && isEmailValid && isPasswordValid && passwordsMatch && fullName.trim().length > 0;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isFormValid) {
      if (!selectedRole) {
        setErrorMsg("Please select your guild role to continue.");
      } else if (!isEmailValid) {
        setErrorMsg("Please enter a valid email address.");
      } else if (!isPasswordValid) {
        setErrorMsg("Password must be at least 6 characters.");
      } else if (!passwordsMatch) {
        setErrorMsg("Passwords do not match.");
      } else if (fullName.trim().length === 0) {
        setErrorMsg("Please enter your full name.");
      }
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up the user via Supabase Auth
      // We map 'instructor' -> 'CREATOR' and 'customer' -> 'CUSTOMER' to match the database's "Role" ENUM ('CUSTOMER', 'CREATOR', 'ADMIN') exactly.
      // The database automatic sync trigger handle_new_auth_user() reads this raw_user_meta_data->>'role' and casts it.
      // If we pass 'customer' or 'instructor' in lowercase, the cast inside the trigger fails, causing the entire signUp flow to fail.
      const mappedDbRole = selectedRole === "instructor" ? "CREATOR" : "CUSTOMER";

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/login?confirmed=true` : undefined,
          data: {
            name: fullName,
            role: mappedDbRole, // store correct uppercase enum value in user metadata
          },
        },
      });

      if (authError) {
        throw authError;
      }

      const user = authData?.user;

      if (user) {
        try {
          // Explicit upsert into public "User" table to ensure the user is saved.
          const { error: userTableError } = await supabase
            .from("User")
            .upsert([
              {
                id: user.id,
                email: email,
                name: fullName,
                role: mappedDbRole,
              },
            ]);

          if (userTableError) {
            console.warn("Could not upsert user in public.User:", userTableError.message);
          }
        } catch (dbErr) {
          console.warn("DB public.User direct upsert skipped or errored:", dbErr);
        }

        // 3. Store fallback credentials in localStorage so user role state is instantly resolved in developer preview environment
        const fallbackUser = {
          name: fullName,
          role: selectedRole === "instructor" ? "INSTRUCTOR" : "CUSTOMER",
          email: email,
        };
        localStorage.setItem("guild_fallback_user", JSON.stringify(fallbackUser));

        if (!authData.session) {
          // Email confirmation is enabled
          setSuccessMsg("Account registered successfully! A verification email has been sent. Please confirm your email before signing in.");
          
          setTimeout(() => {
            router.push(`/login?email=${encodeURIComponent(email)}&checkEmail=true`);
          }, 3500);
        } else {
          // Email confirmation is disabled
          setSuccessMsg("Account successfully created! Redirecting to your dashboard...");
          
          // Redirect based on role
          setTimeout(() => {
            router.push(selectedRole === "instructor" ? "/instructor" : "/dashboard");
            router.refresh();
          }, 1500);
        }
      } else {
        throw new Error("Could not create user session. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6" id="register-form-root">
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-stone-500 text-xs mt-1 leading-relaxed">
          Join traditional woodworkers to share skills, tools, and courses.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Registration Alert</p>
            <p className="mt-0.5 text-red-700 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Account Created</p>
            <p className="mt-0.5 text-emerald-700 leading-relaxed">{successMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5" id="register-inputs-form">
        {/* Step 1: Role Selection */}
        <RoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />

        {/* Step 2: Account Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono mb-1.5">
              Full Name <span className="text-amber-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. David Mercer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl px-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all"
              id="reg-input-name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono mb-1.5">
              Email Address <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all"
                id="reg-input-email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono mb-1.5">
                Password <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all"
                  id="reg-input-password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono mb-1.5">
                Confirm Password <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-850 placeholder:text-stone-400 outline-none transition-all"
                  id="reg-input-confirm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Continue Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full font-mono text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-md cursor-pointer ${
            isFormValid && !loading
              ? "bg-stone-900 hover:bg-amber-800 text-white"
              : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
          }`}
          id="reg-btn-submit"
        >
          {loading ? "Creating Guild Account..." : "REGISTER NOW"}
        </button>

        {/* Step 4: Social Login Section */}
        <SocialButtons onError={(msg) => setErrorMsg(msg)} />

        {/* Step 5: Legal Text */}
        <div className="text-center text-[11px] text-stone-400 leading-relaxed" id="legal-text-container">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-amber-900 hover:text-amber-700 font-bold underline transition-colors">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-amber-900 hover:text-amber-700 font-bold underline transition-colors">
            Privacy Policy
          </Link>
          .
        </div>

        {/* Step 6: Login Redirect Text */}
        <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-500" id="login-redirect-container">
          Already have an account?{" "}
          <Link href="/login" className="text-stone-900 hover:text-amber-800 font-bold text-sm ml-1 transition-colors">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
