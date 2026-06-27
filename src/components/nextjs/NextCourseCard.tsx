"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getImagePresetUrl } from "@/coursesData";

export default function NextCourseCard({ course }: any) {
  // Safe fallbacks to prevent runtime crashes if some fields are missing
  const slug = course?.slug || (course?.title ? course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "") || course?.id || "";
  const titleText = course?.title || "Woodworking Workshop";
  const descText = course?.description || "";
  const rawImage = course?.image || course?.images?.[0] || "";
  const imageSrc = getImagePresetUrl(rawImage);
  const instructorName = course?.instructor || "David Mercer";
  const difficulty = course?.difficulty || "Beginner";
  const durationLabel = course?.durationLabel || "1 Day";
  const price = course?.price || "0";

  return (
    <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all h-full" id={`course-card-${slug}`}>
      {/* Top visual section (clickable) */}
      <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
        <Link href={`/courses/${slug}`} className="block h-full w-full relative group">
          <Image
            src={imageSrc}
            alt={titleText}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-w-768px) 100vw, 350px"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/10" />
        </Link>
        
        {/* Top Tags Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="bg-amber-500 text-stone-900 text-[9px] font-mono tracking-wider uppercase font-extrabold px-2 py-0.5 rounded-md shadow-xs">
            {difficulty}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-xs text-stone-100 text-[9px] font-mono px-2 py-0.5 rounded-md">
          🕒 {durationLabel}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title - clickable to detail page */}
        <h3 className="font-bold text-stone-900 text-lg hover:text-amber-700 transition-colors mb-2 leading-snug">
          <Link href={`/courses/${slug}`}>
            {titleText}
          </Link>
        </h3>

        <p className="text-sm text-stone-600 line-clamp-2 mb-4 flex-grow">
          {descText}
        </p>

        {/* Footer of the card */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-100 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs text-stone-550 flex-shrink-0">👨‍🎨</span>
            <span className="text-xs text-stone-700 font-medium truncate">
              {instructorName}
            </span>
          </div>

          <div className="bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded-lg font-bold font-mono whitespace-nowrap">
            £{price}
          </div>
        </div>
      </div>
    </article>
  );
}
