import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NextHero() {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center border-b border-stone-200" id="next-hero">
      {/* Background Image */}
      <div className="absolute inset-0 bg-stone-900 z-0">
        <Image
          src="https://images.unsplash.com/photo-1453733190148-c44698c26578?w=1920&auto=format&fit=crop&q=80"
          alt="Woodworking Artisan"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center mt-12">
        <span className="inline-flex items-center gap-1.5 bg-amber-500 text-stone-900 border border-amber-400 rounded-full px-4 py-1.5 text-xs font-mono tracking-wide uppercase mb-6 shadow-md shadow-black/20 font-bold">
          🌲 Local Workshops &amp; Hands-on Guilds
        </span>
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
          Lock the Soul of Wood with <span className="text-amber-400">Traditional Craft</span>
        </h1>
        
        <p className="text-stone-200 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 drop-shadow">
          Book offline masterclasses with verified master woodworkers. Learn green wood spoon carving, fine cabinet joining, Japanese sashimono, and professional lathe woodturning.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-xl max-w-3xl mx-auto backdrop-blur-sm bg-white/95">
          <form className="flex flex-col sm:flex-row items-center gap-3 w-full" action="/courses">
            <div className="flex-1 w-full relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400 text-sm">
                🔍
              </span>
              <input 
                type="text" 
                name="q"
                placeholder="What do you want to learn? (e.g. stool making...)" 
                className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-xl bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500 text-stone-800 placeholder:text-stone-400 outline-none border transition-colors"
                defaultValue="" 
              />
            </div>
            
            <div className="flex-[0.7] w-full relative border-t sm:border-t-0 sm:border-l border-stone-200 pt-3 sm:pt-0 pl-0 sm:pl-3">
              <span className="absolute inset-y-0 left-0 sm:left-3 flex items-center pl-4 sm:pl-0 text-stone-400 text-sm mt-3 sm:mt-0">
                📍
              </span>
              <input 
                type="text" 
                name="loc"
                placeholder="Location" 
                className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-xl bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500 text-stone-800 placeholder:text-stone-400 outline-none border transition-colors" 
                defaultValue="" 
              />
            </div>

            <button 
              type="submit"
              className="w-full sm:w-auto mt-3 sm:mt-0 bg-stone-900 text-white hover:bg-amber-800 rounded-xl px-8 py-3 sm:py-4 font-bold transition-all whitespace-nowrap drop-shadow-md"
            >
              Search
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
