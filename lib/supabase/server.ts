import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server-side Supabase client.
 * Use this in Next.js Server Components, Server Actions, and Route Handlers.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
