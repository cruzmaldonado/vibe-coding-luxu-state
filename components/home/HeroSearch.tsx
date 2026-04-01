"use client";

import React, { useState } from "react";
import SearchFiltersModal from "@/components/ui/SearchFiltersModal";
import { useRouter, useSearchParams } from "next/navigation";

export default function HeroSearch() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "All");

  const updateUrl = (q: string, t: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (t && t !== "All") params.set("type", t);
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(searchTerm, activeType);
  };

  const handleTypeClick = (type: string) => {
    setActiveType(type);
    updateUrl(searchTerm, type);
  };

  const getChipClass = (type: string) => {
    return activeType === type
      ? "whitespace-nowrap px-5 py-2 rounded-full bg-nordic-dark text-white text-sm font-medium shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5"
      : "whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5";
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          Find your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">sanctuary</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>
        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque transition-all text-lg"
            placeholder="Search by city, neighborhood, or address..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
          >
            Search
          </button>
        </form>
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          <button onClick={() => handleTypeClick("All")} className={getChipClass("All")}>
            All
          </button>
          <button onClick={() => handleTypeClick("House")} className={getChipClass("House")}>
            House
          </button>
          <button onClick={() => handleTypeClick("Apartment")} className={getChipClass("Apartment")}>
            Apartment
          </button>
          <button onClick={() => handleTypeClick("Villa")} className={getChipClass("Villa")}>
            Villa
          </button>
          <button onClick={() => handleTypeClick("Penthouse")} className={getChipClass("Penthouse")}>
            Penthouse
          </button>
          <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
          <button 
            onClick={() => setIsFiltersOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <span className="material-icons text-base">tune</span> Filters
          </button>
        </div>
      </div>
      
      {isFiltersOpen && (
        <SearchFiltersModal onClose={() => setIsFiltersOpen(false)} />
      )}
    </section>
  );
}
