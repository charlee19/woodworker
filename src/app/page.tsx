import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NextHero from "../components/nextjs/NextHero";
import NextCourseCard from "../components/nextjs/NextCourseCard";

// Load our server JSON files instantly
import courses from "../data/courses.json";
import categories from "../data/categories.json";
import locations from "../data/locations.json";

export const metadata: Metadata = {
  title: "Woodworker Marketplace & Academy | Hands-on Woodcraft Workshops",
  description: "Find local green woodworking, cabinet-making, timber-framing, and wood lathe spinning classes in the UK. Book 1-on-1 offline sessions with artisan creators.",
  alternates: {
    canonical: "https://woodworker.org.uk",
  },
  openGraph: {
    title: "Woodworker Marketplace & Academy | Hands-on Woodcraft Workshops",
    description: "Book offline, wood-joint masterclasses with verified experts in London, Devon, and Cornwall.",
    url: "https://woodworker.org.uk",
    siteName: "Woodworker Academy & Guilds",
    images: [
      {
        url: "https://images.unsplash.com/photo-1453733190148-c44698c26578?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Artisan Woodworking Workshops",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Woodworker Marketplace & Academy | Hands-on Woodcraft Workshops",
    description: "Book offline, wood-joint masterclasses with verified experts in London, Devon, and Cornwall.",
    images: ["https://images.unsplash.com/photo-1453733190148-c44698c26578?w=1200&auto=format&fit=crop&q=80"],
  }
};

export default function HomePage() {
  // Pull a subset for home highlights
  const featuredListings = courses.slice(0, 8);
  const featuredCategories = categories.slice(0, 8);

  // Organization schema markup
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Woodworker Guided Carpentry Guilds & Marketplace",
    "url": "https://woodworker.org.uk",
    "logo": "https://woodworker.org.uk/assets/woodworker-logo.png",
    "sameAs": [
      "https://www.facebook.com/woodworkeruk",
      "https://www.instagram.com/woodworkeruk"
    ],
    "description": "Find local green woodworking, cabinet-making, timber-framing, and wood lathe spinning classes in the UK."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      
      <div id="next-home-page">
        {/* Decorative Brand Hero */}
        <NextHero />

        {/* Featured Listings Panel (Top Section) */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="w-full px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-bold block mb-2">
                Premium Selection
              </span>
              <h2 className="text-3xl sm:text-4xl font-display text-stone-900 mb-4">
                Featured Listings
              </h2>
              <p className="text-stone-600">
                Outstanding masterclasses chosen for their exceptional quality and artisan instruction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredListings.map((course) => (
                <NextCourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/courses"
                className="text-amber-850 hover:text-amber-700 font-bold transition-colors inline-flex items-center gap-2 text-sm"
              >
                View All Courses &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid Hub (Bottom Section) */}
        <section className="py-16 sm:py-24 bg-white border-t border-stone-100">
          <div className="w-full px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-bold block mb-2">
                Specialist Guilds
              </span>
              <h2 className="text-3xl sm:text-4xl font-display text-stone-900 mb-4">
                Explore Our Specialist Guilds
              </h2>
              <p className="text-stone-600">
                Select an heirloom category to discover focused, project-oriented woodwork lessons near you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredCategories.map((cat) => (
                <article 
                  key={cat.slug} 
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all h-full"
                  id={`cat-card-${cat.slug}`}
                >
                  {/* Top visual section (clickable) */}
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    <Link href={`/categories/${cat.slug}`} className="block h-full w-full relative group">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-w-768px) 100vw, 350px"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/10" />
                    </Link>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-stone-900 text-lg hover:text-amber-700 transition-colors mb-2 leading-snug font-display">
                      <Link href={`/categories/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </h3>

                    <p className="text-sm text-stone-600 line-clamp-3 mb-4 flex-grow">
                      {cat.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-stone-100">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="text-amber-800 hover:text-amber-700 font-bold text-xs font-mono uppercase tracking-wide inline-flex items-center gap-1"
                      >
                        Explore Guild &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/categories"
                className="text-stone-900 hover:text-stone-700 font-bold transition-colors inline-flex items-center gap-2 text-sm"
              >
                Browse all categories &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Locations Banner */}
        <section className="py-16 sm:py-24 bg-white border-t border-stone-100">
          <div className="w-full px-4 sm:px-6">
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-stone-100 rounded-3xl p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-0" />
              <div className="relative z-10 max-w-2xl">
                <span className="text-amber-400 font-mono uppercase tracking-wider text-xs block mb-3 font-semibold">
                  Sloys &amp; Lathes Near You
                </span>
                <h2 className="text-3xl sm:text-4xl font-display mb-4 text-white">
                  Find Creative Woodworkers in Your Area
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed mb-8">
                  From cozy forest barn studios in Totnes, Devon, to modern high-precision ateliers in London Walthamstow and the sea cliffs of Cornwall, we maintain clean guilds with fully loaded cabinets.
                </p>
                <div className="flex flex-wrap gap-3">
                  {locations.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/locations/${loc.slug}`}
                      className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 hover:border-amber-400/40 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all"
                    >
                      📍 {loc.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <Link
                  href="/locations"
                  className="bg-white hover:bg-amber-100 text-stone-900 font-bold px-8 py-4 rounded-xl transition-all shadow-md block text-center"
                >
                  Browse All Map Hubs &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
