"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import SocialButtons from "./SocialButtons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      const checkEmailParam = params.get("checkEmail");
      const confirmedParam = params.get("confirmed");

      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
      if (checkEmailParam) {
        setSuccessMsg("Registration successful! We have sent you an email. Please check your inbox and click the verification link before logging in.");
      } else if (confirmedParam) {
        setSuccessMsg("Email confirmed successfully! Welcome to the Guild. You can now sign in below.");
      }
    }
  }, []);

  const isEmailValid = email.includes("@") && email.includes(".");
  const isFormValid = isEmailValid && password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isFormValid) {
      if (!isEmailValid) {
        setErrorMsg("Please enter a valid email address.");
      } else {
        setErrorMsg("Password must be at least 6 characters.");
      }
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      const user = authData?.user;

      if (user) {
        let role: "customer" | "instructor" | "admin" = "customer";

        // 2. Fetch profile from Supabase (checking the authoritative public "User" table first, then metadata)
        try {
          const { data: dbUser, error: dbUserError } = await supabase
            .from("User")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!dbUserError && dbUser) {
            const rawRole = (dbUser.role || "").toUpperCase();
            if (rawRole === "ADMIN" || rawRole === "SUPERADMIN") {
              role = "admin";
            } else if (rawRole === "CREATOR" || rawRole === "INSTRUCTOR") {
              role = "instructor";
            } else {
              role = "customer";
            }
          } else {
            // Fallback to user metadata
            const rawRole = (user.user_metadata?.role || "").toUpperCase();
            if (rawRole === "ADMIN" || rawRole === "SUPERADMIN") {
              role = "admin";
            } else if (rawRole === "CREATOR" || rawRole === "INSTRUCTOR") {
              role = "instructor";
            } else if (rawRole === "CUSTOMER") {
              role = "customer";
            } else if (email.includes("instructor") || email.includes("david") || email.includes("charlee")) {
              role = "instructor";
            }
          }
        } catch (dbErr) {
          console.warn("DB Profiles check skipped or errored, reading fallback:", dbErr);
          const rawRole = (user.user_metadata?.role || "").toUpperCase();
          if (rawRole === "ADMIN" || rawRole === "SUPERADMIN") {
            role = "admin";
          } else if (rawRole === "CREATOR" || rawRole === "INSTRUCTOR") {
            role = "instructor";
          } else if (rawRole === "CUSTOMER") {
            role = "customer";
          } else if (email.includes("instructor") || email.includes("david") || email.includes("charlee")) {
            role = "instructor";
          }
        }

        // 3. Keep local storage fallback synchronised
        const fallbackUser = {
          name: user.user_metadata?.name || email.split("@")[0] || "Artisan Woodworker",
          role: role === "admin" ? "ADMIN" : (role === "instructor" ? "INSTRUCTOR" : "CUSTOMER"),
          email: email,
        };
        localStorage.setItem("guild_fallback_user", JSON.stringify(fallbackUser));

        setSuccessMsg("Success! Access granted to the Guild.");

        // Redirect based on role
        setTimeout(() => {
          if (role === "admin") {
            router.push("/admin");
          } else {
            router.push(role === "instructor" ? "/instructor" : "/dashboard");
          }
          router.refresh();
        }, 1500);
      } else {
        throw new Error("Unable to read session credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Invalid email or password. Please verify your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6" id="login-form-root">
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-stone-500 text-xs mt-1 leading-relaxed">
          Log in to manage your workshops, portfolio, and woodworking courses.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Login Error</p>
            <p className="mt-0.5 text-red-700 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Login Successful</p>
            <p className="mt-0.5 text-emerald-700 leading-relaxed">{successMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5" id="login-inputs-form">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono mb-1.5">
              Email Address
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
                id="login-input-email"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-amber-900 hover:text-amber-700 font-bold underline transition-colors">
                Forgot password?
              </Link>
            </div>
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
                id="login-input-password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full font-mono text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-md cursor-pointer ${
            isFormValid && !loading
              ? "bg-stone-900 hover:bg-amber-800 text-white"
              : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
          }`}
          id="login-btn-submit"
        >
          {loading ? "Authorizing..." : "Sign In &rarr;"}
        </button>

        {/* Social buttons */}
        <SocialButtons onError={(msg) => setErrorMsg(msg)} />

        {/* Signup Redirect */}
        <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-500" id="signup-redirect-container">
          Don't have an account yet?{" "}
          <Link href="/register" className="text-stone-900 hover:text-amber-800 font-bold text-sm ml-1 transition-colors">
            Register now
          </Link>
        </div>
      </form>
    </div>
  );
}
