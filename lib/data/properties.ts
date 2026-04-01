import { supabase } from "@/lib/supabase/server";

export interface Property {
  id: string;
  title: string;
  slug: string;
  price_formatted: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  images: string[];
  lat: number;
  lng: number;
  tags: string[];
  featured: boolean;
  is_new: boolean;
  created_at: string;
}

/**
 * Fetches paginated non-featured properties from Supabase.
 * Used for the "New in Market" section with server-side pagination.
 */
export async function getProperties(
  page: number,
  pageSize: number,
  searchQuery?: string,
  typeQuery?: string
): Promise<{ data: Property[]; totalCount: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("featured", false)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
  }

  if (typeQuery && typeQuery !== 'All') {
    query = query.ilike('title', `%${typeQuery}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], totalCount: 0 };
  }

  return { data: data ?? [], totalCount: count ?? 0 };
}

/**
 * Fetches all featured properties from Supabase.
 * Used for the "Featured Collections" section.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: true })
    .limit(4);

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Fetches a single property by its slug.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching property by slug:", error);
    return null;
  }
  
  return (data as Property) || null;
}
