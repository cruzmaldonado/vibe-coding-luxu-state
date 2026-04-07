"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSelector from "./LanguageSelector";
import { createClient } from "@/lib/supabase/client";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { t } = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.avatar_url) {
        setUserAvatar(session.user.user_metadata.avatar_url);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.user_metadata?.avatar_url) {
        setUserAvatar(session.user.user_metadata.avatar_url);
      } else {
        setUserAvatar(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center group-hover:bg-mosque transition-colors">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark group-hover:text-mosque transition-colors">
              LuxeEstate
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1"
              href="#"
            >
              {t.nav.buy}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {t.nav.rent}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {t.nav.sell}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              {t.nav.savedHomes}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <button className="text-nordic-dark hover:text-mosque transition-colors block md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="material-icons">menu</span>
            </button>
            <button className="hidden md:block text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            {userAvatar ? (
              <button 
                className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2 group"
                title={t.nav.logout}
                onClick={async () => await supabase.auth.signOut()}
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-mosque transition-all">
                  <img
                    alt="Profile"
                    className="w-full h-full object-cover"
                    src={userAvatar}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="material-symbols-outlined text-nordic-dark group-hover:text-mosque ml-1">logout</span>
              </button>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 pl-4 border-l border-nordic-dark/10 ml-2 text-sm font-medium text-nordic-dark hover:text-mosque transition-colors"
                title={t.nav.login}
              >
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={`md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'h-auto py-2' : 'h-0 py-0'}`}>
        <div className="px-4 space-y-1">
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10"
            href="#"
          >
            {t.nav.buy}
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            {t.nav.rent}
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            {t.nav.sell}
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            {t.nav.savedHomes}
          </Link>
        </div>
      </div>
    </nav>
  );
}
