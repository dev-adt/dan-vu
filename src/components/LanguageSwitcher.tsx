'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '@/lib/translations';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/80 hover:bg-white text-dark-slate border border-slate-300/60 shadow-sm backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-dark-slate/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-slate-200 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-dark-slate/40 uppercase border-b border-slate-100 mb-1">
            Ngôn ngữ / Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-dark-slate hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
