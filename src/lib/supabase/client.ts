"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getBrowserSupabaseClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabasePublicConfig();
    browserClient = createBrowserClient<Database>(url, anonKey);
  }

  return browserClient;
}
