'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Music, UserCheck, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Trang Chủ', href: '/', icon: Compass },
    { name: 'Đăng Ký Dự Thi', href: '/register', icon: Music },
    { name: 'Cổng Bình Chọn', href: '/vote', icon: Music },
    { name: 'Cổng Giám Khảo', href: '/judge', icon: UserCheck },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-black/5 w-full backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-3 h-8 bg-gradient-to-b from-primary via-secondary to-accent rounded-full transition-transform group-hover:scale-y-125" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-none tracking-wide text-dark-slate group-hover:text-primary transition-colors">
                  NHỊP BƯỚC VIỆT NAM
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-sans leading-none mt-1">
                  Festival 2026
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm'
                      : 'text-dark-slate/75 hover:text-dark-slate hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-dark-slate p-2 rounded-md hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white/95 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-accent/10 text-accent border-l-4 border-accent'
                    : 'text-dark-slate/80 hover:text-dark-slate hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
