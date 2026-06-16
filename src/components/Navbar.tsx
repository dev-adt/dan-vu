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
    { name: 'Quản Trị', href: '/admin', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 w-full backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-3 h-8 bg-gradient-to-b from-primary via-secondary to-accent rounded-full transition-transform group-hover:scale-y-125" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-none tracking-wide text-light-cream group-hover:text-secondary transition-colors">
                  NHỊP BƯỚC VIỆT NAM
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-secondary font-sans leading-none mt-1">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-secondary border border-secondary/20 shadow-md'
                      : 'text-light-alabaster/70 hover:text-light-cream hover:bg-white/5 border border-transparent'
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
              className="text-light-alabaster p-2 rounded-md hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-dark-obsidian/95 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/30 to-accent/30 text-secondary border-l-4 border-secondary'
                    : 'text-light-alabaster/80 hover:text-light-cream hover:bg-white/5'
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
