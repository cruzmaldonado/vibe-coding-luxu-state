"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SUPPORTED_LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LOCALE_LABELS[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-nordic-dark hover:bg-black/5 transition-colors"
        aria-label="Select language"
        id="language-selector-btn"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeName}</span>
        <span className="material-icons text-sm text-nordic-muted">expand_more</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-nordic-dark/10 overflow-hidden z-50 animate-[fadeIn_150ms_ease-out]">
          {SUPPORTED_LOCALES.map((code) => {
            const info = LOCALE_LABELS[code as Locale];
            const isActive = code === locale;
            return (
              <button
                key={code}
                onClick={() => { setLocale(code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-mosque/10 text-mosque font-medium"
                    : "text-nordic-dark hover:bg-black/5"
                }`}
              >
                <span className="text-lg leading-none">{info.flag}</span>
                <span>{info.nativeName}</span>
                {isActive && <span className="material-icons text-mosque text-sm ml-auto">check</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
