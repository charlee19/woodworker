import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getLocations } from "@/lib/dataService";

export const metadata: Metadata = {
  title: "Artisan Woodshop Map Hubs | Woodworker Academy",
  description: "Browse traditional guilds in Devon, London, and Cornwall. Connect with creative carpenters, tool libraries, and local wood shops.",
};

export default async function LocationsListPage() {
  const locations = await getLocations();

  return (
    <main className="min-h-screen bg-stone-50 py-16 sm:py-24" id="locations-list-page">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-md inline-block mb-3">
            Guild Locations
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-stone-900 tracking-tight mb-4">
            Our Traditional Woodshop Hubs
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            From green forest barn woodshops in Devon to high-precision metropolitan ateliers in London, visit our fully stocked woodshops.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {locations.map((loc) => (
            <article 
              key={loc.slug} 
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all h-full"
              id={`loc-card-${loc.slug}`}
            >
              {/* Top visual section (clickable) */}
              <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
                <Link href={`/locations/${loc.slug}`} className="block h-full w-full relative group">
                  <Image
                    src={loc.image || "https://images.unsplash.com/photo-1453733190148-c44698c26578?w=600"}
                    alt={loc.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-w-768px) 100vw, 350px"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/10" />
                </Link>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] text-amber-800 font-mono uppercase tracking-widest font-bold mb-1.5 block">
                  📍 {loc.county || "United Kingdom"}
                </span>
                
                <h2 className="font-bold text-stone-900 text-xl hover:text-amber-700 transition-colors mb-2 leading-snug font-display">
                  <Link href={`/locations/${loc.slug}`}>
                    {loc.name}
                  </Link>
                </h2>

                <p className="text-stone-400 text-xs font-mono mb-4 leading-relaxed truncate">
                  {loc.address}
                </p>

                <p className="text-sm text-stone-600 leading-relaxed mb-6 flex-grow">
                  {loc.description}
                </p>

                <div className="mt-auto pt-5 border-t border-stone-100">
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="text-amber-850 hover:text-amber-700 font-bold text-xs font-mono uppercase tracking-widest inline-flex items-center gap-1.5"
                  >
                    View Workshops &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
