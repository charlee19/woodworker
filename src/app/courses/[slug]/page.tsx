import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import NextCourseCard from "../../../components/nextjs/NextCourseCard";
import SecureEnrollButton from "../../../components/nextjs/SecureEnrollButton";
import MessageInstructorButton from "../../../components/nextjs/MessageInstructorButton";

import { getCourses, getCourseBySlug } from "../../../lib/dataService";
import { getImagePresetUrl } from "../../../coursesData";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Static params
export async function generateStaticParams() {
  const dbCourses = await getCourses();

  return dbCourses.map((course) => ({
    slug: course.slug,
  }));
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const dbCourse = await getCourseBySlug(resolvedParams.slug);

  if (!dbCourse) {
    return { title: "Course Not Found" };
  }

  const titleText = `${dbCourse.title} | ${dbCourse.instructor || "Artisan"} Traditional Woodworking`;
  const descriptionText = `${dbCourse.description} Learn sloyd work, chiseling, joint construction, and oil finish. Guided by master craftsman. Just £${dbCourse.price} in ${(dbCourse.locationId || "UK").toUpperCase()}.`;

  return {
    title: titleText,
    description: descriptionText,
    alternates: {
      canonical: `https://woodworker.org.uk/courses/${dbCourse.slug}`,
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: `https://woodworker.org.uk/courses/${dbCourse.slug}`,
      siteName: "Woodworker Academy & Guilds",
      images: [
        {
          url: dbCourse.image,
          width: 1200,
          height: 630,
          alt: dbCourse.title,
        },
      ],
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      images: [dbCourse.image],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: CoursePageProps) {
  const resolvedParams = await params;
  const dbCourse = await getCourseBySlug(resolvedParams.slug);

  if (!dbCourse) {
    notFound();
  }

  const course = {
    ...dbCourse,
    categorySlug: dbCourse.categoryId,
    locationSlug: dbCourse.locationId,
    difficulty: dbCourse.difficulty || "Beginner",
    durationLabel: dbCourse.durationLabel || "2 Days",
    instructor: dbCourse.instructor || "Instructor",
    instructorBio: dbCourse.instructorBio || "",
    instructorAvatar: dbCourse.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    skillsTaught: dbCourse.skillsTaught || [],
    materialsIncluded: dbCourse.materialsIncluded ?? true,
    schedule: dbCourse.schedule || "09:30 - 16:30",
    capacity: dbCourse.capacity || 6,
  };

  const rawCourses = await getCourses();

  const courses = rawCourses.map((c) => ({
    ...c,
    categorySlug: c.categoryId,
    locationSlug: c.locationId,
    difficulty: c.difficulty || "Beginner",
    durationLabel: c.durationLabel || "2 Days",
    instructor: c.instructor || "Instructor",
  }));

  // Related courses algorithm: match same category first, or same location. Exclude current.
  let related = courses.filter(
    (c) =>
      c.slug !== course.slug &&
      c.categorySlug === course.categorySlug
  );

  if (related.length < 3) {
    const additional = courses.filter(
      (c) =>
        c.slug !== course.slug &&
        c.locationSlug === course.locationSlug &&
        !related.some((r) => r.slug === c.slug)
    );

    related = [...related, ...additional];
  }

  const relatedCourses = related.slice(0, 3);

  // JSON-LD Structured Data Schema Markup
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Woodworker Guided Carpentry Guilds",
      "sameAs": "https://woodworker.org.uk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://woodworker.org.uk/assets/woodworker-logo.png"
      }
    },
    "image": course.image,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Offline",
      "duration": course.durationLabel,
      "instructor": {
        "@type": "Person",
        "name": course.instructor,
        "description": course.instructorBio,
        "image": course.instructorAvatar
      },
      "location": {
        "@type": "Place",
        "name": `Woodworker Studio Guild Hub`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": course.locationSlug,
          "addressCountry": "UK"
        }
      },
      "offers": {
        "@type": "Offer",
        "category": "Paid",
        "price": course.price,
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-01-01"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://woodworker.org.uk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": "https://woodworker.org.uk/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": course.title,
        "item": `https://woodworker.org.uk/courses/${course.slug}`
      }
    ]
  };

  return (
    <>
      {/* Structured SEO Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="py-12 sm:py-20 bg-stone-50" id={`course-page-${course.slug}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Back Link */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-700 font-bold font-mono tracking-wide mb-8 uppercase"
          >
            &larr; Back to all courses
          </Link>

          {/* Hero banner */}
          <div className="relative h-64 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-stone-900 shadow-sm border border-stone-200 mb-12">
            <Image
              src={getImagePresetUrl(course.image)}
              alt={course.title}
              fill
              priority={true}
              className="object-cover opacity-90 hover:scale-101 transition-transform duration-500"
              sizes="(max-w-1200px) 100vw, 960px"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-stone-900/30 to-black/10" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-amber-600/90 backdrop-blur-sm text-stone-50 text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-md mb-3 inline-block">
                {course.difficulty} Level
              </span>
              <h1 className="text-3xl sm:text-5xl font-display text-white mt-1 leading-tight tracking-tight max-w-3xl">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Course Details Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Main Info */}
            <div className="md:col-span-2 space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-stone-200/80 shadow-sm">
              
              <section className="space-y-4">
                <h2 className="text-2xl font-display text-stone-900 border-b border-stone-100 pb-3">
                  Overview &amp; Philosophy
                </h2>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {course.longDescription}
                </p>
              </section>

              {course.skillsTaught.length > 0 && (
                <section className="space-y-4 pt-4">
                  <h3 className="text-lg font-display text-stone-900">
                    Skills you will master during this workshop:
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-stone-700 list-disc list-inside">
                    {course.skillsTaught.map((skill, index) => (
                      <li key={index} className="font-medium text-stone-650">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Practical info */}
              <section className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-550">📦 Materials Included:</span>{" "}
                  <strong className={course.materialsIncluded ? "text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded" : "text-stone-700"}>
                    {course.materialsIncluded ? "YES" : "NO"}
                  </strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-550">📅 Schedule:</span>{" "}
                  <strong className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded">{course.schedule}</strong>
                </div>
              </section>
            </div>

            {/* Booking / Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions Card */}
              <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-850 shadow-md">
                <div className="text-xs font-mono uppercase text-stone-400 tracking-wider mb-2">
                  Workshop pricing
                </div>
                <div className="text-4xl font-bold text-white mb-6">
                  £{course.price}
                  <span className="text-xs font-normal text-stone-400 font-mono tracking-normal block mt-1">
                    Includes instruction and storage safety gear
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-stone-300 border-t border-stone-800 pt-6 mb-6">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Duration:</span>
                    <strong className="text-white font-mono">{course.durationLabel}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Class size:</span>
                    <strong className="text-white">Max {course.capacity} students</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Location:</span>
                    <strong className="text-amber-400 uppercase font-mono tracking-wider">{course.locationSlug}</strong>
                  </div>
                </div>

                <SecureEnrollButton 
                  courseId={course.id} 
                  courseTitle={course.title} 
                  coursePrice={course.price} 
                  course={course}
                />
              </div>

              {/* Instructor Box */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 shadow-sm border border-stone-100">
                  <Image
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    fill
                    className="object-cover"
                    sizes="64px"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded uppercase tracking-wider font-semibold font-mono mb-1">
                  Your Instructor
                </span>
                <h3 className="font-display text-lg text-stone-900">
                  {course.instructor}
                </h3>
                <p className="text-stone-550 text-xs mt-2 leading-relaxed">
                  {course.instructorBio}
                </p>
              </div>

              {/* Contact Button */}
              <MessageInstructorButton
                instructorName={course.instructor}
                courseTitle={course.title}
                courseId={course.id}
              />

            </div>
          </div>

          {/* RELATED */}
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-6 font-display">
              Related Courses
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedCourses.map((c) => (
                <NextCourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
