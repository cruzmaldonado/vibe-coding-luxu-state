import { supabase } from "@/lib/supabase/server";

export interface Property {
  id: string;
  title: string;
  price_formatted: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  image_url: string;
  image_alt: string;
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
  pageSize: number
): Promise<{ data: Property[]; totalCount: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("featured", false)
    .order("created_at", { ascending: true })
    .range(from, to);

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
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }

  return data ?? [];
}
