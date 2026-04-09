import React from "react";
import HomeContent from "@/components/home/HomeContent";
import { getProperties, getFeaturedProperties } from "@/lib/data/properties";

const PAGE_SIZE = 8;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedParams.page) || 1);

  const searchQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase().trim() : undefined;
  const typeQuery = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;

  const [featuredProperties, { data: newProperties, totalCount }] =
    await Promise.all([
      getFeaturedProperties(),
      getProperties(currentPage, PAGE_SIZE, searchQuery, typeQuery),
    ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const showFeatured = !searchQuery && !typeQuery;

  return (
    <HomeContent
      featuredProperties={featuredProperties}
      newProperties={newProperties}
      currentPage={currentPage}
      totalPages={totalPages}
      showFeatured={showFeatured}
    />
  );
}
