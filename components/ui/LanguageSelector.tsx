"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const LOCALE_ABBR: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

const FLAG_URLS: Record<Locale, string> = {
  en: "https://flagcdn.com/w20/us.png",
  es: "https://flagcdn.com/w20/es.png",
  fr: "https://flagcdn.com/w20/fr.png",
};

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium text-nordic-dark hover:bg-black/5 transition-colors"
        aria-label="Select language"
        id="language-selector-btn"
      >
        <img src={FLAG_URLS[locale]} alt={LOCALE_ABBR[locale]} className="w-[18px] h-auto rounded-sm drop-shadow-sm" />
        <span className="text-[13px] font-semibold tracking-wide ml-0.5">{LOCALE_ABBR[locale]}</span>
        <span className="material-icons text-sm text-nordic-muted -ml-1">{open ? 'expand_less' : 'expand_more'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[105px] bg-[#35363a] p-1.5 rounded-xl shadow-xl shadow-black/20 border border-white/10 z-50 animate-[fadeIn_150ms_ease-out]">
          {SUPPORTED_LOCALES.map((code) => {
            const abbr = LOCALE_ABBR[code as Locale];
            const isActive = code === locale;
            return (
              <button
                key={code}
                onClick={() => { setLocale(code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#4279d4] text-white font-medium shadow-sm"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className={`material-icons text-[16px] leading-none flex-shrink-0 -ml-1 ${isActive ? 'opacity-100 text-white' : 'opacity-0'}`}>
                  check
                </span>
                <img src={FLAG_URLS[code as Locale]} alt={abbr} className="w-[18px] h-auto rounded-[2px] shadow-sm ml-0.5" />
                <span className="font-semibold tracking-wide ml-0.5">{abbr}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
