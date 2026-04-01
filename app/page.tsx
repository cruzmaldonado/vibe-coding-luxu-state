import React, { Suspense } from "react";
import NavBar from "@/components/ui/NavBar";
import HeroSearch from "@/components/home/HeroSearch";
import { FeaturedPropertyCard, PropertyCard } from "@/components/home/PropertyCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { getProperties, getFeaturedProperties } from "@/lib/data/properties";

const PAGE_SIZE = 8;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedParams.page) || 1);

  const searchQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  const typeQuery = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;

  const [featuredProperties, { data: newProperties, totalCount }] =
    await Promise.all([
      getFeaturedProperties(),
      getProperties(currentPage, PAGE_SIZE, searchQuery, typeQuery),
    ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const showFeatured = !searchQuery && !typeQuery;

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
                  Featured Collections
                </h2>
                <p className="text-nordic-muted mt-1 text-sm">
                  Curated properties for the discerning eye.
                </p>
              </div>
              <a
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
                href="#"
              >
                View all <span className="material-icons text-sm">arrow_forward</span>
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
                New in Market
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">
                All
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
                Buy
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
                Rent
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
