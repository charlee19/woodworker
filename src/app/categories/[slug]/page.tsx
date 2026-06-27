import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NextCourseCard from "@/components/nextjs/NextCourseCard";
import { getCategories, getCourses } from "@/lib/dataService";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} Woodworking Workshops | Woodworker Academy`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const rawCourses = await getCourses({ categorySlug: category.slug });
  const courses = rawCourses.map((c) => ({
    ...c,
    categorySlug: c.categoryId,
    locationSlug: c.locationId,
    difficulty: c.difficulty || "Beginner",
    durationLabel: c.durationLabel || "1 Day",
    instructor: c.instructor || "David Mercer",
  }));

  return (
    <main className="min-h-screen bg-white py-16 sm:py-24" id={`category-page-${category.slug}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-700 font-bold font-mono tracking-wide mb-8 uppercase"
        >
          &larr; Back to all guilds
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-bold block mb-2">
            Specialist Guild
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-stone-900 mb-4">
            {category.name}
          </h1>
          <p className="text-stone-600">
            {category.description}
          </p>
        </div>

        {/* Courses Catalog */}
        <h2 className="text-xl font-bold mb-6 font-display text-stone-900 border-b border-stone-200 pb-3">
          Available Workshops in {category.name} ({courses.length})
        </h2>

        {courses.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-stone-200 max-w-md mx-auto shadow-sm mt-12">
            <h3 className="text-stone-850 font-display text-lg font-bold">No workshops active</h3>
            <p className="text-stone-500 text-xs mt-2 leading-relaxed">
              We are currently scheduling new classes for this guild. Sign up to our newsletter or contact our team to register interest.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-block bg-stone-900 text-white hover:bg-amber-800 text-xs font-bold px-6 py-3 rounded-xl transition-all"
            >
              Browse All Courses
            </Link>
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
