import React from "react";
import type { Metadata } from "next";
import NextCourseCard from "@/components/nextjs/NextCourseCard";
import { getCourses } from "@/lib/dataService";

export const metadata: Metadata = {
  title: "Woodworking Workshops & Masterclasses | Woodworker Academy",
  description: "Browse all premium, offline traditional woodworking, fine joinery, and tool-care classes near you.",
};

export default async function CoursesListPage() {
  const rawCourses = await getCourses();
  
  // Safe mapping of attributes for standard display
  const courses = (rawCourses || []).map((c) => ({
    ...c,
    categorySlug: c.categoryId,
    locationSlug: c.locationId,
    difficulty: c.difficulty || "Beginner",
    durationLabel: c.durationLabel || "1 Day",
    instructor: c.instructor || "David Mercer",
  }));

  return (
    <main className="min-h-screen bg-white py-16 sm:py-24" id="courses-list-page">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-bold block mb-2">
            Guild Workshops
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-stone-900 mb-4">
            Our Masterclass Catalog
          </h1>
          <p className="text-stone-600">
            Discover hands-on traditional woodwork workshops led by master artisans. Learn tool care, fine joinery, relief carving, and timber-framing in an immersive guild environment.
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-stone-200 max-w-md mx-auto shadow-sm">
            <h3 className="text-stone-850 font-display text-lg font-bold">No courses found</h3>
            <p className="text-stone-500 text-xs mt-2 leading-relaxed">
              We are currently scheduling new classes. Please check back soon or contact support.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {courses.map((course) => (
              <NextCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
