"use client";

import React, { useState } from "react";
import CourseBuilder from "@/components/CourseBuilder";
import { createCourse } from "@/lib/dataService";
import { useRouter } from "next/navigation";

export default function CourseBuilderPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async (courseData: any) => {
    try {
      // Map Course structure from the frontend component back to DBCourse for storage
      const mappedData = {
        title: courseData.title || "Untitled Masterclass",
        slug: courseData.title
          ? courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : "custom-workshop-" + Math.random().toString(36).substring(2, 6),
        description: courseData.description || "",
        longDescription: courseData.description || "",
        price: Number(courseData.price || 45),
        image: courseData.image || "https://images.unsplash.com/photo-1453733190148-c44698c26578",
        published: true,
        categoryId: courseData.location?.toLowerCase() === "london" ? "fine-cabinetry" : "green-woodworking",
        locationId: courseData.location?.toLowerCase() || "devon",
        capacity: Number(courseData.capacity || 6),
        difficulty: courseData.difficulty || "Beginner",
        durationLabel: courseData.durationLabel || "1 Day",
        instructor: "Dev Instructor",
        instructorBio: "Experienced artisan woodworker.",
        instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
        skillsTaught: courseData.skills || ["Sloyd work", "Chiseled joints"],
        materialsIncluded: courseData.materialsIncluded ?? true,
        schedule: courseData.timeSlots?.join(", ") || "Saturdays 09:30 - 16:30",
      };

      await createCourse(mappedData);
      
      setSuccessMsg(`"${mappedData.title}" has been successfully registered and published!`);
      setTimeout(() => {
        setSuccessMsg(null);
        router.push("/courses");
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-10" id="course-builder-page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 shadow-sm animate-pulse">
            <span className="text-xl">🎉</span>
            <div>
              <p className="font-bold text-sm">Course Saved Successfully</p>
              <p className="text-xs text-emerald-700">{successMsg}</p>
            </div>
          </div>
        )}

        <CourseBuilder
          onSave={handleSave}
          onCancel={() => router.push("/")}
        />
      </div>
    </main>
  );
}
