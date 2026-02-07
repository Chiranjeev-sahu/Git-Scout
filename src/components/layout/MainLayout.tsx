import React from 'react';

import { Bookmark, Search } from 'lucide-react';
import { Link, Outlet } from 'react-router';

import { Button } from '@/components/ui/button';

export const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#FBFCF8] font-sentient selection:bg-black selection:text-white flex flex-col">
      {/* Top Navigation - Persistent */}
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#FBFCF8]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-1.5 rounded-full group-hover:scale-105 transition-transform duration-300">
              <Search size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tighter text-zinc-900">
              Git Scout
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="group rounded-full hover:bg-black/5"
            >
              <Bookmark
                size={46}
                className="text-zinc-600 transition-colors group-hover:text-black group-hover:fill-black/10"
              />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl  mx-auto px-4 md:px-6 py-6 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};
