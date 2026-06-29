"use client";

import React from "react";
import { GraduationCap, Hammer, CheckCircle2 } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: "customer" | "instructor" | null;
  onChange: (role: "customer" | "instructor") => void;
}

export default function RoleSelector({ selectedRole, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-4" id="role-selector-container">
      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
        Select Your Guild Role <span className="text-amber-600">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Card */}
        <button
          type="button"
          onClick={() => onChange("customer")}
          className={`relative flex flex-col p-5 text-left rounded-2xl border-2 transition-all duration-200 outline-none ${
            selectedRole === "customer"
              ? "border-amber-600 bg-amber-50/40 shadow-sm"
              : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/30"
          }`}
          id="role-btn-customer"
        >
          {selectedRole === "customer" && (
            <div className="absolute top-4 right-4 text-amber-600">
              <CheckCircle2 className="w-5 h-5 fill-amber-50" />
            </div>
          )}
          <div className={`p-3 rounded-xl w-fit mb-4 transition-colors ${
            selectedRole === "customer" ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-600"
          }`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-stone-900 text-base mb-1">
            Student/Customer
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            Learn and buy woodworking courses to master traditional crafts.
          </p>
        </button>

        {/* Instructor Card */}
        <button
          type="button"
          onClick={() => onChange("instructor")}
          className={`relative flex flex-col p-5 text-left rounded-2xl border-2 transition-all duration-200 outline-none ${
            selectedRole === "instructor"
              ? "border-amber-600 bg-amber-50/40 shadow-sm"
              : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/30"
          }`}
          id="role-btn-instructor"
        >
          {selectedRole === "instructor" && (
            <div className="absolute top-4 right-4 text-amber-600">
              <CheckCircle2 className="w-5 h-5 fill-amber-50" />
            </div>
          )}
          <div className={`p-3 rounded-xl w-fit mb-4 transition-colors ${
            selectedRole === "instructor" ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-600"
          }`}>
            <Hammer className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-stone-900 text-base mb-1">
            Guild Instructor
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            Teach and sell woodworking courses, sharing traditional techniques.
          </p>
        </button>
      </div>
    </div>
  );
}
