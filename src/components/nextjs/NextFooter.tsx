import React from "react";
import Link from "next/link";

export default function NextFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800" id="next-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                🪵
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-medium tracking-tight text-white font-display">
                  Woodworker
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono -mt-1">
                  Active Woodworking Community
                </span>
              </div>
            </div>
            <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
              We connect passion with precision. Register for hands-on, local timber framing, cabin sculpting, spoon carving, and furniture-turning classes in the UK.
            </p>
            <div className="text-xs text-stone-500 font-mono">
              VPS Node.js Deploy Target: Plesk Obsidian
            </div>
          </div>

          {/* Quick Listings */}
          <div>
            <h4 className="text-sm font-semibold font-mono uppercase text-stone-100 tracking-wider mb-6">
              Academy &amp; Craft
            </h4>
            <ul className="space-y-3.5 text-sm text-stone-400">
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors">
                  All Workshops
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-amber-400 transition-colors">
                  Course Categories
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-amber-400 transition-colors">
                  Regional Woodshops
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-400 transition-colors">
                  Artisan Blog
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-amber-400 transition-colors font-medium">
                  Instructor Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors font-mono text-[11px] text-stone-400">
                  ⚙️ Admin Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations Quick Jump */}
          <div>
            <h4 className="text-sm font-semibold font-mono uppercase text-stone-100 tracking-wider mb-6">
              Featured Hubs
            </h4>
            <ul className="space-y-3.5 text-sm text-stone-400">
              <li>
                <Link href="/locations/devon" className="hover:text-amber-400 transition-colors">
                  Devon Woodshop
                </Link>
              </li>
              <li>
                <Link href="/locations/london" className="hover:text-amber-400 transition-colors">
                  London Atelier
                </Link>
              </li>
              <li>
                <Link href="/locations/cornwall" className="hover:text-amber-400 transition-colors">
                  Cornwall Coastal Guild
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          <div>
            &copy; {new Date().getFullYear()} Woodworker Marketplace. All rights reserved. Built with Next.js 14 (App Router).
          </div>
          <div className="flex gap-6 font-mono">
            <span>Fast Build Speed</span>
            <span>Static HTML SEO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
