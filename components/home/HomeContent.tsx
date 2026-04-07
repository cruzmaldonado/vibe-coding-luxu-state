"use client";

import React, { Suspense } from "react";
import NavBar from "@/components/ui/NavBar";
import HeroSearch from "@/components/home/HeroSearch";
import { FeaturedPropertyCard, PropertyCard } from "@/components/home/PropertyCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Property } from "@/lib/data/properties";

interface HomeContentProps {
  featuredProperties: Property[];
  newProperties: Property[];
  currentPage: number;
  totalPages: number;
  showFeatured: boolean;
}

export default function HomeContent({
  featuredProperties,
  newProperties,
  currentPage,
  totalPages,
  showFeatured,
}: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<div className="py-12 md:py-16 text-center">Loading search...</div>}>
          <HeroSearch />
        </Suspense>

        {showFeatured && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">
                  {t.home.featuredTitle}
                </h2>
                <p className="text-nordic-muted mt-1 text-sm">
                  {t.home.featuredSubtitle}
                </p>
              </div>
              <a
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
                href="#"
              >
                {t.home.viewAll} <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => (
                <FeaturedPropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                {t.home.newInMarket}
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {t.home.newInMarketSubtitle}
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">
                {t.home.all}
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
                {t.home.buy}
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
                {t.home.rent}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>

          <Suspense fallback={<div className="mt-12 text-center text-sm text-nordic-muted">Loading pages...</div>}>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
